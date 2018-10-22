import { Base } from "./base";
export declare class Mandate extends Base {
    role: string;
    label: string;
    ttl: number;
    recipient: string;
    recipientName: string;
    recipientPublicKey: any;
    requestId: string;
    sender: string;
    params: {};
    constructor(obj?: any);
    toJSON(): any;
    getRealm(): string;
    getShortRole(): string;
    getIcon(): string;
}
