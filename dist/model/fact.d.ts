import { Base } from "./base";
export declare class Fact extends Base {
    ttl: number;
    issuer: string;
    label: string;
    data: any;
    recipient: any;
    isdefault: boolean;
    inactive: boolean;
    constructor(obj?: any);
    toJSON(): any;
    getIcon(): string;
    static isNativeFact(t: string): boolean;
    static getIconForType(type: string): string;
}
