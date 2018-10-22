/**
 * This is the Push Message schema for Brickchain documents. Used for pushing messages to the client.
 */
export interface PushMessage {
    /**
     * The message title
     */
    title: string;
    /**
     * The content of the message
     */
    message: string;
    /**
     * TODO: An URI to a message?
     */
    uri?: string;
    /**
     * TODO: Some data
     */
    data?: string;
    [k: string]: any;
}
