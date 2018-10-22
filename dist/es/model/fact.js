import jose from 'node-jose';
import { Base } from "./base";
export class Fact extends Base {
    constructor(obj) {
        super(obj);
        this.isdefault = false;
        this.inactive = false;
        if (obj) {
            this.ttl = obj.ttl ? obj.ttl : 0;
            this.issuer = obj.iss;
            this.label = obj.label;
            this.data = obj.data;
            if (obj.recipient) {
                jose.JWK.asKey(obj.recipient, 'json').then(key => this.recipient = key);
            }
        }
    }
    toJSON() {
        let obj = super.toJSON();
        obj.ttl = this.ttl;
        obj.issuer = this.issuer;
        obj.label = this.label;
        obj.data = this.data;
        obj.recipient = this.recipient;
        obj.isdefault = this.isdefault;
        obj.inactive = this.inactive;
        return obj;
    }
    getIcon() {
        return Fact.getIconForType(this.subtype);
    }
    static isNativeFact(t) {
        return t == 'name' || t == 'phone' || t == 'email' || t == 'picture';
    }
    static getIconForType(type) {
        switch (type) {
            case 'name':
                return 'md-person';
            case 'phone':
                return 'md-call';
            case 'email':
                return 'md-mail';
            case 'picture':
                return 'md-camera';
            case 'dummy':
                return 'md-happy';
            case 'facebook':
                return 'logo-facebook';
            case 'google':
                return 'logo-google';
            default:
                return 'md-help-circle';
        }
    }
}
//# sourceMappingURL=fact.js.map