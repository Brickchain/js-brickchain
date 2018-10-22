import { Base } from "./base";
import * as jose from "node-jose";
export declare class ControllerDescriptor extends Base {
    label: string;
    realm: string;
    actionsURI: string;
    adminUI: string;
    bindURI: string;
    key: jose.Key | any;
    keyPurposes: string[];
    requireSetup: boolean;
    addBindingEndpoint: string;
    icon: string;
    constructor(obj?: any, key?: jose.Key);
    toJSON(): any;
}
