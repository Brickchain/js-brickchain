/// <reference types="express" />
import * as express from "express";
import { Logger } from "../service/Logger";
import { Integrity } from "../service/Integrity";
import * as jose from "node-jose";
import { ActionDescriptor, ControllerBinding } from "../model";
/**
 * A generic controller interface for binding with a single realm
 * and handling keys & certificates. After binding to a realm
 * the realm is locked with this controller. There is no -
 * multi realm handling in this controller.
 *
 * @author brickchain
 */
export declare class Controller {
    logger: Logger;
    integrity: Integrity;
    bindingSecret: string;
    apiUri: string;
    adminUI: string;
    binding: any;
    bindFunc: (realmUrl: string, realmId: string, binding: any) => any;
    listActions: (baseurl: string, baseuri: string, realmName: string) => Array<ActionDescriptor>;
    constructor(integrity: Integrity, fun: (binding: any) => void, bindingSecret?: string);
    setAdminURL(url: string): void;
    /**
    * Add controller with binding endpoint to express Application,
    *  via some base (default = "/api")
    */
    addRoutes(app: express.Application, base?: string): void;
    private addCORS(res);
    getBinding(): Promise<ControllerBinding>;
    myHost(req: express.Request): string;
    descriptor(req: express.Request, res: express.Response): void;
    getDescriptor(): Promise<any>;
    binder(req: express.Request, res: express.Response): void;
    unbinder(req: express.Request, res: express.Response): void;
    setBinding(binding: ControllerBinding, realmKey: jose.Key): Promise<any>;
    originOptions(req: express.Request, res: express.Response): void;
    actions(req: express.Request, res: express.Response): void;
}
