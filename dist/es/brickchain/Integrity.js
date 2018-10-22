var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as jose from "node-jose";
import { Realm, ActionDescriptor } from '../model';
/**
 * Key handling for integrity clients and controllers.
 *
 * Rules for key "kid" and "use":
 *
 *   realms are prefixed with realm-[domain-name]
 *   controllers are prefixed with realm-[domain-name]#[id]
 *   users are prefixed with user-[id]
 *
 * Use:
 *   "device", "sign", "access", "root", "..."
 *
 * Certificate storage & history:
 *   callback binding to store and retreve history of objects.
 *
 */
export class Integrity {
    constructor(keystorage, privateKeyName = "root") {
        this.keystorage = keystorage;
        this.privateKeyName = privateKeyName;
    }
    static CreateIntegrity(changeCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            return Integrity.LoadIntegrity(new Buffer("{}"), changeCallback);
        });
    }
    static LoadIntegrity(input, changeCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            let ks = yield jose.JWK.asKeyStore(input);
            ks.verifier = yield jose.JWS.createVerify(ks.keystorage);
            ks.changeCallback = changeCallback;
            return new Integrity(ks);
        });
    }
    notify(key, op) {
        if (this.changeCallback) {
            try {
                this.changeCallback(key, op, this.keystorage);
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
        return Promise.resolve();
    }
    setPrivate(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key.kid == this.privateKeyName) {
                this.privateKey = key;
            }
            let k = yield this.keystorage.add(key);
            yield this.notify(k, Integrity.OP_SET);
            return k;
        });
    }
    getPrivate(kid = "") {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.privateKey) {
                this.privateKey = yield this.keystorage.get(kid ? kid : this.privateKeyName, true);
            }
            return this.privateKey;
        });
    }
    createPrivate(kid) {
        return __awaiter(this, void 0, void 0, function* () {
            let k = yield this.keystorage.generate('EC', 'P-256', { 'kid': kid });
            yield this.notify(k, Integrity.OP_SET);
            return k;
        });
    }
    // Adds a singed key as "signedPublicKey" to key.
    signPublicKey(pubKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let privateKey = this.getPrivate();
            let jws = yield jose.JWS.createSign({ format: 'flattened' }, { key: privateKey, reference: 'jwk' }).update(JSON.stringify(pubKey), 'utf8').final();
            return jws;
        });
    }
    deleteKey(kid) {
        return __awaiter(this, void 0, void 0, function* () {
            let k = yield this.keystorage.remove(kid);
            if (k)
                yield this.notify(k, Integrity.OP_DEL);
            return k;
        });
    }
    parseAndAddKey(name, json) {
        return __awaiter(this, void 0, void 0, function* () {
            let k = JSON.parse(json);
            let key = yield this.keystorage.add(json, "json");
            if (key)
                yield this.notify(k, Integrity.OP_SET);
            return key;
        });
    }
    getKey(name) {
        return this.keystorage.get(name);
    }
    createCertificate(subKey, keyType = '*', documentTypes = ['*'], ttl = 3600) {
        return this.getKey('root')
            .then(rootKey => ({
            timestamp: new Date(),
            root: rootKey.publicKey,
            subKey: subKey.publicKey,
            keyType: keyType,
            documentTypes: documentTypes,
            ttl: ttl,
        }))
            .then(chain => this.signCompact('root', chain))
            .then(chain => subKey.certificateChain = chain)
            .then(() => subKey);
    }
    sign(keyName, input) {
        return this.getPrivate(keyName)
            .then((key) => key.sign(input));
    }
    signCompact(keyName, input) {
        return this.getPrivate(keyName)
            .then((key) => key.sign(input, true));
    }
    encrypt(recipient, input) {
        let buf = (typeof (input) == 'string') ? input : JSON.stringify(input);
        return jose.JWE.createEncrypt({ protect: ['enc'], contentAlg: 'A256GCM' }, recipient)
            .update(buf).final();
    }
    // validate and return verify result
    verify(jws) {
        return this.verifier.verify(jws);
    }
    // validate and return payload as string
    verified(jws) {
        return this.verify(jws)
            .then(verified => verified.payload.toString("utf8"));
    }
    // validate and return payload as string
    verifiedJSON(jws) {
        return __awaiter(this, void 0, void 0, function* () {
            let json = yield this.verified(jws);
            return JSON.parse(json);
        });
    }
    // parse brickchain protocol objects
    parseJSONSchema(json) {
        let type = json["@type"];
        let i = type.indexOf("://");
        if (i > 0)
            type = type.substring(i + 3);
        i = type.indexOf("#");
        if (i > 0)
            type = type.substring(0, i);
        switch (type) {
            case "action-descriptor":
            case "https://":
                return new ActionDescriptor(json);
            case "realm-descriptor":
            case "https://realm...":
                return new RealmDescriptor(json);
            case "controller-descriptor":
            case "https://realm...":
                return new RealmDescriptor(json);
        }
        throw new Error("unknown schema type: " + type);
    }
    // parse realm description, verify signature and store keys.
    parseSignedRealm(name, jws) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof (jws) == 'string')
                jws = JSON.parse(jws);
            let result = yield this.verify(jws);
            let obj = JSON.parse(result.payload);
            if (name != '*' && obj.name != name)
                throw new Error("Name does not match");
            let realm = Object.assign(new Realm(), obj);
            realm.timestamp = new Date(obj["@timestamp"]);
            realm.signed = JSON.stringify(jws);
            realm.icon = obj.icon ? obj.icon : '';
            realm.banner = obj.banner ? obj.banner : '';
            let pubKey = jose.JWK.asKey(obj.publicKey, 'json');
            realm.publicKey = pubKey;
            return realm;
        });
    }
    verifyRealmHistory(realm) {
        let prevKey = realm.publicKey;
        let pl = realm.keyHistory.reverse()
            .map((eventJWS) => this.verifier.verify(eventJWS));
        return Promise.all(pl)
            .then(events => {
            events.forEach((event, i) => {
                if (event.key.thumbprint() != prevKey.thumbprint())
                    return Promise.reject("thumbprint miss match in chain");
            });
            return Promise.resolve("");
        });
    }
    compareRealmHistory(realmA, realmB) {
        return this.verifyRealmHistory(realmA)
            .then(myThumbprint => this.verifyRealmHistory(realmB)
            .then(otherThumbprint => myThumbprint == otherThumbprint ? Promise.resolve() : Promise.reject("key history didn't match")));
    }
}
Integrity.OP_SET = 1;
Integrity.OP_DEL = 2;
//# sourceMappingURL=Integrity.js.map