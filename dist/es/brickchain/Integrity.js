var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as jose from "node-jose";
import { Action, ActionDescriptor, Certificate, ControllerDescriptor, ControllerBinding, Fact, RealmDescriptor, Mandate, MandateToken, ScopeRequest, SignatureRequest, UrlResponse, Message, Multipart } from './model/';
function getRoot() {
    // Establish the root object, `window` in the browser, or `global` on the server.
    let root = this;
    return root;
}
/**
 * Key handling for integrity clients and controllers.
 *
 */
export class Integrity {
    constructor(keystorage, privateKeyName = "master") {
        this.keystorage = keystorage;
        this.privateKeyName = privateKeyName;
    }
    static CreateIntegrity(changeCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            let storage = yield jose.JWK.createKeyStore();
            return Integrity.LoadIntegrity(storage, changeCallback);
        });
    }
    static LoadIntegrity(storage, changeCallback) {
        return __awaiter(this, void 0, void 0, function* () {
            let ks = yield jose.JWK.asKeyStore(storage);
            let i = new Integrity(ks);
            i.verifier = yield jose.JWS.createVerify(ks);
            i.changeCallback = changeCallback;
            return i;
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
            if (kid == this.privateKeyName || kid == "") {
                if (!this.privateKey) {
                    this.privateKey = yield this.keystorage.get(this.privateKeyName, {}, true);
                }
                return this.privateKey;
            }
            return yield this.keystorage.get(kid, {}, true);
        });
    }
    createPrivate(kid, use = "master") {
        return __awaiter(this, void 0, void 0, function* () {
            let k = yield this.keystorage.generate('EC', 'P-256', { kid: kid, use: use });
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
            if (typeof json == 'string')
                json = JSON.parse(json);
            json.kid = name;
            let key = yield this.keystorage.add(json);
            if (key)
                yield this.notify(key, Integrity.OP_SET);
            return key;
        });
    }
    getKey(name) {
        return this.keystorage.get(name);
    }
    addKey(jwk) {
        return this.keystorage.add(jwk);
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
    sign(keyName, input, compact = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let pkey = yield this.getPrivate(keyName);
            let buf = typeof (input) == 'string' ? input : JSON.stringify(input);
            let fmt = compact ? { format: "compact" } : {};
            let jws = jose.JWS.createSign(fmt, { key: pkey, reference: 'jwk' });
            // console.debug("sign: ", jws, pkey)
            return yield jws.final(buf, 'utf8');
        });
    }
    signCompact(keyName, input) {
        return this.sign(keyName, input, true);
    }
    encrypt(recipient, input) {
        let buf = (typeof (input) == 'string') ? input : JSON.stringify(input);
        return jose.JWE.createEncrypt({ protect: ['enc'], contentAlg: 'A256GCM' }, recipient)
            .final(buf);
    }
    // validate and return verify result
    verify(jws, allowEmbeddedKey = false) {
        if (typeof jws === 'string') {
            if (jws[0] != '{') { // compact form to jws conversion
                let parts = jws.split(".");
                jws = {
                    protected: parts[0],
                    payload: parts[1],
                    signature: parts[2]
                };
            }
            else {
                jws = JSON.parse(jws);
            }
        }
        return this.verifier.verify(jws, { allowEmbeddedKey: allowEmbeddedKey });
    }
    // validate and return payload as string
    verified(jws, allowEmbeddedKey = false) {
        return this.verify(jws, allowEmbeddedKey)
            .then(verified => verified.payload.toString("utf8"));
    }
    // validate and return payload as string
    verifiedJSON(jws) {
        return __awaiter(this, void 0, void 0, function* () {
            let json = yield this.verified(jws);
            return JSON.parse(json);
        });
    }
    createType(type) {
        switch (type) {
            case Action.TYPE:
            case Action.TYPEv1:
                return new Action();
            case ActionDescriptor.TYPEv1:
            case ActionDescriptor.TYPE:
                return new ActionDescriptor();
            case RealmDescriptor.TYPEv1:
            case RealmDescriptor.TYPE:
                return new RealmDescriptor();
            case Certificate.TYPE:
                return new Certificate();
            case ControllerDescriptor.TYPE:
            case ControllerDescriptor.TYPEv1:
                return new ControllerDescriptor();
            case ControllerBinding.TYPE:
                return new ControllerBinding();
            case Multipart.TYPE:
            case Multipart.TYPEv1:
                return new Multipart();
            case ScopeRequest.TYPE:
            case ScopeRequest.TYPEv1:
                return new ScopeRequest();
            case SignatureRequest.TYPE:
            case SignatureRequest.TYPEv1:
                return new SignatureRequest();
            case Mandate.TYPE:
            case Mandate.TYPEv1:
                return new Mandate();
            case MandateToken.TYPE:
            case MandateToken.TYPEv1:
                return new MandateToken();
            case Fact.TYPE:
            case Fact.TYPEv1:
                return new Fact();
            case Message.TYPE:
            case Message.TYPEv1:
                return new Message();
            case UrlResponse.TYPE:
            case UrlResponse.TYPEv1:
                return new UrlResponse();
        }
        throw new Error("unknown type: " + type);
    }
    // parse brickchain protocol objects
    parseJSONSchema(json) {
        let type = json["@type"];
        let i = type.indexOf("#");
        if (i > 0)
            type = type.substring(0, i);
        let obj = this.createType(type);
        obj.parse(json);
        return obj;
    }
    parseMultipart(json, allowEmbeddedKey = false) {
        return __awaiter(this, void 0, void 0, function* () {
            let mp = this.parseJSONSchema(json);
            if (mp.getType() != Multipart.TYPE &&
                mp.getType() != Multipart.TYPEv1) {
                throw new Error("unexpected response, expecting multipart: " + mp.toJSON());
            }
            return yield mp.parseParts(this, allowEmbeddedKey);
        });
    }
    factHash(fact) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataString = JSON.stringify(fact.data);
            let hash = yield this.digest("SHA-256", dataString);
            return hash;
        });
    }
    digest(hash, pdata, fmt = "hex") {
        return __awaiter(this, void 0, void 0, function* () {
            let window = getRoot();
            if (window.crypto && window.crypto.subtle) { // browser
                let alg = { name: hash }; // "SHA-256"
                let hbuf = yield window.crypto.subtle.digest(alg, pdata);
                if (fmt == "hex") {
                    const hArray = Array.from(new Uint8Array(hbuf));
                    return hArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
                }
                else if (fmt == 'base64') {
                    return window.btoa(hbuf);
                }
                return hbuf.toString(fmt);
            }
            else { // node
                let crypto = require("crypto"); // "sha256"
                let md = hash.replace("SHA-", "SHA").toLowerCase();
                let digest = crypto.createHash(md);
                digest.update(pdata);
                return Promise.resolve(digest.digest(fmt));
            }
        });
    }
    /**
     * create mandate token as a compact jws
     * mandates can be mandates with signatures or just the compact-jws signatures.
     */
    mandateToken(mandates, ttl = 60000, keyId = "") {
        if (!mandates || mandates.length == 0)
            return undefined;
        let token = new MandateToken();
        token.mandates = mandates.map(m => typeof (m) == 'string' ? m : m.signature);
        token.ttl = ttl;
        return this.signCompact(keyId, token);
    }
    /**
     * read all certificats, if signed with key we have, add signed key to keystore.
     * @param list - list of model.base docs.
     */
    addCertificates(list) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i in list) {
                let a = list[i];
                let jws = a["@certificate"];
                if (jws) {
                    let json = yield this.verified(jws);
                    let cert = JSON.parse(json);
                    if (!(yield this.getKey(cert.subject.kid))) {
                        yield this.addKey(cert.subject);
                    }
                }
            }
        });
    }
    // parse realm description in JWS, verify signature and store keys.
    parseSignedRealm(name, jws, importKey = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof (jws) == 'string')
                jws = JSON.parse(jws);
            // get key out and verify that we have it. assumes full JWS.
            let pText = Buffer.from(jws.protected, "base64").toString('utf8');
            let pJSON = JSON.parse(pText);
            let pKey = yield this.getKey(pJSON.kid);
            if (!pKey) {
                if (!importKey)
                    throw new Error("unknown key in signature: " + pJSON.kid);
                pKey = yield this.parseAndAddKey(pJSON.kid, pJSON.jwk);
                // console.log("added new key: "+pKey)
            }
            let result = yield this.verifier.verify(jws);
            let obj = JSON.parse(result.payload);
            if (name != '*' && obj.name != name)
                throw new Error("Name does not match");
            let realm = Object.assign(new RealmDescriptor(), obj);
            realm.timestamp = new Date(obj["@timestamp"]);
            // realm.signed = JSON.stringify(jws);
            realm.icon = obj.icon ? obj.icon : '';
            realm.banner = obj.banner ? obj.banner : '';
            let pubKey = yield jose.JWK.asKey(obj.publicKey, 'json');
            realm.publicKey = pubKey;
            return realm;
        });
    }
    // encode strings, objects, arrays into reproduceable string
    // note: this is v0 formating expect multihash/multibase
    // see: https://github.com/multiformats/multibase
    jsonHash(data) {
        // let hash = (obj) => {
        //   return crypto.createHash('SHA256').update(obj).digest('hex')
        // }
        let serialize = function (d) {
            let o = [];
            Object.keys(d).sort().forEach(k => {
                let v = d[k];
                switch (typeof v) {
                    case 'string':
                        o.push(k + ':' + v);
                        break;
                    case 'object':
                        if (Array.isArray(v)) {
                            let s = [];
                            v.forEach(v => {
                                if (typeof v == 'object')
                                    s.push(serialize(v));
                                else
                                    s.push(v);
                            });
                            o.push(k + ':[' + s.join('|') + ']');
                        }
                        else {
                            o.push(k + ':' + serialize(v));
                        }
                        break;
                    default:
                        throw "values of type " + typeof v + "not supported";
                }
            });
            return '{' + o.join("|") + '}';
        };
        return this.digest("SHA-256", serialize(data), "hex");
    }
}
Integrity.OP_SET = "set";
Integrity.OP_DEL = "add";
//# sourceMappingURL=integrity.js.map