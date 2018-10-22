import { Base } from './base';
export declare class Realm extends Base {
    name: string;
    timestamp: Date;
    description: string;
    publicKey: any;
    endpoint: string;
    versions: string[];
    inviteURL: string;
    servicesURL: string;
    keyHistory: string[];
    actionsURL: string;
    icon: string;
    banner: string;
    constructor(obj?: any);
    toJSON(): any;
}
