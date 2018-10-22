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
var Mandate = /** @class */ (function (_super) {
    __extends(Mandate, _super);
    function Mandate(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            _this.role = obj.role;
            _this.label = obj.label;
            _this.ttl = obj.ttl ? obj.ttl : 0;
            _this.recipient = obj.recipient;
            _this.recipientName = obj.recipientName;
            if (obj.recipientPublicKey) {
                node_jose_1.default.JWK.asKey(obj.recipientPublicKey, 'json').then(function (key) { return _this.recipientPublicKey = key; });
            }
            _this.requestId = obj.requestId;
            _this.sender = obj.sender;
            _this.params = obj.params;
        }
        _this.type = 'mandate';
        return _this;
    }
    Mandate.prototype.toJSON = function () {
        var obj = _super.prototype.toJSON.call(this);
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
    };
    Mandate.prototype.getRealm = function () {
        var parts = this.role ? this.role.split("@", 2) : [];
        return parts.length == 2 ? parts[1] : undefined;
    };
    Mandate.prototype.getShortRole = function () {
        var parts = this.role ? this.role.split("@", 2) : [];
        return parts.length == 2 ? parts[0] : undefined;
    };
    Mandate.prototype.getIcon = function () {
        return 'md-key';
    };
    return Mandate;
}(base_1.Base));
exports.Mandate = Mandate;
//# sourceMappingURL=mandate.js.map