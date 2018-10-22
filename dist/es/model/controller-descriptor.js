import { Base } from "./base";
export class ControllerDescriptor extends Base {
    constructor(obj, key) {
        super(obj);
        if (obj) {
            this.label = obj.label;
            this.realm = obj.realm;
            this.actionsURI = obj.actionsURI;
            this.adminUI = obj.adminUI;
            if (key)
                this.key = key;
            else
                this.key = obj.key;
            this.keyPurposes = obj.keyPurposes;
            this.requireSetup = obj.requireSetup;
            this.addBindingEndpoint = obj.addBindingEndpoint;
            this.icon = obj.icon;
        }
    }
    toJSON() {
        let obj = super.toJSON();
        obj.key = this.key;
        obj.label = this.label;
        obj.actionsURI = this.actionsURI;
        obj.adminUI = this.adminUI;
        obj.keyPurposes = this.keyPurposes;
        obj.requireSetup = this.requireSetup;
        obj.addBindingEndpoint = this.addBindingEndpoint;
        obj.icon = this.icon;
        obj.realm = this.realm;
        return obj;
    }
}
//# sourceMappingURL=controller-descriptor.js.map