#!/usr/bin/env node
'use strict';

/**
 * This is a command line tool for basic realm description 
 * resolution. 
 */

const fetch = require("node-fetch")
const bc = require("../dist/integrity-lib.umd")

if (process.argv.length != 3) {
    console.log("requires one argument, the realm (domain) to dig");
    process.exit(1);
}  

let domain = process.argv[2];
console.log("looking up "+domain)
let url = "https://"+domain+"/.well-known/realm/realm.json"

async function dig(url) {

    let integrity = await bc.Integrity.CreateIntegrity(
        (key,op,store)=>(console.log(op+" key:", key.kid))
    )
    let r = await fetch(url)
    if (!r.ok) throw new Error(r.statusText)
    let json = await r.json()
    let realm = await integrity.parseSignedRealm("*" ,json)
    console.log("realm-descriptor: ", realm)

    r = await fetch(realm.servicesURL)
    if (!r.ok) throw new Error(r.statusText)
    json = await r.json()
    let mp = integrity.parseJSONSchema(json)
    if (mp.getType() != bc.Multipart.TYPE && mp.getType() != bc.Multipart.TYPEv1)
        throw new Error("unexpected response, expecting multipart: "+mp.toJSON())

    for (let i in mp.parts) {
        let part = mp.parts[i];
        let doc = part.document; 
        if (part.encoding.indexOf("+jws") > 0) {
            doc = await integrity.verified(doc)
        }
        // console.log("doc:"+doc);
        let actionDescriptor = integrity.parseJSONSchema(JSON.parse(doc));
        console.log("service: ", actionDescriptor)
    }
}

dig(url).then(()=>console.log(""))
.catch(err => {
    console.error(err, url)
    process.exit(1)
})




