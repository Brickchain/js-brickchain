"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var node_jose_1 = require("node-jose");
var base_1 = require("./base");
var Fact = /** @class */ (function (_super) {
    __extends(Fact, _super);
    function Fact(obj) {
        var _this = _super.call(this, obj) || this;
        _this.isdefault = false;
        _this.inactive = false;
        if (obj) {
            _this.ttl = obj.ttl ? obj.ttl : 0;
            _this.issuer = obj.iss;
            _this.label = obj.label;
            _this.data = obj.data;
            if (obj.recipient) {
                node_jose_1.default.JWK.asKey(obj.recipient, 'json').then(function (key) { return _this.recipient = key; });
            }
        }
        return _this;
    }
    Fact.prototype.toJSON = function () {
        var obj = _super.prototype.toJSON.call(this);
        obj.ttl = this.ttl;
        obj.issuer = this.issuer;
        obj.label = this.label;
        obj.data = this.data;
        obj.recipient = this.recipient;
        obj.isdefault = this.isdefault;
        obj.inactive = this.inactive;
        return obj;
    };
    Fact.prototype.getIcon = function () {
        return Fact.getIconForType(this.subtype);
    };
    Fact.isNativeFact = function (t) {
        return t == 'name' || t == 'phone' || t == 'email' || t == 'picture';
    };
    Fact.getIconForType = function (type) {
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
    };
    return Fact;
}(base_1.Base));
exports.Fact = Fact;
//# sourceMappingURL=fact.js.map