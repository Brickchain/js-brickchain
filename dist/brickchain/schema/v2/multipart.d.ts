import { Base } from './base';
/**
 * This is the Multipart schema, used for embedding multiple document into one.
 */
export interface Multipart extends Base {
    /**
     * All parts of this multipart document.
     */
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
        [k: string]: any;
    }[];
    [k: string]: any;
}
