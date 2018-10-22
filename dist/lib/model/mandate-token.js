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
var MandateToken = /** @class */ (function (_super) {
    __extends(MandateToken, _super);
    function MandateToken(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (_this.timestamp == null)
                _this.timestamp = new Date(Date.now());
            _this.mandate = obj.mandate;
            _this.uri = obj.uri;
            _this.ttl = obj.ttl;
        }
        _this.type = 'mandate-token';
        return _this;
    }
    MandateToken.prototype.toJSON = function () {
        var obj = _super.prototype.toJSON.call(this);
        obj.mandate = this.mandate;
        obj.uri = this.uri;
        obj.ttl = this.ttl;
        return obj;
    };
    return MandateToken;
}(base_1.Base));
exports.MandateToken = MandateToken;
//# sourceMappingURL=mandate-token.js.map