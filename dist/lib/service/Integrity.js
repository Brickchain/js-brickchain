"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("./Logger");
var model_1 = require("../model");
var logger = Logger_1.Logger.create("Integrity");
var jose = require("node-jose");
/**
 * Integrity keys and relation to other IDs.
 * Key handling for integrity clients and controllers.
 *
 */
var Integrity = /** @class */ (function () {
    function Integrity(storage, pin) {
        var _this = this;
        // TODO: how are these related? 
        this._keys = {}; // mapping (name->Key)
        this._pubkeys = {}; // app our keys (id->Key)
        this.myOwnKeyID = ""; // our private key id
        this.storage = storage;
        this.pin = pin;
        this.verifier = jose.JWS.createVerify();
        this._keys = {};
        this.storage.get("keyID")
            .then(function (keyID) {
            if (keyID) {
                if (typeof (keyID) != 'string')
                    throw new Error("bad type on keyID " + typeof (keyID));
                logger.debug("constructor", "init found keyID: ", keyID);
                _this.myOwnKeyID = keyID;
                return Promise.resolve(keyID);
            }
            else
                throw new Error("keyID not found. ");
        })
            .catch(function (err) {
            logger.error("error retreving private key:", err);
            logger.info("constructor", "missing key, creating...");
            return _this.generateKey("root")
                .then(function (key) { return _this.storeKey(key).then(function (k) { return key; }); })
                .then(function (key) { return _this.useAsRoot(key); })
                .then(function () {
                logger.debug("constructor", "new key stored.", _this.myOwnKeyID);
                return Promise.resolve(_this.myOwnKeyID);
            })
                .catch(function (err) {
                logger.error(err);
            });
        });
    }
    Integrity.prototype.getID = function () {
        var _this = this;
        if (this.myOwnKeyID) {
            return Promise.resolve(this.myOwnKeyID);
        }
        return this.storage.get("keyID")
            .then(function (keyID) {
            _this.myOwnKeyID = keyID;
            return keyID;
        });
    };
    // store key as root-key for this party
    Integrity.prototype.useAsRoot = function (key) {
        if (!key.id) {
            key.id = key.name;
        }
        this.myOwnKeyID = key.id;
        return this.storage.set('keyID', key.id);
    };
    // create EC/P-256: key and cache it (its not stored)
    Integrity.prototype.generateKey = function (name, id) {
        var _this = this;
        var keystore = jose.JWK.createKeyStore();
        return keystore.generate('EC', 'P-256')
            .catch(function (error) { return logger.error("generateKey-creation ", error); })
            .then(function (privateKey) {
            var key = new model_1.Key(name, privateKey);
            if (id)
                return key.setID(id);
            else
                return Promise.resolve(key);
        })
            .then(function (key) {
            _this._keys[name] = key;
            return key;
        })
            .catch(function (error) { return logger.error("generateKey-binding ", error); });
    };
    // Adds a singed key as "signedPublicKey" to key.
    Integrity.prototype.signPublicKey = function (key) {
        var pubkey = key.publicKey.toJSON();
        delete pubkey.kid;
        return key.getPrivateKey(this.pin)
            .then(function (privateKey) {
            return jose.JWS.createSign({ format: 'flattened' }, { key: privateKey, reference: 'jwk' })
                .update(JSON.stringify(pubkey), 'utf8').final();
        })
            .then(function (jws) { return JSON.stringify(jws); })
            .then(function (json) { return key.signedPublicKey = json; })
            .then(function () { return key; });
    };
    // private part of key is encrypted, use this to read it.
    Integrity.prototype.getPrivateKey = function (key) {
        var _this = this;
        return key.getPrivateKey(this.pin)
            .then(function (privateKey) {
            _this._keys[key.name].privateKey = privateKey;
            return Promise.resolve(privateKey);
        });
    };
    // stores key, using the keys own name, removes decryptped
    // private key if its available next to an encryption.
    // keys are stored with "key_"-prefix.
    Integrity.prototype.storeKey = function (key) {
        logger.debug("storeKey", " with key.name: " + key.name);
        var k = Object.assign({}, key);
        if (key.isEncrypted() && key.encryptedKey)
            delete k.privateKey;
        else
            k.privateKey = key.privateKey.toJSON(true);
        return this.storage.set("key_" + key.name, JSON.stringify(k));
    };
    // add a Key JSON packed key with name to memory storage
    Integrity.prototype.parseAndAddKey = function (name, json) {
        var _this = this;
        return model_1.Key.fromJSON(json)
            .then(function (key) {
            _this._keys[name] = key;
            return key;
        });
    };
    Integrity.prototype.getKey = function (name) {
        var _this = this;
        if (this._keys[name]) {
            return Promise.resolve().then(function () { return _this._keys[name]; });
        }
        else {
            return this.storage.get("key_" + name)
                .then(function (data) {
                if (data != null) {
                    return _this.parseAndAddKey(name, data);
                }
                else {
                    return Promise.reject("No key found for " + name);
                }
            });
        }
    };
    Integrity.prototype.createCertificateChain = function (subKey, keyType, documentTypes, ttl) {
        var _this = this;
        if (keyType === void 0) { keyType = '*'; }
        if (documentTypes === void 0) { documentTypes = ['*']; }
        if (ttl === void 0) { ttl = 3600; }
        return this.getKey('root')
            .then(function (rootKey) { return ({
            timestamp: new Date(),
            root: rootKey.publicKey,
            subKey: subKey.publicKey,
            keyType: keyType,
            documentTypes: documentTypes,
            ttl: ttl,
        }); })
            .then(function (chain) { return _this.signCompact('root', chain); })
            .then(function (chain) { return subKey.certificateChain = chain; })
            .then(function () { return subKey; });
    };
    /*
    public key(name: string): any {
        return this._pubkeys[name] != null ? this._pubkeys[name].toJSON() : null;
    } */
    Integrity.prototype.signedKey = function (name) {
        return this.storage.get("signed_pubkey_" + name);
    };
    Integrity.prototype.sign = function (keyName, input) {
        var _this = this;
        return this.getKey(keyName)
            .then(function (key) { return key.sign(input, _this.pin); });
    };
    Integrity.prototype.signCompact = function (keyName, input) {
        var _this = this;
        return this.getKey(keyName)
            .then(function (key) { return key.sign(input, _this.pin, true); });
    };
    Integrity.prototype.encrypt = function (recipient, input) {
        var buf = (typeof (input) == 'string') ? input : JSON.stringify(input);
        return jose.JWE.createEncrypt({ protect: ['enc'], contentAlg: 'A256GCM' }, recipient)
            .update(buf).final();
    };
    // validate and return verify result
    Integrity.prototype.verify = function (data) {
        return this.verifier.verify(data);
    };
    // validate and return payload as string
    Integrity.prototype.verified = function (data) {
        return this.verify(data)
            .then(function (verified) { return verified.payload.toString("utf8"); });
    };
    Integrity.prototype.parseSignedRealm = function (name, signed) {
        var jws = typeof (signed) == 'string' ? JSON.parse(signed) : signed;
        return this.verifier.verify(jws)
            .then(function (result) {
            var obj = JSON.parse(result.payload);
            if (name != '*' && obj.name != name)
                return Promise.reject("Name does not match");
            return obj;
        })
            .then(function (obj) {
            var realm = Object.assign(new model_1.Realm(), obj);
            realm.timestamp = new Date(obj["@timestamp"]);
            realm.signed = JSON.stringify(jws);
            realm.icon = obj.icon ? obj.icon : '';
            realm.banner = obj.banner ? obj.banner : '';
            return jose.JWK.asKey(obj.publicKey, 'json')
                .then(function (key) { return realm.publicKey = key; })
                .then(function () { return realm; });
        });
    };
    Integrity.prototype.verifyRealmHistory = function (realm) {
        var _this = this;
        var prevKey = realm.publicKey;
        var pl = realm.keyHistory.reverse()
            .map(function (eventJWS) { return _this.verifier.verify(eventJWS); });
        return Promise.all(pl)
            .then(function (events) {
            events.forEach(function (event, i) {
                if (event.key.thumbprint() != prevKey.thumbprint())
                    return Promise.reject("thumbprint miss match in chain");
            });
            return Promise.resolve("");
        });
    };
    Integrity.prototype.compareRealmHistory = function (realmA, realmB) {
        var _this = this;
        return this.verifyRealmHistory(realmA)
            .then(function (myThumbprint) { return _this.verifyRealmHistory(realmB)
            .then(function (otherThumbprint) { return myThumbprint == otherThumbprint ? Promise.resolve() : Promise.reject("key history didn't match"); }); });
    };
    Integrity.prototype.test = function () {
        var _this = this;
        var p1 = this.generateKey("test")
            .then(function (key) {
            logger.debug("new keys: ", key);
            return _this.storeKey(key);
        })
            .then(function (a) {
            delete _this._keys["test"];
            var k = _this.getKey("test");
            logger.debug("loaded: ", k);
        })
            .catch(function (err) {
            logger.info("error: ", err);
        });
        return Promise.all([p1])
            .then(function (l) { return true; });
    };
    return Integrity;
}());
exports.Integrity = Integrity;
//# sourceMappingURL=Integrity.js.map