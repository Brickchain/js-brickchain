import { Base } from "./base";
import { Realm } from "./realm";
export class ControllerBinding extends Base {
    constructor(obj) {
        super(obj);
        if (obj) {
            this.realmDescriptor = new Realm(obj.realmDescriptor);
            this.mandate = obj.mandate;
            this.controllerCertificateChain = obj.controllerCertificateChain;
            this.adminRoles = obj.adminRoles;
        }
    }
    toJSON() {
        let obj = super.toJSON();
        if (this.realmDescriptor)
            obj.realmDescriptor = this.realmDescriptor.toJSON();
        obj.mandate = this.mandate;
        obj.adminRoles = this.adminRoles;
        obj.controllerCertificateChain = this.controllerCertificateChain;
        return obj;
    }
}
//# sourceMappingURL=controller-binding.js.map