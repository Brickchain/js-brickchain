import * as jose from "node-jose";
export class Base {
    constructor(obj) {
        if (obj != undefined && obj != null) {
            this.id = obj["@id"];
            this.type = obj["@type"];
            if (obj["@timestamp"] != undefined)
                this.timestamp = new Date(obj["@timestamp"]);
        }
        else {
            this.timestamp = new Date(Date.now());
        }
    }
    static parseSigned(c, signed, id) {
        let jws;
        if (typeof (signed) == 'string') {
            jws = JSON.parse(signed);
        }
        else {
            jws = signed;
        }
        return Base.verifier.verify(jws)
            .then(function (result) {
            let payload = result.payload.toString('utf-8');
            let document = new c(JSON.parse(payload));
            if (id != undefined && id != null) {
                document.id = id;
            }
            document.signed = JSON.stringify(jws);
            return document;
        });
    }
    toString() {
        return JSON.stringify(this, null, 2);
    }
    toJSON() {
        let obj = {};
        obj["@id"] = this.id;
        obj["@context"] = this.context;
        obj["@type"] = this.type;
        obj["@subtype"] = this.subtype;
        obj["@timestamp"] = this.timestamp;
        obj["@certificateChain"] = this.certificateChain;
        obj["signed"] = this.signed;
        return obj;
    }
}
Base.verifier = jose.JWS.createVerify();
//# sourceMappingURL=base.js.map