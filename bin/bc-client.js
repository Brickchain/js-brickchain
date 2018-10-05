#!/usr/bin/env node
'use strict';

const fetch = require("node-fetch")
const bc = require("../dist/integrity-lib.umd")
const fs = require('fs')
var split = require('split')

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
        this.integrity = bc.Integrity.CreateIntegrity(this.keychange)
        this.certs = []
        this.facts = []
        this.realms = []
        this.folder = null
    }

    keychange(key,op,store) {
        console.log("key "+op+" :", key);
    }

    async loadAll() {
        await loadMandates();
        await loadRealms();
        await loadFacts();
    }

    loadObjects(file) {
        return new Promise((success,failure)=>{
            let mlist = []
            fs.createReadStream(file)
            .pipe(split())
            .on('end', ()=> {
                console.debug("loaded "+mlist.length+" mandates.")
                this.mandates = mlist
                success(mlist)
            })
            .on('data', (line) => {
                if (line.length > 0 && line[0] == '{') {
                    mlist.push(JSON.parse(line))
                }
            })
            .on('error', (err) => { failure(err);});
        })
    }

    async writeObjects(file, list) {

        let writer = fs.createWriteStream(file)
        .on('finish', ()=> {
            success(list.length)
        })
        .on('error', (err) => { failure(err);});

        list.forEach(obj => {
            let line = JSON.stringify(obj,null,0).replace('\n', '')
            writer.write(line)
        })
        writer.end();

    }

    loadMandates() {
        return this.loadObjects(this.folder+"/mandates")
            .then(list => this.mandates = list.map(o => new bc.Mandate().parse(o)))
    }

    loadFacts() {
        return this.loadObjects(this.folder+"/facts")
            .then(list => this.facts = list.map(o => new bc.Fact().parse(o)))
    }

    loadRealms() {
        return this.loadObjects(this.folder+"/realms")
            .then(list => this.realms = list.map(o => new bc.RealmDescriptor().parse(o)))
    }

    writeMandates() {
        return this.writeObjects(this.folder+"/mandates", this.mandates);
    }

    writeFacts() {
        return this.writeObjects(this.folder+"/facts", this.facts);
    }

    writeRealms() {
        return this.writeObjects(this.folder+"/realms", this.realms);
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
    let dir = process.env["BC_CLIENT_CONFIG"] || "./bc-config"; 
    await client.loadAll();
}

let client = new Client()
main(client, process.argv).then(()=>consile.log(""))
.catch(err=>{console.error(err);process.exit(1)});
