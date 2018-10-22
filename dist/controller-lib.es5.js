import jose__default, { JWK, JWS, JWE, util } from 'node-jose';
import { createHash, createDecipher, createCipher } from 'crypto';

class Logger {
    constructor(name) {
        this.name = "";
        this.name = name;
    }
    static create(name) {
        return Logger.logger(name);
    }
    log(message, ...args) {
        console.log(this.name, ":", message, ...args);
    }
    error(message, ...args) {
        console.error(message + args ? args.join(",") : "");
    }
    debug(message, ...args) {
        console.debug(message + args ? args.join(",") : "");
    }
    info(message, ...args) {
        console.info(message + args ? args.join(",") : "");
    }
}
Logger.logger = (name) => {
    return new Logger(name);
};

class Base {
    constructor(obj) {
        if (obj != undefined && obj != null) {
            this.id = obj["@id"];
            this.context = obj["@context"];
            this.type = obj["@type"];
            this.subtype = obj["@subtype"];
            if (obj["@timestamp"] != undefined)
                this.timestamp = new Date(obj["@timestamp"]);
            this.certificateChain = obj["@certificateChain"];
            this.signed = obj.signed;
        }
        else {
            this.context = 'https://brickchain.com/schema';
            this.type = 'base';
            this.timestamp = new Date(Date.now());
        }
    }
    static parseSigned(c, signed, id) {
        let jws;
        if (typeof (signed) == 'string') {
            jws = JSON.parse(signed);
        }
        else {
            jws = signed;
        }
        return Base.verifier.verify(jws)
            .then(function (result) {
            let payload = result.payload.toString('utf-8');
            let document = new c(JSON.parse(payload));
            if (id != undefined && id != null) {
                document.id = id;
            }
            document.signed = JSON.stringify(jws);
            return document;
        });
    }
    toString() {
        return JSON.stringify(this, null, 2);
    }
    toJSON() {
        let obj = {};
        obj["@id"] = this.id;
        obj["@context"] = this.context;
        obj["@type"] = this.type;
        obj["@subtype"] = this.subtype;
        obj["@timestamp"] = this.timestamp;
        obj["@certificateChain"] = this.certificateChain;
        obj["signed"] = this.signed;
        return obj;
    }
}
Base.verifier = JWS.createVerify();

class Contract extends Base {
    constructor(obj) {
        super(obj);
        if (obj != undefined && obj != null) {
            this.text = obj.text;
        }
        this.type = 'contract';
    }
    toJSON() {
        let obj = super.toJSON();
        obj.text = this.text;
        return obj;
    }
}

class ActionDescriptor extends Base {
    constructor(obj) {
        super(obj);
        if (obj != undefined && obj != null) {
            this.label = obj.label;
            this.roles = obj.roles;
            this.icon = obj.icon;
            this.data = JSON.stringify(obj);
            this.contract = new Contract(obj.contract);
            this.keyLevel = obj.keyLevel;
            this.uiURI = obj.uiURI;
            this.actionURI = obj.actionURI;
            this.params = obj.params;
        }
        this.type = 'action-descriptor';
    }
    toJSON() {
        let obj = super.toJSON();
        obj.label = this.label;
        obj.roles = this.roles;
        obj.icon = this.icon;
        obj.data = this.data;
        obj.contract = this.contract;
        obj.keyLevel = this.keyLevel;
        obj.uiURI = this.uiURI;
        obj.actionURI = this.actionURI;
        obj.params = this.params;
        return obj;
    }
}

class Message extends Base {
    constructor(obj) {
        super(obj);
        this.type = 'message';
        this.title = obj.title;
        this.message = obj.message;
    }
    toJSON() {
        let obj = super.toJSON();
        obj.title = this.title;
        obj.message = this.message;
        return obj;
    }
}

class Part {
}
class Multipart extends Base {
    constructor(obj) {
        super(obj);
        this.parts = obj.parts;
        this.type = 'multipart';
    }
    toJSON() {
        let obj = super.toJSON();
        obj.parts = this.parts;
        return obj;
    }
}

