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
var Realm = /** @class */ (function (_super) {
    __extends(Realm, _super);
    function Realm(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            _this.name = obj.name;
            _this.timestamp = new Date(obj.timestamp);
            _this.description = obj.description;
            _this.publicKey = obj.publicKey; // TODO: parse via node-jose
            _this.endpoint = obj.endpoint;
            _this.versions = obj.versions;
            _this.inviteURL = obj.inviteURL;
            _this.servicesURL = obj.servicesURL;
            _this.keyHistory = obj.keyHistory;
            _this.actionsURL = obj.actionsURL;
            _this.icon = obj.icon;
            _this.banner = obj.banner;
        }
        return _this;
    }
    Realm.prototype.toJSON = function () {
        var obj = _super.prototype.toJSON.call(this);
        Object.assign(obj, this);
        return obj;
    };
    return Realm;
}(base_1.Base));
exports.Realm = Realm;
//# sourceMappingURL=realm.js.map