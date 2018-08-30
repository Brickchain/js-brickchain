
import * as jose from "node-jose"

import * as v1 from './schema/v1/index';
import * as v2 from './schema/v2/index';

import {
  Base, 
    Action, ActionDescriptor, 
    Certificate, Contract, 
    ControllerDescriptor, ControllerBinding, 
    Fact, FactSignature, KeyPurpose, 
    RealmDescriptor, Mandate, 
    Revocation, RevocationChecksum, RevocationRequest, 
    ScopeRequest, Scope,
    SignatureRequest, UrlResponse, Message, Multipart
} from './model/'

function getRoot() {
  // Establish the root object, `window` in the browser, or `global` on the server.
  let root = this; 
  return root;
}

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
export class Integrity {

    public static OP_SET = "set";
    public static OP_DEL = "add";

    private keystorage: jose.JWK.KeyStorage;
    private privateKeyName: string;
    private privateKey: jose.JWK;
    private verifier: jose.JWS.Verifier;
    private changeCallback: (key:jose.Key, op:string, keystore:jose.JWK.KeyStorage)=>any

    private constructor(keystorage: jose.KeyStorage, privateKeyName : string = "master") {
        this.keystorage = keystorage;
        this.privateKeyName = privateKeyName;
    }

    public static async CreateIntegrity(
      changeCallback: (key:jose.Key, op:string, keystore:jose.JWK.KeyStorage)=>any):Promise<Integrity> {
        let storage = await jose.JWK.createKeyStore();
        return Integrity.LoadIntegrity(storage, changeCallback)
    }

    public static async LoadIntegrity(
      storage: any,
      changeCallback: (key:jose.Key, op:string, keystore:jose.JWK.KeyStorage)=>any):Promise<Integrity> {
        let ks = await jose.JWK.asKeyStore(storage)
        let i = new Integrity(ks)
        i.verifier = await jose.JWS.createVerify(ks)
        i.changeCallback = changeCallback;
        return i;
    }

    private notify(key:jose.Key, op:string):Promise<any> {

        if (this.changeCallback) {
          try {
            this.changeCallback(key, op, this.keystorage)
          } catch (err) {
            return Promise.reject(err)
          }
        }
        return Promise.resolve()
    }

    public async setPrivate(key: jose.Key) : Promise<jose.Key> {

        if (key.kid == this.privateKeyName) {
            this.privateKey = key;
        }

        let k = await this.keystorage.add(key)
        await this.notify(k, Integrity.OP_SET)
        return k
    }

    public async getPrivate(kid: string = "") {

        if (!this.privateKey) {
          this.privateKey = await this.keystorage.get(kid?kid:this.privateKeyName, true);
        }
        return this.privateKey;

    }

    public async createPrivate(kid:string, use:string = "master") : Promise<jose.Key> {
        let k = await this.keystorage.generate('EC', 'P-256', {kid: kid, use:use });
        await this.notify(k, Integrity.OP_SET)
        return k;
    }

    // Adds a singed key as "signedPublicKey" to key.
    public async signPublicKey(pubKey: jose.Key): Promise<jose.JWS> {

      let privateKey = this.getPrivate()

      let jws = await jose.JWS.createSign(
        { format: 'flattened' },
        { key: privateKey, reference: 'jwk' }
      ).update(JSON.stringify(pubKey), 'utf8').final()

      return jws;
    }

    public async deleteKey(kid:string):Promise<any> {
      let k = await this.keystorage.remove(kid)
      if (k) await this.notify(k, Integrity.OP_DEL)
      return k
    }

    private async parseAndAddKey(name:string, json:any): Promise<jose.Key> {
      if (typeof json == 'string') json = JSON.parse(json)
      json.kid = name; 
      let key = await this.keystorage.add(json);
      if (key) await this.notify(key, Integrity.OP_SET)
      return key;
    }

    public getKey(name: string): Promise<jose.Key> {
      return this.keystorage.get(name);
    }

    public createCertificate(
        subKey: jose.Key,
        keyType: string = '*',
        documentTypes: string[] = ['*'],
        ttl: number = 3600): Promise<jose.Key> {

        return this.getKey('root')
            .then(rootKey => <jose.CertificateChain> {
                timestamp: new Date(),
                root: rootKey.publicKey,
                subKey: subKey.publicKey,
                keyType: keyType,
                documentTypes: documentTypes,
                ttl: ttl,
            })
            .then(chain => this.signCompact('root', chain))
            .then(chain => subKey.certificateChain = chain)
            .then(() => subKey)
    }


    public sign(keyName: string, input: any): Promise<string> {
        return this.getPrivate(keyName)
          .then((key:jose.Key)=>key.sign(input))
    }

    public signCompact(keyName: string, input: any): Promise<string> {
        return this.getPrivate(keyName)
          .then((key:jose.Key)=>key.sign(input, true))
    }

    public encrypt(recipient: jose.Key, input: any): Promise<any> {
        let buf = (typeof (input) == 'string') ? input : JSON.stringify(input)
        return jose.JWE.createEncrypt(
          { protect: ['enc'], contentAlg: 'A256GCM' },recipient)
          .update(buf).final()
    }

