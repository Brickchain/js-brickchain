/// <reference types="node" />
import * as jose from "node-jose";
import { Realm } from '../model';
/**
 * Key handling for integrity clients and controllers.
 *
 * Rules for key "kid" and "use":
 *
 *   realms are prefixed with realm-[domain-name]
 *   controllers are prefixed with realm-[domain-name]#[id]
 *   users are prefixed with user-[id]
 *
 * Use:
 *   "device", "sign", "access", "root", "..."
 *
 * Certificate storage & history:
 *   callback binding to store and retreve history of objects.
 *
 */
export declare class Integrity {
    static OP_SET: number;
    static OP_DEL: number;
    private keystorage;
    private privateKeyName;
    private privateKey;
    private verifier;
    private changeCallback;
    private constructor();
    static CreateIntegrity(changeCallback: (key: jose.Key, op: number, keystore: jose.JWK.KeyStorage) => any): Promise<Integrity>;
    static LoadIntegrity(input: Buffer, changeCallback: (key: jose.Key, op: number, keystore: jose.JWK.KeyStorage) => any): Promise<Integrity>;
    private notify(key, op);
    setPrivate(key: jose.Key): Promise<jose.Key>;
    getPrivate(kid?: string): Promise<any>;
    createPrivate(kid: string): Promise<jose.Key>;
    signPublicKey(pubKey: jose.Key): Promise<jose.JWS>;
    deleteKey(kid: string): Promise<any>;
    private parseAndAddKey(name, json);
    getKey(name: string): Promise<jose.Key>;
    createCertificate(subKey: jose.Key, keyType?: string, documentTypes?: string[], ttl?: number): Promise<jose.Key>;
    sign(keyName: string, input: any): Promise<string>;
    signCompact(keyName: string, input: any): Promise<string>;
    encrypt(recipient: jose.Key, input: any): Promise<any>;
    verify(jws: any): Promise<any>;
    verified(jws: any): Promise<string>;
    verifiedJSON(jws: any): Promise<string>;
    parseJSONSchema(json: any): any;
    parseSignedRealm(name: string, jws: any): Promise<Realm>;
    private verifyRealmHistory(realm);
    compareRealmHistory(realmA: Realm, realmB: Realm): Promise<any>;
}
