import { Base } from "./base";
export declare class Receipt extends Base {
    label: string;
    role: string;
    action: string;
    viewuri: string;
    jwt: string;
    intervals: Array<any>;
    params: any;
    constructor(obj?: any);
    toJSON(): any;
}
