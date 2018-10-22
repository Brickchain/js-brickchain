import { Base } from "./base";
import { Contract } from "./contract";
export class ActionDescriptor extends Base {
    constructor(obj) {
        super(obj);
        if (obj != undefined && obj != null) {
            this.label = obj.label;
            this.roles = obj.roles;
            this.icon = obj.icon;
            this.data = JSON.stringify(obj);
            this.contract = new Contract(obj.contract);
            this.keyLevel = obj.keyLevel;
            this.uiURI = obj.uiURI;
            this.actionURI = obj.actionURI;
            this.params = obj.params;
        }
        this.type = 'action-descriptor';
    }
    toJSON() {
        let obj = super.toJSON();
        obj.label = this.label;
        obj.roles = this.roles;
        obj.icon = this.icon;
        obj.data = this.data;
        obj.contract = this.contract;
        obj.keyLevel = this.keyLevel;
        obj.uiURI = this.uiURI;
        obj.actionURI = this.actionURI;
        obj.params = this.params;
        return obj;
    }
}
//# sourceMappingURL=action-descriptor.js.map