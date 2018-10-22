import * as jose from "node-jose";
import * as crypto from "crypto";
/**
 * Name and public key, optionally private key.
 *
 */
export class Key {
    constructor(name, privateKey) {
        this['@type'] = 'key';
        this.name = name;
        if (privateKey) {
            this.privateKey = privateKey;
        }
    }
    static makeKey(name, privateKey) {
        let key = new Key(name, privateKey);
        return key.thumbprint64()
            .then(thumb => {
            key.setID(thumb);
            return jose.JWK.asKey(privateKey.toJSON(), 'json');
        })
            .then(publicKey => {
            key.publicKey = publicKey;
            return key;
        });
    }
    getPublicKey() {
        if (this.publicKey)
            return Promise.resolve(this.publicKey);
        if (this.privateKey) {
            return jose.JWK.asKey(this.privateKey.toJSON(), 'json')
                .then(puKey => this.publicKey = puKey)
                .then(() => this.publicKey);
        }
        return Promise.reject("");
    }
    isEncrypted() {
        return this.encryptedKey ? true : false;
    }
    hasPrivateKey() {
        return this.privateKey || this.encryptedKey;
    }
    setID(id) {
        this.id = id;
        let pl = [];
        if (this.privateKey != undefined && this.privateKey != null) {
            let key = this.privateKey.toJSON(true);
            key.kid = id;
            pl.push(jose.JWK.asKey(key, 'json').then(key => this.privateKey = key));
        }
        if (this.publicKey != undefined && this.publicKey != null) {
            let key = this.publicKey.toJSON();
            key.kid = id;
            pl.push(jose.JWK.asKey(key, 'json').then(key => this.publicKey = key));
        }
        return Promise.all(pl).then(() => this);
    }
    // Decrypt Key
    decryptKey(pin) {
        let hash = crypto.createHash('sha256').update(pin, 'utf8').digest();
        let decipher = crypto.createDecipher("aes256", hash);
        let decrypted = decipher.update(this.encryptedKey, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return Promise.resolve(decrypted);
    }
    // Encrypts key with pin, used for storage (aes256-base64-string)
    encryptKey(pin) {
        let hash = crypto.createHash('sha256').update(pin, 'utf8').digest();
        let encrypt = crypto.createCipher('aes256', hash);
        let encrypted = encrypt.update(this.privateKey.toJSON(true), "utf8", "base64");
        encrypted += encrypt.final('base64');
        this.encryptedKey = encrypted;
        return Promise.resolve(encrypted);
    }
    getPrivateKey(pin) {
        if (this.isEncrypted() && this.privateKey == null) {
            return this.decryptKey(pin)
                .then(decrypted => jose.JWK.asKey(JSON.parse(decrypted), 'json'))
                .then((privateKey) => {
                this.privateKey = privateKey;
                if (!this.privateKey.kid) {
                    this.privateKey.kid = this.id;
                }
                return this.privateKey;
            });
        }
        else {
            if (!this.privateKey)
                return Promise.resolve(undefined);
            if (!this.privateKey.kid)
                this.privateKey.kid = this.id;
            return Promise.resolve(this.privateKey);
        }
    }
    sign(input, pin, compact = false) {
        let buf = (typeof (input) == 'string') ? input : JSON.stringify(input);
        return this.getPrivateKey(pin)
            .then(privateKey => {
            let opt = {
                key: this,
                reference: 'jwk',
                fields: { kid: privateKey.kid }
            };
            return jose.JWS.createSign(compact ? { format: 'compact' } : {}, opt)
                .update(buf, 'utf8').final();
        });
    }
    thumbprint(hash = 'SHA-256') {
        return this.publicKey.thumbprint(hash)
            .then(bytes => Buffer.from(bytes).toString('hex').replace(/(.{4})/g, '$1 ').trim());
    }
    thumbprint64(hash = 'SHA-256') {
        return this.publicKey.thumbprint(hash)
            .then(bytes => jose.util.base64url.encode(bytes));
    }
    toJSON() {
        let k = Object.assign({}, this);
        if (this.isEncrypted())
            delete k.privateKey;
        else {
            if (this.privateKey)
                k.privateKey = this.privateKey.toJSON(true);
        }
        return JSON.stringify(k);
    }
    toObject() {
        let k = Object.assign({}, this);
        k.publicKey = this.publicKey.toObject();
        return k;
    }
    static fromJSON(data) {
        let obj = JSON.parse(data);
        let key = new Key(obj.name);
        Object.assign(key, obj);
        let privKey = (typeof (obj.privateKey) === 'object') ? JSON.stringify(obj.privateKey) : obj.privateKey;
        let publKey = (typeof (obj.publicKey) === 'object') ? JSON.stringify(obj.publicKey) : obj.publicKey;
        let pubJson = publKey ? jose.JWK.asKey(publKey, 'json') : Promise.resolve(null);
        let priJson = privKey ? jose.JWK.asKey(privKey, 'json') : Promise.resolve(null);
        return Promise.all([pubJson, priJson])
            .then((keys) => {
            key.publicKey = keys[0];
            key.privateKey = keys[1];
            return key;
        });
    }
}
//# sourceMappingURL=key.js.map