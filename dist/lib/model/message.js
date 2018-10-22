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
var Message = /** @class */ (function (_super) {
    __extends(Message, _super);
    function Message(obj) {
        var _this = _super.call(this, obj) || this;
        _this.type = 'message';
        _this.title = obj.title;
        _this.message = obj.message;
        return _this;
    }
    Message.prototype.toJSON = function () {
        var obj = _super.prototype.toJSON.call(this);
        obj.title = this.title;
        obj.message = this.message;
        return obj;
    };
    return Message;
}(base_1.Base));
exports.Message = Message;
//# sourceMappingURL=message.js.map