import { Base } from "./base";
export class MandateToken extends Base {
    constructor(obj) {
        super(obj);
        if (obj) {
            if (this.timestamp == null)
                this.timestamp = new Date(Date.now());
            this.mandate = obj.mandate;
            this.uri = obj.uri;
            this.ttl = obj.ttl;
        }
        this.type = 'mandate-token';
    }
    toJSON() {
        let obj = super.toJSON();
        obj.mandate = this.mandate;
        obj.uri = this.uri;
        obj.ttl = this.ttl;
        return obj;
    }
}
//# sourceMappingURL=mandate-token.js.map