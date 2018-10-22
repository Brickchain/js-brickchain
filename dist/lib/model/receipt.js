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
var Receipt = /** @class */ (function (_super) {
    __extends(Receipt, _super);
    function Receipt(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            _this.label = obj.label;
            _this.role = obj.role;
            _this.action = obj.action;
            _this.viewuri = obj.viewuri;
            _this.jwt = obj.jwt;
            _this.params = obj.params;
            if (obj.intervals) {
                _this.intervals = obj.intervals.map(function (interval) {
                    return {
                        start: new Date(interval.start),
                        end: new Date(interval.end)
                    };
                });
            }
        }
        _this.type = 'receipt';
        return _this;
    }
    Receipt.prototype.toJSON = function () {
        var obj = _super.prototype.toJSON.call(this);
        obj.label = this.label;
        obj.role = this.role;
        obj.viewuri = this.viewuri;
        obj.jwt = this.jwt;
        obj.intervals = this.intervals;
        obj.params = this.params;
        return obj;
    };
    return Receipt;
}(base_1.Base));
exports.Receipt = Receipt;
//# sourceMappingURL=receipt.js.map