class Fact extends Base {
    constructor(obj) {
        super(obj);
        this.isdefault = false;
        this.inactive = false;
        if (obj) {
            this.ttl = obj.ttl ? obj.ttl : 0;
            this.issuer = obj.iss;
            this.label = obj.label;
            this.data = obj.data;
            if (obj.recipient) {
                jose__default.JWK.asKey(obj.recipient, 'json').then(key => this.recipient = key);
            }
        }
    }
    toJSON() {
        let obj = super.toJSON();
        obj.ttl = this.ttl;
        obj.issuer = this.issuer;
        obj.label = this.label;
        obj.data = this.data;
        obj.recipient = this.recipient;
        obj.isdefault = this.isdefault;
        obj.inactive = this.inactive;
        return obj;
    }
    getIcon() {
        return Fact.getIconForType(this.subtype);
    }
    static isNativeFact(t) {
        return t == 'name' || t == 'phone' || t == 'email' || t == 'picture';
    }
    static getIconForType(type) {
        switch (type) {
            case 'name':
                return 'md-person';
            case 'phone':
                return 'md-call';
            case 'email':
                return 'md-mail';
            case 'picture':
                return 'md-camera';
            case 'dummy':
                return 'md-happy';
            case 'facebook':
                return 'logo-facebook';
            case 'google':
                return 'logo-google';
            default:
                return 'md-help-circle';
        }
    }
}

class Receipt extends Base {
    constructor(obj) {
        super(obj);
        if (obj) {
            this.label = obj.label;
            this.role = obj.role;
            this.action = obj.action;
            this.viewuri = obj.viewuri;
            this.jwt = obj.jwt;
            this.params = obj.params;
            if (obj.intervals) {
                this.intervals = obj.intervals.map(interval => {
                    return {
                        start: new Date(interval.start),
                        end: new Date(interval.end)
                    };
                });
            }
        }
        this.type = 'receipt';
    }
    toJSON() {
        let obj = super.toJSON();
        obj.label = this.label;
        obj.role = this.role;
        obj.viewuri = this.viewuri;
        obj.jwt = this.jwt;
        obj.intervals = this.intervals;
        obj.params = this.params;
        return obj;
    }
}

class ControllerDescriptor extends Base {
    constructor(obj, key) {
        super(obj);
        if (obj) {
            this.label = obj.label;
            this.realm = obj.realm;
            this.actionsURI = obj.actionsURI;
            this.adminUI = obj.adminUI;
            if (key)
                this.key = key;
            else
                this.key = obj.key;
            this.keyPurposes = obj.keyPurposes;
            this.requireSetup = obj.requireSetup;
            this.addBindingEndpoint = obj.addBindingEndpoint;
            this.icon = obj.icon;
        }
    }
    toJSON() {
        let obj = super.toJSON();
        obj.key = this.key;
        obj.label = this.label;
        obj.actionsURI = this.actionsURI;
        obj.adminUI = this.adminUI;
        obj.keyPurposes = this.keyPurposes;
        obj.requireSetup = this.requireSetup;
        obj.addBindingEndpoint = this.addBindingEndpoint;
        obj.icon = this.icon;
        obj.realm = this.realm;
        return obj;
    }
}

/**
 * Name and public key, optionally private key.
 *
 */
