import jose from 'node-jose';
import { Base } from "./base";
export class Mandate extends Base {
    constructor(obj) {
        super(obj);
        if (obj) {
            this.role = obj.role;
            this.label = obj.label;
            this.ttl = obj.ttl ? obj.ttl : 0;
            this.recipient = obj.recipient;
            this.recipientName = obj.recipientName;
            if (obj.recipientPublicKey) {
                jose.JWK.asKey(obj.recipientPublicKey, 'json').then(key => this.recipientPublicKey = key);
            }
            this.requestId = obj.requestId;
            this.sender = obj.sender;
            this.params = obj.params;
        }
        this.type = 'mandate';
    }
    toJSON() {
        let obj = super.toJSON();
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
    }
    getRealm() {
        let parts = this.role ? this.role.split("@", 2) : [];
        return parts.length == 2 ? parts[1] : undefined;
    }
    getShortRole() {
        let parts = this.role ? this.role.split("@", 2) : [];
        return parts.length == 2 ? parts[0] : undefined;
    }
    getIcon() {
        return 'md-key';
    }
}
//# sourceMappingURL=mandate.js.map