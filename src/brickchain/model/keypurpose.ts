
import * as v1 from '../schema/v1/index';
import * as v2 from '../schema/v2/index';

export class KeyPurpose implements v2.KeyPurpose {
    /**
     * The document type needed in the certificate.
     */
    documentType: string;
    /**
     * This document type may be optional or required.
     */
    required?: boolean;
    /**
     * The description of (the requirement of) the document type.
     */
    description?: string;

    public constructor() {
    }

  }
