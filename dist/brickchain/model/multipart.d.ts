import * as v2 from '../schema/v2/index';
import { Base } from "./base";
import { Integrity } from "../integrity";
export declare class Multipart extends Base implements v2.Multipart {
    static TYPE: string;
    static TYPEv1: string;
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
    constructor(time?: Date);
    parseParts(integrity: Integrity, allowEmbeddedKey: boolean): Promise<any[]>;
    parsePart(part: any, integrity: Integrity, allowEmbeddedKey: boolean): Promise<any>;
}