class Key {
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
            return JWK.asKey(privateKey.toJSON(), 'json');
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
            return JWK.asKey(this.privateKey.toJSON(), 'json')
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
            pl.push(JWK.asKey(key, 'json').then(key => this.privateKey = key));
        }
        if (this.publicKey != undefined && this.publicKey != null) {
            let key = this.publicKey.toJSON();
            key.kid = id;
            pl.push(JWK.asKey(key, 'json').then(key => this.publicKey = key));
        }
        return Promise.all(pl).then(() => this);
    }
    // Decrypt Key
    decryptKey(pin) {
        let hash = createHash('sha256').update(pin, 'utf8').digest();
        let decipher = createDecipher("aes256", hash);
        let decrypted = decipher.update(this.encryptedKey, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return Promise.resolve(decrypted);
    }
    // Encrypts key with pin, used for storage (aes256-base64-string)
    encryptKey(pin) {
        let hash = createHash('sha256').update(pin, 'utf8').digest();
        let encrypt = createCipher('aes256', hash);
        let encrypted = encrypt.update(this.privateKey.toJSON(true), "utf8", "base64");
        encrypted += encrypt.final('base64');
        this.encryptedKey = encrypted;
        return Promise.resolve(encrypted);
    }
    getPrivateKey(pin) {
        if (this.isEncrypted() && this.privateKey == null) {
            return this.decryptKey(pin)
                .then(decrypted => JWK.asKey(JSON.parse(decrypted), 'json'))
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
            return JWS.createSign(compact ? { format: 'compact' } : {}, opt)
                .update(buf, 'utf8').final();
        });
    }
    thumbprint(hash = 'SHA-256') {
        return this.publicKey.thumbprint(hash)
            .then(bytes => Buffer.from(bytes).toString('hex').replace(/(.{4})/g, '$1 ').trim());
    }
    thumbprint64(hash = 'SHA-256') {
        return this.publicKey.thumbprint(hash)
            .then(bytes => util.base64url.encode(bytes));
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
        let pubJson = publKey ? JWK.asKey(publKey, 'json') : Promise.resolve(null);
        let priJson = privKey ? JWK.asKey(privKey, 'json') : Promise.resolve(null);
        return Promise.all([pubJson, priJson])
            .then((keys) => {
            key.publicKey = keys[0];
            key.privateKey = keys[1];
            return key;
        });
    }
}

class Certificate {
    constructor(poj) {
        if (poj) {
            this.timestamp = poj.timestamp;
            this.ttl = poj.ttl;
            this.root = poj.root;
            this.subKey = poj.subKey;
            this.keyLevel = poj.keyLevel;
            this.keyType = poj.keyType;
            this.documentTypes = poj.documentTypes;
        }
    }
    hasExpired() {
        return Date.now() > this.timestamp.getTime() + this.ttl;
    }
    allowedType(docType) {
        return ('*' in this.documentTypes) || (docType in this.documentTypes);
    }
}

class Realm extends Base {
    constructor(obj) {
        super(obj);
        if (obj) {
            this.name = obj.name;
            this.timestamp = new Date(obj.timestamp);
            this.description = obj.description;
            this.publicKey = obj.publicKey; // TODO: parse via node-jose
            this.endpoint = obj.endpoint;
            this.versions = obj.versions;
            this.inviteURL = obj.inviteURL;
            this.servicesURL = obj.servicesURL;
            this.keyHistory = obj.keyHistory;
            this.actionsURL = obj.actionsURL;
            this.icon = obj.icon;
            this.banner = obj.banner;
        }
    }
    toJSON() {
        let obj = super.toJSON();
        Object.assign(obj, this);
        return obj;
    }
}

class ControllerBinding extends Base {
    constructor(obj) {
        super(obj);
        if (obj) {
            this.realmDescriptor = new Realm(obj.realmDescriptor);
            this.mandate = obj.mandate;
            this.controllerCertificateChain = obj.controllerCertificateChain;
            this.adminRoles = obj.adminRoles;
        }
    }
    toJSON() {
        let obj = super.toJSON();
        if (this.realmDescriptor)
            obj.realmDescriptor = this.realmDescriptor.toJSON();
        obj.mandate = this.mandate;
        obj.adminRoles = this.adminRoles;
        obj.controllerCertificateChain = this.controllerCertificateChain;
        return obj;
    }
}

class Mandate extends Base {
    constructor(obj) {
        super(obj);
        if (obj) {
            this.role = obj.role;
            this.label = obj.label;
            this.ttl = obj.ttl ? obj.ttl : 0;
            this.recipient = obj.recipient;
            this.recipientName = obj.recipientName;
            if (obj.recipientPublicKey) {
                jose__default.JWK.asKey(obj.recipientPublicKey, 'json').then(key => this.recipientPublicKey = key);
            }
            this.requestId = obj.requestId;
            this.sender = obj.sender;
            this.params = obj.params;
        }
        this.type = 'mandate';
    }
    toJSON() {
        let obj = super.toJSON();
        obj.role = this.role;
        obj.label = this.label;
        obj.ttl = this.ttl;
        obj.recipient = this.recipient;
        obj.recipientName = this.recipientName;
        obj.recipientPublicKey = this.recipientPublicKey;
        obj.requestId = this.requestId;
        obj.sender = this.sender;
        obj.params = this.params;
        return obj;
    }
    getRealm() {
        let parts = this.role ? this.role.split("@", 2) : [];
        return parts.length == 2 ? parts[1] : undefined;
    }
    getShortRole() {
        let parts = this.role ? this.role.split("@", 2) : [];
        return parts.length == 2 ? parts[0] : undefined;
    }
    getIcon() {
        return 'md-key';
    }
}

