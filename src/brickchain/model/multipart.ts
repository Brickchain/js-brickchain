
import * as v1 from '../schema/v1/index';
import * as v2 from '../schema/v2/index';

import {Base} from "./base";
import {Integrity} from "../integrity";

export class Multipart extends Base implements v2.Multipart{

  public static TYPE = "https://schema.brickchain.com/v2/multipart.json"
  public static TYPEv1 = "multipart";


  parts: {
    /**
     * The used encoding of the document part.
     */
    encoding?: string;
    /**
     * The name of the part.
     */
    name?: string;
    /**
     * The document itself.
     */
    document?: string;
    /**
     * TODO
     */
    uri?: string;
  }[];
  
  public constructor(time?:Date) {
      super(Multipart.TYPE, time);
  }
  
  async parseParts(integrity:Integrity, allowEmbeddedKey:boolean) {
    let list = new Array()
    for (let i in this.parts) {
        let part = this.parts[i];
        let doc = await this.parsePart(part,integrity, allowEmbeddedKey)
        list.push(doc)
    }
    return list; 
  }

  async parsePart(part, integrity:Integrity, allowEmbeddedKey:boolean) {
    let json = part.document;
    let jws;
    if (part.encoding.indexOf("+jws") > 0) {
        jws = json
        json = await integrity.verified(jws, allowEmbeddedKey)
    }
    let doc = integrity.parseJSONSchema(JSON.parse(json));
    if (jws) doc.signature = jws;
    return doc
  }

}
