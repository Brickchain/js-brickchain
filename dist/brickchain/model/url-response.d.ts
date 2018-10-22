import * as v2 from '../schema/v2/index';
import { Base } from "./base";
export declare class UrlResponse extends Base implements v2.UrlResponse {
    static TYPE: string;
    static TYPEv1: string;
    /**
      * The URL.
      */
    url: string;
    constructor(time?: Date);
}