class MandateToken extends Base {
    constructor(obj) {
        super(obj);
        if (obj) {
            if (this.timestamp == null)
                this.timestamp = new Date(Date.now());
            this.mandate = obj.mandate;
            this.uri = obj.uri;
            this.ttl = obj.ttl;
        }
        this.type = 'mandate-token';
    }
    toJSON() {
        let obj = super.toJSON();
        obj.mandate = this.mandate;
        obj.uri = this.uri;
        obj.ttl = this.ttl;
        return obj;
    }
}

/**
 * A generic controller interface for binding with a single realm
 * and handling keys & certificates. After binding to a realm
 * the realm is locked with this controller. There is no -
 * multi realm handling in this controller.
 *
 * @author brickchain
 */
class Controller {
    constructor(integrity, fun, bindingSecret) {
        if (bindingSecret) {
            this.bindingSecret = bindingSecret;
        }
        else {
            this.bindingSecret = "" + Math.floor(Math.random() * 100000000);
        }
        this.logger = Logger.create("handler.Controller");
        this.integrity = integrity;
        this.bindFunc = fun;
        this.getBinding()
            .then(b => {
            if (b) {
                this.logger.info("binding: " + JSON.stringify(b));
                fun(b);
            }
            else {
                this.logger.info("Not bound yet, Secret: " + this.bindingSecret);
            }
        })
            .catch(err => {
            this.logger.debug(err);
            this.logger.info("Not bound. Waiting for binding. Secret: " +
                this.bindingSecret);
        });
    }
    setAdminURL(url) {
        this.adminUI = url;
    }
    /**
    * Add controller with binding endpoint to express Application,
    *  via some base (default = "/api")
    */
    addRoutes(app, base = "/api") {
        this.apiUri = base;
        app.options(base + "/descriptor", this.originOptions.bind(this));
        app.options(base + "/bind", this.originOptions.bind(this));
        app.options(base + "/actions", this.originOptions.bind(this));
        app.get(base + "/descriptor", this.descriptor.bind(this));
        app.post(base + "/bind", this.binder.bind(this));
        app.delete(base + "/bind", this.unbinder.bind(this));
        app.get(base + "/actions", this.actions.bind(this));
    }
    addCORS(res) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,Authorization,Accept,Origin');
    }
    getBinding() {
        if (this.binding)
            return Promise.resolve(this.binding);
        else
            return this.integrity.getControllerBinding()
                .then((binding) => {
                this.binding = binding;
                return binding;
            });
    }
    // returns forwarded or otherwise reqested "http[s]://host[:port]""
    myHost(req) {
        let fHost = req.get("x-forwarded-host");
        let fProto = req.get("x-forwarded-proto");
        if (fProto)
            fProto = fProto.split(',')[0];
        let baseurl = (fProto ? fProto : req.protocol) + '://' + (fHost ? fHost : req.get('host'));
        if (fHost)
            this.logger.info("forwarded-host: " + baseurl);
        return baseurl;
    }
    // GET /controller/descriptor
    descriptor(req, res) {
        this.addCORS(res);
        this.getDescriptor()
            .then(descriptor => {
            let baseurl = this.myHost(req);
            let baseuri = this.apiUri;
            // ensure realm-admin-ui/browser can read from this host.
            this.addCORS(res);
            descriptor.actionsURI = baseurl + baseuri + "/actions";
            descriptor.adminUI = baseurl + baseuri + this.adminUI;
            descriptor.bindURI = baseurl + baseuri + "/bind";
            this.logger.info("descriptor: ", JSON.stringify(descriptor, null, 2));
            res.json(descriptor);
        })
            .catch(err => {
            this.logger.error("error! ", err);
            if (err.stack)
                this.logger.error("error! ", err.stack);
            res.status(500).send("error: " + err);
        });
    }
    // build descriptor with key and refernces to actions.
    getDescriptor() {
        return this.integrity.getMyID()
            .then((keyId) => {
            this.logger.debug("got key: " + keyId);
            return this.integrity.getKey(keyId);
        })
            .then((mykey) => mykey.getPublicKey())
            .then((myPublicKey) => {
            return {
                "@type": "controller-descriptor",
                label: "",
                key: myPublicKey.toJSON(),
                keyPurposes: [
                    {
                        documentType: "purpose/bind",
                        required: true,
                        description: "attach controller to realm"
                    }
                ]
            };
        });
    }
    // POST /controller/
    binder(req, res) {
        this.addCORS(res);
        if (!req.body) {
            res.status(400).send("missing post data.");
            return;
        }
        if (!req.query.secret) {
            res.status(400).send("missing '?secret=...'");
            return;
        }
        if (req.query.secret != this.bindingSecret) {
            res.status(400).send("secret param does not match secret.");
            return;
        }
        this.getBinding()
            .then(bound => {
            if (bound) {
                res.status(400).send("controller already bound.");
                return;
            }
            this.logger.info("post bind <= " + JSON.stringify(req.body));
            this.logger.info("binder got: " + req.body);
            let signed = req.body;
            let verified = null;
            let realmKey = null;
            let binding = null;
            return this.integrity.verify(signed)
                .then((v) => {
                verified = v;
                this.logger.info("binder verified: " + v);
                return Promise.all([
                    JWK.asKey(verified.header.jwk),
                    verified.payload.toString("utf8")
                ]);
            })
                .then((l) => {
                realmKey = l[0];
                let data = l[1];
                let b = JSON.parse(data);
                this.logger.info("binder received: ", data);
                binding = new ControllerBinding(b);
                return this.setBinding(binding, realmKey);
            })
                .then((done) => {
                this.logger.info("responded: ", 201, "data: ", JSON.stringify(done));
                let realmName = binding.realmDescriptor.name;
                let realmUrl = "https://" + realmName + "/realm-api";
                this.listActions = this.bindFunc(realmUrl, realmName, binding);
                res.status(201).json({});
            });
        })
            .catch((err) => {
            this.logger.error("error! ", err);
            if (err.stack)
                this.logger.error("error! ", err.stack);
            res.status(500).send("error: " + err);
        });
    }
    // DELETE /controller/
    unbinder(req, res) {
        this.getBinding()
            .then(binding => {
            this.logger.info("requesting binding delete.");
            this.binding = null;
            return this.integrity.deleteControllerBinding();
        })
            .then(done => {
            this.logger.info("deleted: " + done);
            res.status(201).send("");
        })
            .catch(err => {
            this.logger.error("error! ", err);
            if (err.stack)
                this.logger.error("error! ", err.stack);
            res.status(500).send("error: " + err);
        });
    }
    // create binding with realm
    setBinding(binding, realmKey) {
        this.logger.info("binding: ", JSON.stringify(binding, null, 2));
        this.logger.info(" with realmKey: ", JSON.stringify(realmKey, null, 2));
        return Promise.all([
            this.integrity.verify(binding.controllerCertificateChain),
            this.integrity.verify(binding.mandate)
        ])
            .then((l) => {
            let cver = l[0];
            let mver = l[1];
            return Promise.all([
                cver.payload.toString("utf8"),
                mver.payload.toString("utf8"),
                JWK.asKey(cver.header.jwk),
                JWK.asKey(mver.header.jwk),
            ]);
        })
            .then((l) => {
            let cert = JSON.parse(l[0]);
            let mand = JSON.parse(l[1]);
            let ckey = l[2];
            let mkey = l[3];
            this.logger.debug("cert: ", cert);
            this.logger.debug("mandate: ", mand);
            // TODO: store keys to crypt
            this.binding = binding;
            return this.integrity.setControllerBinding(binding);
        });
    }
    originOptions(req, res) {
        this.addCORS(res);
        res.sendStatus(201);
    }
    actions(req, res) {
        this.addCORS(res);
        let baseurl = this.myHost(req);
        let baseuri = this.apiUri;
        let realmName = this.binding.realmDescriptor.name;
        let actions = this.listActions ?
            this.listActions(baseurl, baseuri, realmName)
                .map(a => a.toJSON()) :
            Array();
        res.json(actions);
    }
}

