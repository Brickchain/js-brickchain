"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_jose_1 = require("node-jose");
var crypto = require("crypto");
/**
 * Name and public key, optionally private key.
 *
 */
var Key = /** @class */ (function () {
    function Key(name, privateKey) {
        this['@type'] = 'key';
        this.name = name;
        if (privateKey) {
            this.privateKey = privateKey;
        }
    }
    Key.makeKey = function (name, privateKey) {
        return Promise.resolve(new Key(name, privateKey))
            .then(function (key) { return node_jose_1.default.JWK.asKey(privateKey.toJSON(), 'json')
            .then(function (publicKey) {
            key.publicKey = publicKey;
            return key;
        }); });
    };
    Key.prototype.isEncrypted = function () {
        return this.encryptedKey ? true : false;
    };
    Key.prototype.hasPrivateKey = function () {
        return this.privateKey || this.encryptedKey;
    };
    Key.prototype.setID = function (id) {
        var _this = this;
        this.id = id;
        var pl = [];
        if (this.privateKey != undefined && this.privateKey != null) {
            var key = this.privateKey.toJSON(true);
            key.kid = id;
            pl.push(node_jose_1.default.JWK.asKey(key, 'json').then(function (key) { return _this.privateKey = key; }));
        }
        if (this.publicKey != undefined && this.publicKey != null) {
            var key = this.publicKey.toJSON();
            key.kid = id;
            pl.push(node_jose_1.default.JWK.asKey(key, 'json').then(function (key) { return _this.publicKey = key; }));
        }
        return Promise.all(pl).then(function () { return _this; });
    };
    // Decrypt Key
    Key.prototype.decryptKey = function (pin) {
        var hash = crypto.createHash('sha256').update(pin, 'utf8').digest();
        var decipher = crypto.createDecipher("aes256", hash);
        var decrypted = decipher.update(this.encryptedKey, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return Promise.resolve(decrypted);
    };
    // Encrypts key with pin, used for storage (aes256-base64-string)
    Key.prototype.encryptKey = function (pin) {
        var hash = crypto.createHash('sha256').update(pin, 'utf8').digest();
        var encrypt = crypto.createCipher('aes256', hash);
        var encrypted = encrypt.update(this.privateKey.toJSON(true), "utf8", "base64");
        encrypted += encrypt.final('base64');
        this.encryptedKey = encrypted;
        return Promise.resolve(encrypted);
    };
    Key.prototype.getPrivateKey = function (pin) {
        var _this = this;
        if (this.isEncrypted() && this.privateKey == null) {
            return this.decryptKey(pin)
                .then(function (decrypted) { return node_jose_1.default.JWK.asKey(JSON.parse(decrypted), 'json'); })
                .then(function (privateKey) {
                _this.privateKey = privateKey;
                if (!_this.privateKey.kid) {
                    _this.privateKey.kid = _this.id;
                }
                return _this.privateKey;
            });
        }
        else {
            if (!this.privateKey)
                return Promise.resolve(undefined);
            if (!this.privateKey.kid)
                this.privateKey.kid = this.id;
            return Promise.resolve(this.privateKey);
        }
    };
    Key.prototype.sign = function (input, pin, compact) {
        var _this = this;
        if (compact === void 0) { compact = false; }
        var buf = (typeof (input) == 'string') ? input : JSON.stringify(input);
        return this.getPrivateKey(pin)
            .then(function (privateKey) {
            var opt = {
                key: _this,
                reference: 'jwk',
                fields: { kid: privateKey.kid }
            };
            return node_jose_1.default.JWS.createSign(compact ? { format: 'compact' } : {}, opt)
                .update(buf, 'utf8').final();
        });
    };
    Key.prototype.thumbprint = function (hash) {
        if (hash === void 0) { hash = 'SHA-256'; }
        return this.publicKey.thumbprint(hash)
            .then(function (bytes) {
            return Buffer.from(bytes).toString('hex').replace(/(.{4})/g, '$1 ').trim();
        });
    };
    Key.prototype.thumbprint64 = function (hash) {
        if (hash === void 0) { hash = 'SHA-256'; }
        return this.publicKey.thumbprint(hash)
            .then(function (bytes) { return node_jose_1.default.util.base64url.encode(bytes); });
    };
    Key.prototype.toJSON = function () {
        var k = Object.assign({}, this);
        if (this.isEncrypted())
            delete k.privateKey;
        else {
            if (this.privateKey)
                k.privateKey = this.privateKey.toJSON(true);
        }
        return JSON.stringify(k);
    };
    Key.prototype.toObject = function () {
        var k = Object.assign({}, this);
        k.publicKey = this.publicKey.toObject();
        return k;
    };
    Key.fromJSON = function (data) {
        var obj = JSON.parse(data);
        var key = new Key(obj.name);
        Object.assign(key, obj);
        var privKey = (typeof (obj.privateKey) === 'object') ? JSON.stringify(obj.privateKey) : obj.privateKey;
        var publKey = (typeof (obj.publicKey) === 'object') ? JSON.stringify(obj.publicKey) : obj.publicKey;
        return Promise.all([
            publKey ? node_jose_1.default.JWK.asKey(publKey, 'json') : Promise.resolve(null),
            privKey ? node_jose_1.default.JWK.asKey(privKey, 'json') : Promise.resolve(null)
        ])
            .then(function (keys) {
            key.publicKey = keys[0];
            key.privateKey = keys[1];
            return key;
        });
    };
    return Key;
}());
exports.Key = Key;
//# sourceMappingURL=key.js.map