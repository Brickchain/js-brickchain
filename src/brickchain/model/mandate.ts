
import * as v1 from '../schema/v1/';
import * as v2 from '../schema/v2/';

import {Base} from "./base";

export class Mandate extends Base implements v2.Mandate {

  public static TYPE = "https://schema.brickchain.com/v2/mandate.json";
  public static TYPEv1 = "mandate";

  role: string;
  roleName?: string;
  validFrom?: string;
  validUntil?: string;
  recipient: { [k: string]: any; };
  sender?: string;
  params?: { [k: string]: any; ".*"?: string; };

  public constructor(time?: Date) {
    super(Mandate.TYPE, time)
  }

  public get validFromDate():Date { return new Date(this.validFrom); }
  public get validUntilDate():Date { return new Date(this.validUntil);}

  public setRole(role:string) {
    this.role = role; 
  }
  public setRoleName(roleName:string) {
    this.roleName = roleName; 
  }
  public setValidFrom(time:Date) {
    this.validFrom = time.toISOString(); 
  }
  public setValidUntil(time:Date) {
    this.validUntil= time.toISOString(); 
  }
  public setSender(userID:string) {
    this.sender = userID; 
  }
  public setParam(key:string, value:string) {
    if (this.params == undefined) this.params = {};
    this.params[key] = value; 
  }
  public setRecipient(key:any) {
    this.recipient = key; 
  }

  public getRole():string {
    return this.role; 
  }
  public getRoleName():string {
    return this.roleName; 
  }  
  public getValidFrom():Date {
    return this.validFromDate; 
  }
  public getValidUntil():Date {
    return this.validUntilDate;  
  }
  public getSender():string {
    return this.sender;
  }
  public getParam(key:string) {
    return this.params[key]; 
  }
  public getParamKeys():string[] {
    return this.params.keys()
  }
  public getRecipient():any {
    return this.recipient;
  }

}
