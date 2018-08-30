
import * as v1 from '../schema/v1/index';
import * as v2 from '../schema/v2/index';

import {Base} from "./base";

export class RealmDescriptor extends Base implements v2.RealmDescriptor{

  public static TYPE = "https://schema.brickchain.com/v2/realm-descriptor.json"
  public static TYPEv1 = "realm-descriptor";

  /**
   * The label of the Realm.
   */
  label?: string;
  /**
   * The public JWK of the Realm.
   */
  publicKey?: {
    [k: string]: any;
  };
  /**
   * The Invite URL for the Realm.
   */
  inviteURL?: string;
  /**
   * Location of where to find services published by the Realm.
   */
  servicesURL?: string;
  /**
   * The location of the icon used for displaying the Realm.
   */
  icon?:string;

  /**
   * The location of the banner used for displaying the Realm.
   */
  banner?: string;

  public constructor(time?:Date) {
      super(RealmDescriptor.TYPE, time);
  }
  
  getLabel(): string {
      return this.label; 
  }
}
