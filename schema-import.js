/**
 * gererates interfaces from json-schema for brickchain protocol 'documents'
 * @author jonas
 */

const fsp = require('fs').promises
const fetch = require('node-fetch')
const json2ts = require('json-schema-to-typescript')
const compile = json2ts.compile;

// Current module 'json-schema-to-typescript' fails to handle 
// refs as inheritance and external dependency mapping. 
// see https://github.com/bcherny/json-schema-to-typescript
// issue in extending base class with allOf flattened with:
// https://github.com/mokkabonna/json-schema-merge-allof?files=1
// https://github.com/bcherny/json-schema-to-typescript#readme
// But issue is still in place:
//  https://github.com/bcherny/json-schema-to-typescript/issues/167
//
// Current solution tries to overcome the refAll and import 
// isses we have with 'json-schema-to-typescript'

let v1base = 'https://developer.brickchain.com/schemas/';
let v1classes = [
  'action',
  'actiondescriptor',
  'certificate-chain',
  'contract',
  'controller-binding',
  'document-callback',
  'fact',
  'mandate',
  'mandatetoken',
  'message',
  'multipart',
  'push-message',
  'realm-descriptor',
  'receipt',
  'revocation-checksum',
  'revocation',
  'scope-request',
  'signature-request',
  'url-response'
]

let v2base = 'https://schema.brickchain.com/v2/';
let v2classes = [
  'action',
  'actiondescriptor',
  'certificate',
  'contract',
  'controller-binding',
  'controller-descriptor',
  'fact-signature',
  'fact',
  'keypurpose',
  'mandate',
  'mandatetoken',
  'message',
  'multipart',
  'push-message',
  'realm-descriptor',
  'receipt',
  'revocation-checksum',
  'revocation-request',
  'revocation',
  'scope-request',
  'scope',
  'signature-request',
  'url-response'
]

async function gen(file, url, pack) {

  let json = await fetch(url).then(r => r.ok ? r.json() : Promise.reject("Response: "+r.statusText))
  let allof = undefined;

  if (json.allOf) {
    allof = json.allOf;
    delete json.allOf;
  }

  let ts = await compile(json, pack, {
    declareExternallyReferenced: false,
    unreachableDefinitions: true, 
    bannerComment: ""
  });

  // check what class-names we got. 
  let classes = []
  let re = /^export interface (.*?) \{$/mg;
  while(match = re.exec(ts)) {
    classes.push(match[1])
  }

  if (allof) { // expect these to inherrit from base - ugly.
    classes.forEach((cl,i)=>{
      ts = ts.replace("export interface "+cl+" {","export interface "+cl+" extends Base {")
    })

    // handle external imports - ugly. 
    if (url.indexOf("v2") != -1) {
      if (ts.indexOf("Scope")!=-1) ts = "import { Scope } from './scope'\n"+ts
      if (ts.indexOf("Contract")!=-1) ts = "import { Contract } from './contract'\n"+ts
      if (ts.indexOf("KeyPurpose")!=-1) ts = "import { KeyPurpose } from './keypurpose'\n"+ts
      if (ts.indexOf("FactSignature")!=-1) ts = "import { FactSignature } from './fact-signature'\n"+ts
    }

    ts = "import { Base } from './base'\n"+ts;

  } else {
    // independent class
  }

  // ts = "package "+pack+"\n"+ts;
  await fsp.writeFile(file, ts);

  console.log(" write "+file);
  return classes
}

async function genAll(files, base, target) {

  let exportClasses = []
  exportClasses = exportClasses.concat(await gen(target+"base.ts", base+"base.json", ""))
  let indexts = "import { Base } from './base'\n";

  for (i in files) {
    let v = files[i]
    let f = target+v+".ts"
    let url = base+v+".json"
    try {
      let cl = await gen(f, url, "src/")
      indexts = indexts + "import {"+cl.join(", ")+"} from './"+v+"'\n";
      exportClasses = exportClasses.concat(cl)
    } catch (err) {
      console.log("#error while importing: "+url, err)
    }
  }

  indexts += "export {"+exportClasses.join(", ")+"}\n";
  await fsp.writeFile(target+"index.ts", indexts);

  return true;

}


async function main() {
  try {
    await genAll(v1classes, v1base, "src/brickchain/schema/v1/")
    await genAll(v2classes, v2base, "src/brickchain/schema/v2/")
    return 0;
  } catch(err) {
    console.error(err);
    process.exit(1)
  }
}

main()
