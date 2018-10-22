import * as v2 from '../schema/v2/';
import { Base } from "./base";
export declare class Mandate extends Base implements v2.Mandate {
    static TYPE: string;
    static TYPEv1: string;
    role: string;
    roleName?: string;
    validFrom?: string;
    validUntil?: string;
    recipient: {
        [k: string]: any;
    };
    sender?: string;
    params?: {
        [k: string]: any;
        ".*"?: string;
    };
    constructor(time?: Date);
    readonly validFromDate: Date;
    readonly validUntilDate: Date;
    setRole(role: string): void;
    setRoleName(roleName: string): void;
    setValidFrom(time: Date): void;
    setValidUntil(time: Date): void;
    setSender(userID: string): void;
    setParam(key: string, value: string): void;
    setRecipient(key: any): void;
    getRole(): string;
    getRoleName(): string;
    getValidFrom(): Date;
    getValidUntil(): Date;
    getSender(): string;
    getParam(key: string): any;
    getParamKeys(): string[];
    getRecipient(): any;
}
