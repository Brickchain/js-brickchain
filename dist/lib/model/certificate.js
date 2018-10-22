"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Certificate = /** @class */ (function () {
    function Certificate(poj) {
        if (poj) {
            this.timestamp = poj.timestamp;
            this.ttl = poj.ttl;
            this.root = poj.root;
            this.subKey = poj.subKey;
            this.keyLevel = poj.keyLevel;
            this.keyType = poj.keyType;
            this.documentTypes = poj.documentTypes;
        }
    }
    Certificate.prototype.hasExpired = function () {
        return Date.now() > this.timestamp.getTime() + this.ttl;
    };
    Certificate.prototype.allowedType = function (docType) {
        return ('*' in this.documentTypes) || (docType in this.documentTypes);
    };
    return Certificate;
}());
exports.Certificate = Certificate;
//# sourceMappingURL=certificate.js.map