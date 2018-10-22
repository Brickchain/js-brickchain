export class Base {
    constructor(type, time) {
        this.setType(type);
        this.setTimestamp(time ? time : new Date());
    }
    setType(type) {
        this["@type"] = type;
    }
    getType() {
        return this["@type"];
    }
    setTimestamp(time) {
        this["@type"] = time.toISOString();
    }
    getTimestamp() {
        return new Date(this["@timestamp"]);
    }
    setID(id) {
        this["@id"] = id;
    }
    getID() {
        return this["@id"];
    }
    getCertificate() {
        return this["@certificate"];
    }
    setCertificate(jwsCert) {
        this["@certificate"] = jwsCert;
    }
    getRealm() {
        return this["@realm"];
    }
    setRealm(realm) {
        this["@realm"] = realm;
    }
    toJSON() {
        return Object.assign({}, this);
    }
}
//# sourceMappingURL=base.js.map