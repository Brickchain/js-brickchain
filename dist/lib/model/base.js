"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jose = require("node-jose");
var Base = /** @class */ (function () {
    function Base(obj) {
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
    Base.parseSigned = function (c, signed, id) {
        var jws;
        if (typeof (signed) == 'string') {
            jws = JSON.parse(signed);
        }
        else {
            jws = signed;
        }
        return Base.verifier.verify(jws)
            .then(function (result) {
            var payload = result.payload.toString('utf-8');
            var document = new c(JSON.parse(payload));
            if (id != undefined && id != null) {
                document.id = id;
            }
            document.signed = JSON.stringify(jws);
            return document;
        });
    };
    Base.prototype.toString = function () {
        return JSON.stringify(this, null, 2);
    };
    Base.prototype.toJSON = function () {
        var obj = {};
        obj["@id"] = this.id;
        obj["@context"] = this.context;
        obj["@type"] = this.type;
        obj["@subtype"] = this.subtype;
        obj["@timestamp"] = this.timestamp;
        obj["@certificateChain"] = this.certificateChain;
        obj["signed"] = this.signed;
        return obj;
    };
    Base.verifier = jose.JWS.createVerify();
    return Base;
}());
exports.Base = Base;
//# sourceMappingURL=base.js.map