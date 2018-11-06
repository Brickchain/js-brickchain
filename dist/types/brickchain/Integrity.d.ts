import * as jose from "node-jose";
import { Base, Fact, RealmDescriptor } from './model/';
/**
 * Key handling for integrity clients and controllers.
 *
 */
export declare class Integrity {
    static OP_SET: string;
    static OP_DEL: string;
    private keystorage;
    private privateKeyName;
    private privateKey;
    private verifier;
    private changeCallback;
    private constructor();
    static CreateIntegrity(changeCallback: (key: jose.Key, op: string, keystore: jose.JWK.KeyStorage) => any): Promise<Integrity>;
    static LoadIntegrity(storage: any, changeCallback: (key: jose.Key, op: string, keystore: jose.JWK.KeyStorage) => any): Promise<Integrity>;
    private notify;
    setPrivate(key: jose.Key): Promise<jose.Key>;
    getPrivate(kid?: string): Promise<any>;
    createPrivate(kid: string, use?: string): Promise<jose.Key>;
    signPublicKey(pubKey: jose.Key): Promise<jose.JWS>;
    deleteKey(kid: string): Promise<any>;
    private parseAndAddKey;
    getKey(name: string): Promise<jose.Key>;
    addKey(jwk: any): Promise<jose.Key>;
    createCertificate(subKey: jose.Key, keyType?: string, documentTypes?: string[], ttl?: number): Promise<jose.Key>;
    sign(keyName: string, input: any, compact?: boolean): Promise<any>;
    signCompact(keyName: string, input: any): Promise<string>;
    encrypt(recipient: jose.Key, input: any): Promise<any>;
    verify(jws: any, allowEmbeddedKey?: boolean): Promise<any>;
    verified(jws: any, allowEmbeddedKey?: boolean): Promise<string>;
    verifiedJSON(jws: any): Promise<string>;
    createType(type: string): Base;
    parseJSONSchema(json: any): any;
    parseMultipart(json: any, allowEmbeddedKey?: boolean): Promise<any>;
    factHash(fact: Fact): Promise<string>;
    private digest;
    /**
     * create mandate token as a compact jws
     * mandates can be mandates with signatures or just the compact-jws signatures.
     */
    mandateToken(mandates: any[], ttl?: number, keyId?: string): Promise<string>;
    /**
     * read all certificats, if signed with key we have, add signed key to keystore.
     * @param list - list of model.base docs.
     */
    addCertificates(list: Base[]): Promise<void>;
    parseSignedRealm(name: string, jws: any, importKey?: boolean): Promise<RealmDescriptor>;
    jsonHash(data: any): Promise<string>;
}