    // validate and return verify result
    public verify(jws: any): Promise<any> {

        if (typeof jws === 'string') {
          if (jws[0] != '{') { // compact form to jws conversion
            let parts = jws.split(".");
            jws = {
              protected: parts[0],
              payload: parts[1],
              signature: parts[2]
            }
          } else {
            jws = JSON.parse(jws);
          }
        }

        return this.verifier.verify(jws)
    }

    // validate and return payload as string
    public verified(jws: any): Promise<string> {
        return this.verify(jws)
            .then(verified =>  verified.payload.toString("utf8"))
    }

    // validate and return payload as string
    public async verifiedJSON(jws: any): Promise<string> {
        let json = await this.verified(jws)
        return JSON.parse(json)
    }

    public createType(type:string):Base {
      switch(type) {
        case Action.TYPE:
        case Action.TYPEv1:
            return new Action();

        case ActionDescriptor.TYPEv1:
        case ActionDescriptor.TYPE:
          return new ActionDescriptor();

        case RealmDescriptor.TYPEv1:
        case RealmDescriptor.TYPE:
          return new RealmDescriptor();

        case Certificate.TYPE: 
          return new Certificate();

        case ControllerDescriptor.TYPE:
        case ControllerDescriptor.TYPEv1:
          return new ControllerDescriptor();
        case ControllerBinding.TYPE:
          return new ControllerBinding(); 

        case Multipart.TYPE:
        case Multipart.TYPEv1:
            return new Multipart();  

        case ScopeRequest.TYPE:
        case ScopeRequest.TYPEv1:
            return new ScopeRequest();  

        case SignatureRequest.TYPE:
        case SignatureRequest.TYPEv1:
            return new SignatureRequest();  
    
        case Mandate.TYPE:
        case Mandate.TYPEv1:
            return new Mandate();

        case Fact.TYPE:
        case Fact.TYPEv1:
            return new Fact();

        case Message.TYPE:
        case Message.TYPEv1:
            return new Message();

        case UrlResponse.TYPE:
        case UrlResponse.TYPEv1:
            return new UrlResponse();

        }
        throw new Error("unknown type: "+type)
    }

    // parse brickchain protocol objects
    public parseJSONSchema(json: any): any {
      let type = json["@type"]
      let i = type.indexOf("#");
      if (i > 0) type = type.substring(0,i);
      let obj = this.createType(type);
      // console.log(obj)
      obj.parse(json);
      return obj; 
    }

    public async factHash(fact: Fact):Promise<string> {
      
      let dataString =JSON.stringify(fact.data);
      let hash = await this.digest("SHA-256",dataString);
      return hash; 

    }

    private async digest(hash, pdata) : Promise<string> {

      let window = getRoot()
      if (window.crypto && window.crypto.subtle) { // browser
        let alg = {name: hash}; // "SHA-256"
        return window.crypto.subtle.digest(alg, pdata);
      } else { // node
        let crypto = require("crypto")
        // "sha256"
        let md = hash.replace("SHA-", "SHA").toLowerCase();
        let digest = crypto.createHash(md)
        digest.update(pdata);
        return Promise.resolve(digest.digest())
      }
    }

    // parse realm description in JWS, verify signature and store keys.
    public async parseSignedRealm(name: string, jws: any, importKey:boolean = true): Promise<RealmDescriptor> {

      if (typeof (jws) == 'string') jws = JSON.parse(jws)

      // get key out and verify that we have it. assumes full JWS. 
      let pText = Buffer.from(jws.protected, "base64").toString('utf8')
      let pJSON = JSON.parse(pText);
      let pKey = await this.getKey(pJSON.kid);
      if (!pKey) {
        if (!importKey) throw new Error("unknown key in signature: "+pJSON.kid);
        pKey = await this.parseAndAddKey(pJSON.kid, pJSON.jwk)
        // console.log("added new key: "+pKey)
      }

      let result = await this.verifier.verify(jws);
      let obj = JSON.parse(result.payload);
      if (name != '*' && obj.name != name) throw new Error("Name does not match");

      let realm = Object.assign(new RealmDescriptor(), obj);
      realm.timestamp = new Date(obj["@timestamp"]);
      // realm.signed = JSON.stringify(jws);
      realm.icon = obj.icon ? obj.icon : '';
      realm.banner = obj.banner ? obj.banner : '';

      let pubKey = await jose.JWK.asKey(obj.publicKey, 'json')
      realm.publicKey = pubKey;

      return realm;

    }
/*
    private verifyRealmHistory(realm: RealmDescriptor): Promise<string> {
      let prevKey: any = realm.publicKey;
      let pl: Promise<any>[] =
        realm.keyHistory.reverse()
        .map((eventJWS) => this.verifier.verify(eventJWS))

      return Promise.all(pl)
        .then(events=>{
          events.forEach((event, i)=>{
            if (event.key.thumbprint() != prevKey.thumbprint())
              return Promise.reject("thumbprint miss match in chain")
          })
          return Promise.resolve("")
        })
    }

    public compareRealmHistory(realmA: RealmDescriptor, realmB: RealmDescriptor): Promise<any> {
      return this.verifyRealmHistory(realmA)
        .then(myThumbprint => this.verifyRealmHistory(realmB)
          .then(otherThumbprint => myThumbprint == otherThumbprint ? Promise.resolve() : Promise.reject("key history didn't match"))
        )
    }
    */
}
