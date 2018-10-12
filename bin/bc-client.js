#!/usr/bin/env node
'use strict';

const fetch = require("node-fetch")
const bc = require("../dist/integrity-lib.umd")
const Integrity = bc.Integrity; 
const storage = require("./storage")
const RowStorage = storage.RowStorage;
const JSONStorage = storage.JSONStorage;
const fs = require('fs')

const crypto = require('crypto');
const jose = require('node-jose');

/**
 * this is a client simulator that allows you to 
 * collect and manage i.e. keys, certificates
 *   mandates, facts and realm-descriptions
 * and to execute 
 *   action-descriptors with mandates, etc. 
 */

class Client {

    constructor() {
        this.mandates = []
        this.integrity = null; 
        this.certs = []
        this.facts = []
        this.realms = []
        this.folder = "."
    }

    keychange(key,op,store) {
        console.log("key "+op+" :", key);
        JSONStorage.writeObject(this.folder+"/keystore.json", store.toJSON(true))
    }

    loadFrom(folder) {
        this.folder = folder; 
        return this.load()
    }

    async init() {
        this.integrity = await Integrity.CreateIntegrity((k,o,s)=>this.keychange(k,o,s));
        let k1 = await this.integrity.getPrivate(""); // master
        let k2 = await this.integrity.getPrivate("device");
        let k3 = await this.integrity.getPrivate("app");
        if (!k1) {
            console.log("create new master key")
            await this.integrity.createPrivate("master", "") // "enc" or "sig"
        }
        if (!k2) {
            console.log("create new device key")
            await this.integrity.createPrivate("device", "")
        }
        if (!k3) {
            console.log("create new app key")
            await this.integrity.createPrivate("app", "") 
        }
        return this.integrity     
    }

    async load() {
        let json = await JSONStorage.loadObject(this.folder+"/keystore.json"); 
        if (Object.getOwnPropertyNames(json).length > 0) 
            this.integrity = await Integrity.LoadIntegrity(json, (k,o,s)=>this.keychange(k,o,s))
        let l  = await RowStorage.loadObjects(this.folder+"/mandates.rows");
        this.mandates = l.map(o => new bc.Mandate().parse(o))
        l = await RowStorage.loadObjects(this.folder+"/realms.rows"); 
        this.realms = l.map(o => new bc.RealmDescriptor().parse(o))
        l = await RowStorage.loadObjects(this.folder+"/facts.rows"); 
        this.facts = l.map(o => new bc.Fact().parse(o))
        return this;
    }

    async store() {
        let count = 0; 
        count += await RowStorage.writeObjects(this.folder+"/mandates.rows", this.mandates);
        count += await RowStorage.writeObjects(this.folder+"/facts.rows", this.facts);
        count += await RowStorage.writeObjects(this.folder+"/realms.rows", this.realms);
        return count;
    }

    async realmDescriptor(realmurl) {
        if (realmurl.indexOf("http") == -1) { // fixing the url 
            realmurl = "https://"+realmurl
        }
        if (realmurl.indexOf(".well-known") == -1) {
            if (realmurl.charAt(realmurl.length-1) != '/') realmurl = realmurl + "/";
            realmurl = realmurl+".well-known/realm/realm.json"
        }
        let r = await fetch(realmurl)
        if (!r.ok) throw new Error(r.statusText)
        let json = await r.json()
        return await this.integrity.parseSignedRealm("*" ,json)
    } 

    async realmServices(realm, mandates) {
        let jws = await this.integrity.mandateToken(mandates)
        let h = { authorization: "mandate "+jws }
        let r = await fetch(realm.servicesURL, {credentials:"include", headers: h})
        if (!r.ok) throw new Error(r.statusText)
        let json = await r.json()
        let list = await this.integrity.parseMultipart(json, true)
        await this.integrity.addCertificates(list)
        return list
    } 

    async action(descr, params) {
        let action = new bc.Action()
        if (params) action.params = params; 
        let jws = await this.integrity.sign("master", JSON.stringify(action))
        let r = await fetch(descr.actionURI, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json; charset=utf-8"}, 
            body: JSON.stringify(jws)
        })
        let json = await r.json()
        return json
    }

    async join(realmurl){
        let realm = await this.realmDescriptor(realmurl)
        await this.integrity.addKey(realm.publicKey)
        let svcs = await this.realmServices(realm)
        let action = svcs.find(
            a => a.interfaces && 
            a.interfaces.some(i=>i == "https://interfaces.brickchain.com/v1/public-role.json"))
        let json = await this.action(action); 
        let list = await this.integrity.parseMultipart(json)
        let mandate = list.find(p=>p.getType() == bc.Mandate.TYPE)
        console.debug("joined as: ", mandate)
        this.mandates.push(mandate)
        return mandate
    } 

    async list(realmurl) {
        let realm = await this.realmDescriptor(realmurl)
        await this.integrity.addKey(realm.publicKey)
        let roles = this.mandates.filter(m => m["@realm"] == realm["@id"])
        console.log("roles: ", roles.map(r=>r.role))
        let list = await this.realmServices(realm, roles)
        console.log("services: ", list.map(ad=>ad.label+": "+ad.actionURI ))
        return list;
    }
}

async function main(client, args) {
    let dir = process.env["BC_CLIENT_CONFIG"] || "./bc-client"; 
    if (dir && !fs.existsSync(dir)) {
        console.log("creating folder: "+dir)
        fs.mkdirSync(dir);
    }
    await client.loadFrom(dir);
    if (!client.integrity) await client.init();

    if (args.length > 2) {
        let op = args[2].toLowerCase()
        let url = "https://infra.integrity.app/"
        switch(op) {
            case "join":
                if (args.length > 3) url = args[3]
                console.log("join realm: "+url)
                await client.join(url)
                break; 
            case "list":
                if (args.length > 3) url = args[3]
                console.log("list realm: "+url)
                await client.list(url)
                break;     
            default:  
                console.log("unknown operation: "+op)
                return 
        }
    }
    await client.store();
}

let client = new Client()

main(client, process.argv)
.then(()=>console.log("ok."))
.catch(err=>{console.error(err);process.exit(1)});
