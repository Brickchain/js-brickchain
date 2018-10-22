export class Certificate {
    constructor(poj) {
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
    hasExpired() {
        return Date.now() > this.timestamp.getTime() + this.ttl;
    }
    allowedType(docType) {
        return ('*' in this.documentTypes) || (docType in this.documentTypes);
    }
}
//# sourceMappingURL=certificate.js.map