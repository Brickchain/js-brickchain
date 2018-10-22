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
var Action = /** @class */ (function (_super) {
    __extends(Action, _super);
    function Action(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            _this.role = obj.role;
            _this.mandate = obj.mandate;
            _this.nonce = obj.nonce;
            _this.role = obj.role;
            _this.params = obj.params;
            _this.facts = obj.facts;
            _this.contract = new contract_1.Contract(obj.contract);
        }
        return _this;
    }
    Action.prototype.toJSON = function () {
        var obj = _super.prototype.toJSON.call(this);
        obj.role = this.role;
        obj.mandate = this.mandate;
        obj.nonce = this.nonce;
        obj.role = this.role;
        obj.params = this.params;
        obj.facts = this.facts;
        obj.contract = this.contract;
        return obj;
    };
    return Action;
}(base_1.Base));
exports.Action = Action;
//# sourceMappingURL=action.js.map