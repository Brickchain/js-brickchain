
import * as jose from "node-jose"

import * as v1 from './schema/v1/index';
import * as v2 from './schema/v2/index';

import {
  Base, 
    Action, ActionDescriptor, 
    Certificate, Contract, 
    ControllerDescriptor, ControllerBinding, 
    Fact, FactSignature, KeyPurpose, 
    RealmDescriptor, Mandate, MandateToken, 
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
        if (kid == this.privateKeyName || kid == "") {
          if (!this.privateKey) {
              this.privateKey = await this.keystorage.get(this.privateKeyName, {}, true);
          }   
          return this.privateKey;
        } 
        return await this.keystorage.get(kid, {}, true);
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

    public addKey(jwk: any): Promise<jose.Key> {
      return this.keystorage.add(jwk);
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


    public async sign(keyName: string, input: any, compact: boolean = false): Promise<any> {
      let pkey = await this.getPrivate(keyName)
      let buf = typeof (input) == 'string' ? input : JSON.stringify(input)
      let fmt:any = compact ? {format: "compact"} : {}
      let jws = jose.JWS.createSign(fmt, { key: pkey, reference: 'jwk' })
      // console.debug("sign: ", jws, pkey)
      return await jws.final(buf, 'utf8')
    }

    public signCompact(keyName: string, input: any): Promise<string> {
      return this.sign(keyName, input, true)
    }

    public encrypt(recipient: jose.Key, input: any): Promise<any> {
        let buf = (typeof (input) == 'string') ? input : JSON.stringify(input)
        return jose.JWE.createEncrypt(
          { protect: ['enc'], contentAlg: 'A256GCM' },recipient)
          .final(buf)
    }

    // validate and return verify result
    public verify(jws: any, allowEmbeddedKey = false): Promise<any> {

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

        return this.verifier.verify(jws, {allowEmbeddedKey: allowEmbeddedKey})
    }

    // validate and return payload as string
    public verified(jws: any, allowEmbeddedKey = false): Promise<string> {
        return this.verify(jws, allowEmbeddedKey)
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

        case MandateToken.TYPE:
        case MandateToken.TYPEv1:
            return new MandateToken();
    
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
      obj.parse(json);
      return obj; 
    }

    async parseMultipart(json, allowEmbeddedKey = false) {
      let mp = this.parseJSONSchema(json)
      if (mp.getType() != Multipart.TYPE && 
          mp.getType() != Multipart.TYPEv1) {
          throw new Error("unexpected response, expecting multipart: "+mp.toJSON())
      }
      return await mp.parseParts(this, allowEmbeddedKey); 
    }

    public async factHash(fact: Fact):Promise<string> {
      let dataString =JSON.stringify(fact.data);
      let hash = await this.digest("SHA-256",dataString);
      return hash; 
    }

    private async digest(hash, pdata, fmt = "hex") : Promise<string> {
      let window = getRoot()
      if (window.crypto && window.crypto.subtle) { // browser
        let alg = {name: hash}; // "SHA-256"
        let hbuf = await window.crypto.subtle.digest(alg, pdata)
        if (fmt == "hex") {
          const hArray = Array.from(new Uint8Array(hbuf));
          return hArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
        } else if (fmt == 'base64') {
          return window.btoa(hbuf)
        }
        return hbuf.toString(fmt)
      } else { // node
        let crypto = require("crypto") // "sha256"
        let md = hash.replace("SHA-", "SHA").toLowerCase();
        let digest = crypto.createHash(md)
        digest.update(pdata);
        return Promise.resolve(digest.digest(fmt))
      }
    }

    /**
     * create mandate token as a compact jws
     * mandates can be mandates with signatures or just the compact-jws signatures.
     */
    public mandateToken(mandates:any[], ttl = 60000, keyId = "") : Promise<string> {
        if (!mandates || mandates.length == 0) return undefined;
        let token = new MandateToken()
        token.mandates = mandates.map(m => typeof(m) == 'string' ? m : m.signature); 
        token.ttl = ttl 
        return this.signCompact(keyId, token)
    }
    
    /**
     * read all certificats, if signed with key we have, add signed key to keystore.
     * @param list - list of model.base docs.
     */
    public async addCertificates(list:Base[]) { // bad certs will blow this!
      for (let i in list) {
          let a = list[i]
          let jws = a["@certificate"]
          if (jws) {
              let json = await this.verified(jws)
              let cert = JSON.parse(json)
              if (!await this.getKey(cert.subject.kid)) {
                  await this.addKey(cert.subject)
              }
          }
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

    // encode strings, objects, arrays into reproduceable string
    // note, this is v0 formating expect multihash/multibase
    // see: https://github.com/multiformats/multibase
    public jsonHash(data:any):Promise<string> {

      // let hash = (obj) => {
      //   return crypto.createHash('SHA256').update(obj).digest('hex')
      // }

      let serialize = function(d) {
        let o = [];

        Object.keys(d).sort().forEach(k => {
            let v = d[k]
            switch (typeof v) {
              case 'string':
                o.push(k+':'+v)
                break;
              case 'object':
                if (Array.isArray(v)) {
                    let s = []
                    v.forEach(v => {
                        if (typeof v == 'object') s.push(serialize(v));
                        else s.push(v);
                    })
                    o.push(k+':['+s.join('|')+']')
                } else {
                    o.push(k+':'+serialize(v))
                }
                break;
              default:
                throw "values of type "+typeof v + "not supported";
            }
          })
        return '{'+o.join("|")+'}'
      }
      return this.digest("SHA-256", serialize(data), "hex")
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
