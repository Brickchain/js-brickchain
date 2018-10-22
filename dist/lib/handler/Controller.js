"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
MSFIDOCredentialAssertion;
var Logger_1 = require("../service/Logger");
var jose = require("node-jose");
var model_1 = require("../model");
/**
 * A generic controller interface for binding with a single realm
 * and handling keys & certificates. After binding to a realm
 * the realm is locked with this controller. There is no -
 * multi realm handling in this controller.
 *
 * @author brickchain
 */
var Controller = /** @class */ (function () {
    function Controller(storage, integrity, fun) {
        this.logger = Logger_1.Logger.create("handler.Controller");
        this.storage = storage;
        this.integrity = integrity;
        this.bindFunc = fun;
        this.getBinding()
            .then(function (b) {
            console.debug("binding: " + JSON.stringify(b));
            fun(b);
        })
            .catch(function (err) {
            console.debug(err);
            console.info("waiting for binding to complete...");
        });
    }
    /**
    * Add controller with binding endpoint to express Application,
    *  via some base (default = "/api")
    */
    Controller.prototype.addRoutes = function (app, base) {
        if (base === void 0) { base = "/api"; }
        this.apiUri = base;
        app.options(base + "/descriptor", this.originOptions.bind(this));
        app.options(base + "/bind", this.originOptions.bind(this));
        app.options(base + "/actions", this.originOptions.bind(this));
        app.get(base + "/descriptor", this.descriptor.bind(this));
        app.post(base + "/bind", this.binder.bind(this));
        app.delete(base + "/bind", this.unbinder.bind(this));
        app.get(base + "/actions", this.actions.bind(this));
    };
    Controller.prototype.addCORS = function (res) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,Authorization,Accept,Origin');
    };
    // returns forwarded or otherwise reqested "http[s]://host[:port]""
    Controller.prototype.myHost = function (req) {
        var fHost = req.get("x-forwarded-host");
        var fProto = req.get("x-forwarded-proto").split(',')[0];
        var baseurl = (fProto ? fProto : req.protocol) + '://' + (fHost ? fHost : req.get('host'));
        if (fHost)
            console.info("forwarded-host: " + baseurl);
        return baseurl;
    };
    Controller.prototype.descriptor = function (req, res) {
        var _this = this;
        this.addCORS(res);
        this.getDescriptor()
            .then(function (descriptor) {
            var baseurl = _this.myHost(req);
            var baseuri = _this.apiUri;
            // ensure realm-admin-ui/browser can read from this host.
            _this.addCORS(res);
            descriptor.actionsURI = baseurl + baseuri + "/actions";
            descriptor.adminUI = baseurl + baseuri + _this.adminUI;
            descriptor.bindURI = baseurl + baseuri + "/bind";
            console.info("descriptor: ", JSON.stringify(descriptor, null, 2));
            res.json(descriptor);
        })
            .catch(function (err) {
            console.debug("error! ", err);
            res.status(500).send("error: " + err);
        });
    };
    Controller.prototype.getDescriptor = function () {
        var _this = this;
        return this.integrity.getID()
            .then(function (keyId) {
            console.debug("got key: " + keyId);
            return _this.integrity.getKey(keyId);
        })
            .then(function (mykey) {
            console.debug("loaded key: ", mykey);
            if (mykey.publicKey)
                return Promise.resolve(mykey.publicKey);
            return jose.JWK.asKey(mykey.privateKey.toJSON(), "json");
        })
            .then(function (myPublicKey) {
            return {
                "@type": "controller-descriptor",
                label: "",
                key: myPublicKey,
                keyPurposes: [
                    {
                        documentType: "purpose/bind",
                        required: true,
                        description: "attach controller to realm"
                    }
                ]
            };
        });
    };
    Controller.prototype.binder = function (req, res) {
        var _this = this;
        // ensure realm-admin-ui/browser can read from this host.
        this.addCORS(res);
        if (!req.body) {
            res.sendStatus(400);
            return;
        }
        console.info("post bind <= " + JSON.stringify(req.body));
        console.info("binder got: " + req.body);
        var signed = req.body;
        var verified = null;
        var realmKey = null;
        var binding = null;
        this.integrity.verify(signed)
            .then(function (v) {
            verified = v;
            console.info("binder verified: " + v);
            return Promise.all([
                jose.JWK.asKey(verified.header.jwk),
                verified.payload.toString("utf8")
            ]);
        })
            .then(function (l) {
            realmKey = l[0];
            var data = l[1];
            var b = JSON.parse(data);
            console.info("binder received: ", data);
            binding = new model_1.ControllerBinding(b);
            return _this.setBinding(binding, realmKey);
        })
            .then(function (done) {
            console.info("responded: ", 201, "data: ", JSON.stringify(done));
            var realmName = binding.realmDescriptor.name;
            var realmUrl = "https://" + realmName + "/realm-api";
            _this.listActions = _this.bindFunc(realmUrl, realmName, binding);
            res.status(201).send("");
        })
            .catch(function (err) {
            console.error("error! ", err);
            res.status(500).send("Error: " + err);
        });
    };
    Controller.prototype.unbinder = function (req, res) {
        var _this = this;
        this.getBinding()
            .then(function (binding) {
            console.info("requesting binding delete.");
            return _this.storage.delete("binding");
        })
            .then(function (done) {
            console.info("deleted: " + done);
            res.status(201).send("");
        })
            .catch(function (err) {
            console.error(err);
            res.status(500).send(err);
        });
    };
    Controller.prototype.getBinding = function () {
        var _this = this;
        if (this.binding)
            return Promise.resolve(this.binding);
        return this.storage.get("binding")
            .then(function (txt) {
            _this.binding = JSON.parse(txt);
            return _this.binding;
        });
    };
    Controller.prototype.setBinding = function (binding, realmKey) {
        // verify realmKey used for mandate and certificate
        // then store them for persistance.
        var _this = this;
        // TODO: create a class for controller-binding
        // binding = {@type:"controller-binding",
        //    @timestamp: "2017-01-01T10:01:01.12313+02:00",
        //    realmDescriptor:{...}, adminRoles:["admin@test.com"],
        //    controllerCertificateChain:"{JWS-compact}",
        //    mandate: "{JWS-compact}"}
        console.info("setBinding: ", JSON.stringify(binding, null, 2));
        console.info("realmKey: ", JSON.stringify(realmKey, null, 2));
        return Promise.all([
            this.integrity.verify(binding.controllerCertificateChain),
            this.integrity.verify(binding.mandate)
        ])
            .then(function (l) {
            var cver = l[0];
            var mver = l[1];
            return Promise.all([
                cver.payload.toString("utf8"),
                mver.payload.toString("utf8"),
                jose.JWK.asKey(cver.header.jwk),
                jose.JWK.asKey(mver.header.jwk),
            ]);
        })
            .then(function (l) {
            var cert = JSON.parse(l[0]);
            var mand = JSON.parse(l[1]);
            var ckey = l[2];
            var mkey = l[3];
            console.debug("cert: ", cert);
            console.debug("mandate: ", mand);
            // TODO: store keys to crypt
            _this.binding = binding;
            return _this.storage.setObj("binding", binding);
        });
    };
    Controller.prototype.originOptions = function (req, res) {
        this.addCORS(res);
        res.sendStatus(201);
    };
    Controller.prototype.actions = function (req, res) {
        this.addCORS(res);
        var baseurl = this.myHost(req);
        var baseuri = this.apiUri;
        var realmName = this.binding.realmDescriptor.name;
        var realmUrl = "https://" + realmName + "/realm-api";
        var actions = this.listActions ?
            this.listActions(baseurl, baseuri, realmName)
                .map(function (a) { return a.toJSON(); }) :
            Array();
        res.json(actions);
    };
    return Controller;
}());
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map