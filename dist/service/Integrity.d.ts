import * as jose from "node-jose";
import { Key, Realm, ControllerBinding } from '../model';
import { Storage } from "./Storage";
/**
 * Service, realm keys and other IDs.
 * Key handling for integrity clients and controllers.
 */
export declare class Integrity {
    private storage;
    private keys;
    private myOwnKeyID;
    private secret;
    private binding;
    private verifier;
    constructor(storage: Storage, secret: string);
    getMyID(): Promise<string>;
    setMyRoot(key: Key): Promise<string>;
    generateKey(name: string, id?: string): Promise<Key>;
    signPublicKey(key: Key): Promise<jose.Key>;
    getPrivateKey(key: Key): Promise<jose.Key>;
    storeKey(key: Key): Promise<string>;
    clearCache(): void;
    deleteKey(name: string): Promise<any>;
    private parseAndAddKey(name, json);
    getMyKey(): Promise<Key>;
    getKey(name: string): Promise<Key>;
    createCertificateChain(subKey: jose.Key, keyType?: string, documentTypes?: string[], ttl?: number): Promise<jose.Key>;
    sign(keyName: string, input: any): Promise<string>;
    signCompact(keyName: string, input: any): Promise<string>;
    encrypt(recipient: any, input: any): Promise<any>;
    verify(data: any): Promise<any>;
    verified(data: any): Promise<string>;
    parseSignedRealm(name: string, signed: any): Promise<Realm>;
    private verifyRealmHistory(realm);
    compareRealmHistory(realmA: Realm, realmB: Realm): Promise<any>;
    setControllerBinding(cb: ControllerBinding): Promise<string>;
    getControllerBinding(): Promise<ControllerBinding>;
    deleteControllerBinding(): Promise<string>;
}
