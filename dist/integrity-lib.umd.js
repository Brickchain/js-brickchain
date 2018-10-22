(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('node-jose')) :
    typeof define === 'function' && define.amd ? define(['exports', 'node-jose'], factory) :
    (factory((global.library = {}),global.jose));
}(this, (function (exports,jose) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    class Base {
        constructor(type, time) {
            this.setType(type);
            this.setTimestamp(time ? time : new Date());
        }
        setType(type) {
            this["@type"] = type;
        }
        getType() {
            return this["@type"];
        }
        setTimestamp(time) {
            this["@timestamp"] = time.toISOString();
        }
        getTimestamp() {
            return new Date(this["@timestamp"]);
        }
        setID(id) {
            this["@id"] = id;
        }
        getID() {
            return this["@id"];
        }
        getCertificate() {
            return this["@certificate"];
        }
        setCertificate(jwsCert) {
            this["@certificate"] = jwsCert;
        }
        getRealm() {
            return this["@realm"];
        }
        setRealm(realm) {
            this["@realm"] = realm;
        }
        toJSON() {
            let json = Object.assign({}, this);
            // clean out getters
            if ("context" in json)
                delete json["context"];
            if ("subtype" in json)
                delete json["subtype"];
            return json;
        }
        parse(json) {
            Object.assign(this, json);
            return this;
        }
        /**
         * 1 for V1 and 2 for V2 schema source.
         */
        schemaVersion() {
            if (this.getType().indexOf(":") == -1)
                return 1;
            return 2;
        }
        /**
         * V1 and V2 stores differently
         */
        get subtype() {
            if (this.getType().indexOf("#") > 0) {
                return this.getType().substring(this.getType().indexOf("#") + 1);
            }
            return this["@subtype"];
        }
        /**
         * V1 - only
         */
        get context() {
            return this["@context"];
        }
    }

    class RealmDescriptor extends Base {
        constructor(time) {
            super(RealmDescriptor.TYPE, time);
        }
        getLabel() {
            return this.label;
        }
    }
    RealmDescriptor.TYPE = "https://schema.brickchain.com/v2/realm-descriptor.json";
    RealmDescriptor.TYPEv1 = "realm-descriptor";

    class Mandate extends Base {
        constructor(time) {
            super(Mandate.TYPE, time);
        }
        get validFromDate() { return new Date(this.validFrom); }
        get validUntilDate() { return new Date(this.validUntil); }
        setRole(role) {
            this.role = role;
        }
        setRoleName(roleName) {
            this.roleName = roleName;
        }
        setValidFrom(time) {
            this.validFrom = time.toISOString();
        }
        setValidUntil(time) {
            this.validUntil = time.toISOString();
        }
        setSender(userID) {
            this.sender = userID;
        }
        setParam(key, value) {
            if (this.params == undefined)
                this.params = {};
            this.params[key] = value;
        }
        setRecipient(key) {
            this.recipient = key;
        }
        getRole() {
            return this.role;
        }
        getRoleName() {
            return this.roleName;
        }
        getValidFrom() {
            return this.validFromDate;
        }
        getValidUntil() {
            return this.validUntilDate;
        }
        getSender() {
            return this.sender;
        }
        getParam(key) {
            return this.params[key];
        }
        getParamKeys() {
            return this.params.keys();
        }
        getRecipient() {
            return this.recipient;
        }
    }
    Mandate.TYPE = "https://schema.brickchain.com/v2/mandate.json";
    Mandate.TYPEv1 = "mandate";

    /**
     * The Mandate Token is an encapsulated object containing Mandates. Used for inclusion in HTTP headers, when interacting with web views.
     */
    class MandateToken extends Base {
        constructor(time) {
            super(MandateToken.TYPE, time);
        }
    }
    MandateToken.TYPE = "https://schema.brickchain.com/v2/mandate.json";
    MandateToken.TYPEv1 = "mandate";

    class ActionDescriptor extends Base {
        constructor(time) {
            super(ActionDescriptor.TYPE, time);
        }
    }
    ActionDescriptor.TYPE = "https://schema.brickchain.com/v2/action-descriptor.json";
    ActionDescriptor.TYPEv1 = "action-descriptor";

    class Certificate extends Base {
        constructor(time) {
            super(Certificate.TYPE, time);
        }
    }
    Certificate.TYPE = "https://schema.brickchain.com/v2/certificate.json";
    Certificate.TYPEv1 = "certificate-chain";

    /**
     * NOTE: Contains to terms and conditions for login etc.
     * Use NOTE: https://tools.ietf.org/html/rfc2985
     * see: NaturalPersonAttributeSet ATTRIBUTE
     *
     *
     * https://tools.ietf.org/html/rfc5958
     *
     */
    class Contract extends Base {
        constructor(time) {
            super(Contract.TYPE, time);
        }
    }
    Contract.TYPE = "https://schema.brickchain.com/v2/contract.json";
    Contract.TYPEv1 = "contract";

    class ControllerDescriptor extends Base {
        constructor(time) {
            super(ControllerDescriptor.TYPE, time);
        }
    }
    ControllerDescriptor.TYPE = "https://schema.brickchain.com/v2/controller-descriptor.json";
    ControllerDescriptor.TYPEv1 = "controller-descriptor";
    class ControllerBinding extends Base {
        constructor(time) {
            super(ControllerBinding.TYPE, time);
        }
    }
    ControllerBinding.TYPE = "https://schema.brickchain.com/v2/controller-binding.json";

    /**
     *  A Fact is a personal attribute certified by signatories.
     *  "data" can be anything that we can run JSON.stringify on.
     *
     */
    class Fact extends Base {
        constructor(time) {
            super(Fact.TYPE, time);
        }
    }
    Fact.TYPE = "https://schema.brickchain.com/v2/fact.json";
    Fact.TYPEv1 = "fact";
    class FactSignature {
        constructor() {
        }
    }

    class KeyPurpose {
        constructor() {
        }
    }

    class Revocation extends Base {
        constructor(time) {
            super(Revocation.TYPE, time);
        }
    }
    Revocation.TYPE = "https://schema.brickchain.com/v2/revocation.json";
    class RevocationChecksum extends Base {
        constructor(time) {
            super(Revocation.TYPE, time);
        }
    }
    RevocationChecksum.TYPE = "https://schema.brickchain.com/v2/revocation-checksum.json";
    class RevocationRequest extends Base {
        constructor(time) {
            super(Revocation.TYPE, time);
        }
    }
    RevocationRequest.TYPE = "https://schema.brickchain.com/v2/revocation-request.json";
    RevocationRequest.TYPEv1 = "revocation";

    class Action extends Base {
        constructor(time) {
            super(Action.TYPE, time);
        }
    }
    Action.TYPE = "https://schema.brickchain.com/v2/action.json";
    Action.TYPEv1 = "action";

    class ScopeRequest extends Base {
        constructor(time) {
            super(ScopeRequest.TYPE, time);
        }
    }
    ScopeRequest.TYPE = "https://schema.brickchain.com/v2/scope-request.json";
    ScopeRequest.TYPEv1 = "scope-request";
    /**
     * scope is used in scope-request and login-request.
     */
    class Scope {
        constructor(name) {
            this.name = name;
        }
    }

    class SignatureRequest extends Base {
        constructor(time) {
            super(SignatureRequest.TYPE, time);
        }
    }
    SignatureRequest.TYPE = "https://schema.brickchain.com/v2/signature-request.json";
    SignatureRequest.TYPEv1 = "signature-request";

    class UrlResponse extends Base {
        constructor(time) {
            super(UrlResponse.TYPE, time);
        }
    }
    UrlResponse.TYPE = "https://schema.brickchain.com/v2/url-response.json";
    UrlResponse.TYPEv1 = "url-response";

    class Message extends Base {
        constructor(time) {
            super(Message.TYPE, time);
        }
    }
    Message.TYPE = "https://schema.brickchain.com/v2/message.json";
    Message.TYPEv1 = "message";

    class Multipart extends Base {
        constructor(time) {
            super(Multipart.TYPE, time);
        }
        parseParts(integrity, allowEmbeddedKey) {
            return __awaiter(this, void 0, void 0, function* () {
                let list = new Array();
                for (let i in this.parts) {
                    let part = this.parts[i];
                    let doc = yield this.parsePart(part, integrity, allowEmbeddedKey);
                    list.push(doc);
                }
                return list;
            });
        }
        parsePart(part, integrity, allowEmbeddedKey) {
            return __awaiter(this, void 0, void 0, function* () {
                let json = part.document;
                let jws;
                if (part.encoding.indexOf("+jws") > 0) {
                    jws = json;
                    json = yield integrity.verified(jws, allowEmbeddedKey);
                }
                let doc = integrity.parseJSONSchema(JSON.parse(json));
                if (jws)
                    doc.signature = jws;
                return doc;
            });
        }
    }
    Multipart.TYPE = "https://schema.brickchain.com/v2/multipart.json";
    Multipart.TYPEv1 = "multipart";

    function getRoot() {
        // Establish the root object, `window` in the browser, or `global` on the server.
        let root = this;
        return root;
    }
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
    class Integrity {
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
                console.debug("sign: ", jws, pkey);
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
        digest(hash, pdata) {
            return __awaiter(this, void 0, void 0, function* () {
                let window = getRoot();
                if (window.crypto && window.crypto.subtle) { // browser
                    let alg = { name: hash }; // "SHA-256"
                    return window.crypto.subtle.digest(alg, pdata);
                }
                else { // node
                    let crypto = require("crypto"); // "sha256"
                    let md = hash.replace("SHA-", "SHA").toLowerCase();
                    let digest = crypto.createHash(md);
                    digest.update(pdata);
                    return Promise.resolve(digest.digest());
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
    }
    Integrity.OP_SET = "set";
    Integrity.OP_DEL = "add";

    /**
     * Full library exporting these packages.
     */

    exports.Integrity = Integrity;
    exports.Base = Base;
    exports.Action = Action;
    exports.ActionDescriptor = ActionDescriptor;
    exports.Certificate = Certificate;
    exports.Contract = Contract;
    exports.ControllerDescriptor = ControllerDescriptor;
    exports.ControllerBinding = ControllerBinding;
    exports.Fact = Fact;
    exports.FactSignature = FactSignature;
    exports.KeyPurpose = KeyPurpose;
    exports.RealmDescriptor = RealmDescriptor;
    exports.Mandate = Mandate;
    exports.MandateToken = MandateToken;
    exports.Revocation = Revocation;
    exports.RevocationChecksum = RevocationChecksum;
    exports.RevocationRequest = RevocationRequest;
    exports.ScopeRequest = ScopeRequest;
    exports.Scope = Scope;
    exports.SignatureRequest = SignatureRequest;
    exports.UrlResponse = UrlResponse;
    exports.Message = Message;
    exports.Multipart = Multipart;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=integrity-lib.umd.js.map
