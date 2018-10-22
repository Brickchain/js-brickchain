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
var contract_1 = require("./contract");
var ActionDescriptor = /** @class */ (function (_super) {
    __extends(ActionDescriptor, _super);
    function ActionDescriptor(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj != undefined && obj != null) {
            _this.label = obj.label;
            _this.roles = obj.roles;
            _this.icon = obj.icon;
            _this.data = JSON.stringify(obj);
            _this.contract = new contract_1.Contract(obj.contract);
            _this.keyLevel = obj.keyLevel;
            _this.uiURI = obj.uiURI;
            _this.actionURI = obj.actionURI;
            _this.params = obj.params;
        }
        _this.type = 'action-descriptor';
        return _this;
    }
    ActionDescriptor.prototype.toJSON = function () {
        var obj = _super.prototype.toJSON.call(this);
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
    };
    return ActionDescriptor;
}(base_1.Base));
exports.ActionDescriptor = ActionDescriptor;
//# sourceMappingURL=action-descriptor.js.map