var logger = Logger.create("Integrity");
/**
 * Service, realm keys and other IDs.
 * Key handling for integrity clients and controllers.
 */
class Integrity {
    constructor(storage, secret) {
        this.keys = {}; // mapping (name->Key)
        this.myOwnKeyID = ""; // our private key name
        this.storage = storage;
        this.secret = secret;
        this.verifier = JWS.createVerify();
        this.storage.get("keyID")
            .then(keyID => {
            if (keyID) {
                if (typeof (keyID) != 'string')
                    throw new Error("bad type on keyID " + typeof (keyID));
                logger.debug("constructor", "init found keyID: ", keyID);
                this.myOwnKeyID = keyID;
                return Promise.resolve(keyID);
            }
            else
                throw new Error("keyID not found. ");
        })
            .catch(err => {
            logger.error("error retreving private key:", err);
            logger.info("constructor", "missing key, creating...");
            return this.generateKey("root")
                .then(key => this.storeKey(key).then(k => key))
                .then(key => this.setMyRoot(key))
                .then(() => {
                logger.debug("constructor", "new key stored.", this.myOwnKeyID);
                return Promise.resolve(this.myOwnKeyID);
            })
                .catch(err => {
                logger.error(err);
            });
        });
    }
    // returns name of key that is my own root key.
    getMyID() {
        if (this.myOwnKeyID) {
            return Promise.resolve(this.myOwnKeyID);
        }
        return this.storage.get("keyID")
            .then(keyID => {
            this.myOwnKeyID = keyID;
            return keyID;
        });
    }
    // store key as root-key for this party and
    // save name of myID to the key id
    //    (or name if key if we are missing key id)
    // it stores the key to the underlying storage.
    setMyRoot(key) {
        if (!key.id) {
            key.id = key.name;
        }
        this.myOwnKeyID = key.id;
        return this.storage.set('keyID', key.id);
    }
    // create EC/P-256: key and cache it (its not stored)
    // add key to storage with name, create with optional key-id
    generateKey(name, id) {
        let keystore = JWK.createKeyStore();
        return keystore.generate('EC', 'P-256')
            .catch((error) => logger.error("generateKey-creation ", error))
            .then((privateKey) => {
            let key = new Key(name, privateKey);
            if (id)
                return key.setID(id);
            else
                return Promise.resolve(key);
        })
            .then((key) => {
            this.keys[name] = key;
            return key;
        })
            .catch((error) => logger.error("generateKey-binding ", error));
    }
    // Adds a singed key as "signedPublicKey" to key.
    signPublicKey(key) {
        let pubkey = key.publicKey.toJSON();
        delete pubkey.kid;
        return key.getPrivateKey(this.secret)
            .then(privateKey => JWS.createSign({ format: 'flattened' }, { key: privateKey, reference: 'jwk' })
            .update(JSON.stringify(pubkey), 'utf8').final())
            .then((jws) => JSON.stringify(jws))
            .then((json) => key.signedPublicKey = json)
            .then(() => key);
    }
    // private part of key is encrypted, use this to read it.
    getPrivateKey(key) {
        return key.getPrivateKey(this.secret)
            .then(privateKey => {
            this.keys[key.name].privateKey = privateKey;
            return Promise.resolve(privateKey);
        });
    }
    // stores key, using the keys own name, removes decryptped
    // private key if its available next to an encryption.
    // keys are stored with "key_"-prefix.
    storeKey(key) {
        logger.debug("storeKey", " with key.name: " + key.name);
        let k = Object.assign({}, key);
        if (key.isEncrypted() && key.encryptedKey)
            delete k.privateKey;
        else
            k.privateKey = key.privateKey.toJSON(true);
        return this.storage.set(`key_${key.name}`, JSON.stringify(k));
    }
    clearCache() {
        this.keys = {};
    }
    deleteKey(name) {
        if (this.keys[name])
            delete this.keys[name];
        return this.storage.delete(name);
    }
    // add a Key JSON packed key with name to memory storage
    parseAndAddKey(name, json) {
        return Key.fromJSON(json)
            .then((key) => {
            this.keys[name] = key;
            return key;
        });
    }
    getMyKey() {
        return this.getMyID().then(myId => this.getKey(myId));
    }
    getKey(name) {
        if (this.keys[name]) {
            return Promise.resolve().then(() => this.keys[name]);
        }
        else {
            return this.storage.get("key_" + name)
                .then(data => {
                if (data != null) {
                    return this.parseAndAddKey(name, data);
                }
                else {
                    return Promise.reject(`No key found for ${name}`);
                }
            });
        }
    }
    createCertificateChain(subKey, keyType = '*', documentTypes = ['*'], ttl = 3600) {
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
        return this.getKey(keyName)
            .then((key) => key.sign(input, this.secret));
    }
    signCompact(keyName, input) {
        return this.getKey(keyName)
            .then((key) => key.sign(input, this.secret, true));
    }
    encrypt(recipient, input) {
        let buf = (typeof (input) == 'string') ? input : JSON.stringify(input);
        return JWE.createEncrypt({ protect: ['enc'], contentAlg: 'A256GCM' }, recipient)
            .update(buf).final();
    }
    // validate and return verify result
    verify(data) {
        return this.verifier.verify(data);
    }
    // validate and return payload as string
    verified(data) {
        return this.verify(data)
            .then(verified => verified.payload.toString("utf8"));
    }
    // parse realm description, verify signature and store keys.
    parseSignedRealm(name, signed) {
        let jws = typeof (signed) == 'string' ? JSON.parse(signed) : signed;
        return this.verifier.verify(jws)
            .then(result => {
            let obj = JSON.parse(result.payload);
            if (name != '*' && obj.name != name)
                return Promise.reject("Name does not match");
            return obj;
        })
            .then(obj => {
            let realm = Object.assign(new Realm(), obj);
            realm.timestamp = new Date(obj["@timestamp"]);
            realm.signed = JSON.stringify(jws);
            realm.icon = obj.icon ? obj.icon : '';
            realm.banner = obj.banner ? obj.banner : '';
            return JWK.asKey(obj.publicKey, 'json')
                .then(key => realm.publicKey = key)
                .then(() => realm);
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
    // in case we are a controller - we also need to store binding
    setControllerBinding(cb) {
        return this.storage.setObj("binding", cb.toJSON());
    }
    getControllerBinding() {
        return this.storage.getObj("binding")
            .then(obj => new ControllerBinding(obj));
    }
    deleteControllerBinding() {
        return this.storage.delete("binding");
    }
}

/**
 * Abstract class for storage
 *
 */
var logger$1 = Logger.create("Storage");
class Storage {
    constructor() {
    }
    set(key, value) {
        throw new ReferenceError("set unimplemented. set " + key);
    }
    setObj(key, json) {
        let v = JSON.stringify(json);
        return this.set(key, v);
    }
    get(key) {
        return Promise.reject("get not implemented");
    }
    getObj(key) {
        return Promise.reject("getObj not implemented");
    }
    list() {
        return Promise.reject("list not implemented");
    }
    delete(key) {
        return Promise.reject("delete not implemented");
    }
    writeReadTest(k, d) {
        return this.set(k, d)
            .then(v => this.get(k))
            .then(v => v == d);
    }
    test() {
        let key = "_test";
        return this.delete(key).then(ok => this.writeReadTest(key, "1"))
            .then(ok => {
            logger$1.info("storage.test1-write ", ok);
            if (!ok)
                throw new Error("bad");
            return this.writeReadTest(key, "2");
        })
            .then(ok => {
            logger$1.info("storage.test2-delete ", ok);
            return this.delete(key).then(k => {
                logger$1.info("storage.test2.deleted key: ", k);
                return ok;
            });
        })
            .then(ok => {
            logger$1.info("storage.test3-get ", ok);
            return this.get(key).then(v => {
                logger$1.info("storage.test3.deleted key-value: ", key, "value: ", v);
                return ok;
            });
        })
            .catch(err => {
            logger$1.error("storage.test.error: ", err, JSON.stringify(err, null, 2));
            return false;
        });
    }
}

export { Controller, Integrity, Storage, Logger, Base, ActionDescriptor, Contract, Message, Multipart, Part, Mandate, MandateToken, Realm, Key, Certificate, Receipt, Fact, ControllerBinding, ControllerDescriptor };
//# sourceMappingURL=controller-lib.es5.js.map
