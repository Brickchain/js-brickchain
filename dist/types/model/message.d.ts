import { Base } from "./base";
export declare class Message extends Base {
    title: string;
    message: string;
    constructor(obj?: any);
    toJSON(): any;
}
