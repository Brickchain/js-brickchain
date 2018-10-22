import { Base } from "./base";
import { Contract } from "./contract";
export declare class ActionDescriptor extends Base {
    label: string;
    realm: string;
    roles: string[];
    icon: string;
    data: any;
    contract: Contract;
    keyLevel: number;
    uiURI: string;
    actionURI: string;
    params: any;
    hasMandate: boolean;
    constructor(obj?: any);
    toJSON(): any;
}
