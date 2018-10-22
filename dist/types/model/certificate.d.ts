export declare class Certificate {
    timestamp: Date;
    ttl: number;
    root: any;
    subKey: any;
    keyLevel: number;
    keyType: string;
    documentTypes: string[];
    constructor(poj?: any);
    hasExpired(): boolean;
    allowedType(docType: string): boolean;
}
