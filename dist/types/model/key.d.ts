import * as jose from "node-jose";
/**
 * Name and public key, optionally private key.
 *
 */
export declare class Key {
    name: string;
    id: string;
    privateKey: jose.Key;
    publicKey: jose.Key;
    certificateChain: string;
    level: number;
    timestamp: number;
    timeout: number;
    encryptedKey: string;
    signedPublicKey: any;
    constructor(name: string, privateKey?: jose.Key);
    static makeKey(name: string, privateKey?: any): Promise<Key>;
    getPublicKey(): Promise<jose.Key>;
    isEncrypted(): boolean;
    hasPrivateKey(): boolean;
    setID(id: string): Promise<Key>;
    decryptKey(pin: string): Promise<string>;
    encryptKey(pin: string): Promise<string>;
    getPrivateKey(pin?: string): Promise<jose.Key>;
    sign(input: any, pin?: string, compact?: boolean): Promise<string>;
    thumbprint(hash?: string): Promise<string>;
    thumbprint64(hash?: string): Promise<string>;
    toJSON(): string;
    toObject(): any;
    static fromJSON(data: string): Promise<Key>;
}
