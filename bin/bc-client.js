#!/usr/bin/env node
'use strict';

const fetch = require("node-fetch")
const bc = require("../dist/integrity-lib.umd")
const Integrity = bc.Integrity; 
const storage = require("./storage")
const RowStorage = storage.RowStorage;
const JSONStorage = storage.JSONStorage;
const fs = require('fs')

/**
 * this is a client simulator that allows you to 
 * collect and manage i.e. 
 *   keys, certificates
 *   mandates, facts and realm-descriptions
 * and to execute 
 *   action-descriptors, mandates, etc. 
 * 
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
        let k3 = await this.integrity.getPrivate("signer");
        if (!k1) await this.integrity.createPrivate("master", "master")
        if (!k2) await this.integrity.createPrivate("device", "device")
        if (!k3) await this.integrity.createPrivate("signer", "signer") 
        return this.integrity     
    }

    async load() {

        let json = JSONStorage.loadObject(this.folder+"/keystore.json"); 
        if (Object.getOwnPropertyNames(json).length > 0) {
            this.integrity = Integrity.LoadIntegrity(json, (k,o,s)=>this.keychange(k,o,s))
        }

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

    toString() {
        return "data in: "+this.folder+
        "\nintegrity:\n"+this.integrity.toString() +
        "\nfacts:\n"+this.facts.map(f=>f.toString()).join("\n")+ 
        "\nmandates:\n"+this.mandates.map(m=>m.toString()).join("\n")+ 
        "\nrealms:\n"+this.mandates.map(r=>r.toString()).join("\n")+ 
        "\ncerts:\n"+this.certs.map(c=>c.toString()).join("\n");
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

    await client.store();
    // await client.integrity.
}

let client = new Client()

main(client, process.argv)
.then(()=>console.log("ok."))
.catch(err=>{console.error(err);process.exit(1)});
