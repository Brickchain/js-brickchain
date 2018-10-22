import { Base } from "./base";
import { Realm } from "./realm";
export declare class ControllerBinding extends Base {
    realmDescriptor: Realm;
    adminRoles: string[];
    controllerCertificateChain: string;
    mandate: string;
    constructor(obj?: any);
    toJSON(): any;
}
