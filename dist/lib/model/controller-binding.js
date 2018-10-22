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
var base_1 = require("./base");
var realm_1 = require("./realm");
var ControllerBinding = /** @class */ (function (_super) {
    __extends(ControllerBinding, _super);
    function ControllerBinding(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            _this.realmDescriptor = new realm_1.Realm(obj.realmDescriptor);
            _this.mandate = obj.mandate;
            _this.controllerCertificateChain = obj.controllerCertificateChain;
            _this.adminRoles = obj.adminRoles;
        }
        return _this;
    }
    ControllerBinding.prototype.toJSON = function () {
        var obj = _super.prototype.toJSON.call(this);
        obj.realmDescriptor = this.realmDescriptor.toJSON();
        obj.mandate = this.mandate;
        obj.adminRoles = this.adminRoles;
        obj.controllerCertificateChain = this.controllerCertificateChain;
        return obj;
    };
    return ControllerBinding;
}(base_1.Base));
exports.ControllerBinding = ControllerBinding;
//# sourceMappingURL=controller-binding.js.map