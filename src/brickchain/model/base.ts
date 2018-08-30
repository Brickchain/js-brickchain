
import * as v1 from '../schema/v1/index';
import * as v2 from '../schema/v2/index';

export class Base implements v2.Base {

  /**
   * Document type as URI, subtype after '#'.
   */
  public "@type": string;
  /**
   * Timestamp of when the document was created.
   */
  public "@timestamp": string;
  /**
   * A unique identifier of the document (uuid).
   */
  public "@id"?: string;
  /**
   * The certificate chain that was used as proof of current signature.
   */
  public "@certificate"?: string;
  /**
   * The name of the realm that issued this document.
   */
  public "@realm"?: string;

  public constructor(type: string, time?:Date) {
    this.setType(type)
    this.setTimestamp(time?time:new Date())
  }

  public setType(type:string) {
    this["@type"] = type;
  }

  public getType() {
    return this["@type"];
  }

  public setTimestamp(time:Date) {
    this["@timestamp"] = time.toISOString();
  }

  public getTimestamp():Date {
    return new Date(this["@timestamp"]);
  }

  public setID(id:string) {
    this["@id"] = id;
  }

  public getID():string {
    return this["@id"];
  }

  public getCertificate():string {
    return this["@certificate"];
  }

  public setCertificate(jwsCert:string) {
    this["@certificate"] = jwsCert;
  }

  public getRealm():string {
    return this["@realm"];
  }

  public setRealm(realm:string) {
    this["@realm"] = realm;
  }

  public toJSON():any {
    let json = Object.assign<any,any>({},this);
    // clean out getters
    if ("context" in json) delete json["context"];
    if ("subtype" in json) delete json["subtype"];
    return json
  }

  public parse(json:any):Base {
      Object.assign(this, json);
      return this; 
  }

  /**
   * 1 for V1 and 2 for V2 schema source.
   */
  public schemaVersion():number {
    if (this.getType().indexOf(":") == -1) return 1;
    return 2;  
  }

  /**
   * V1 and V2 stores differently
   */
  get subtype():string {
    if (this.getType().indexOf("#")>0) {
      return this.getType().substring(this.getType().indexOf("#")+1)
    }
    return this["@subtype"]
  }

  /**
   * V1 - only
   */
  get context():string {
    return this["@context"]
  }

}
