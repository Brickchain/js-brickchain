
import * as v1 from '../schema/v1/index';
import * as v2 from '../schema/v2/index';

import {Base} from "./base";
import {KeyPurpose} from './keypurpose'

export class ControllerDescriptor extends Base implements v2.ControllerDescriptor{

  public static TYPE = "https://schema.brickchain.com/v2/controller-descriptor.json"
  public static TYPEv1 = "controller-descriptor";


  /**
   * The label of the Controller.
   */
  label?: string;
  /**
   * Used to retrieve Action Descriptors from controller.
   */
  actionsURI?: string;
  /**
   * The Admin UI, inline or URI.
   */
  adminUI?: string;
  /**
   * The location of the binding URI, used by the Realm.
   */
  bindURI: string;
  /**
   * The controller's public key as JWK.
   */
  key: {
    [k: string]: any;
  };
  /**
   * An array of keypurposes, describes document types for the controller's certificate.
   */
  keyPurposes?: KeyPurpose[];
  /**
   * An indication that the Controller needs configuration.
   */
  requireSetup?: boolean;
  /**
   * Can be used to create new empty bindings on the controller.
   */
  addBindingEndpoint?: string;
  /**
   * An icon for the controller.
   */
  icon?: string;

  public constructor(time?:Date) {
      super(ControllerDescriptor.TYPE, time);
  }
  
}

export class ControllerBinding extends Base implements v2.ControllerBinding{

  public static TYPE = "https://schema.brickchain.com/v2/controller-binding.json"

  /**
   * The Realm Descriptor object.
   */
  realmDescriptor: {
    [k: string]: any;
  };
  /**
   * An array of admin roles that are allow to manage the Controller.
   */
  adminRoles: string[];
  /**
   * A Controller Certificate given from the Realm.
   */
  controllerCertificate: string;
  /**
   * A list of Mandates that allows the controller to act as a certain role in the realm.
   */
  mandates?: string[];

  public constructor(time?:Date) {
      super(ControllerBinding.TYPE, time);
  }
  
}
