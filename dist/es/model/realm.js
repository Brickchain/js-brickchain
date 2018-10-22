import { Base } from './base';
export class Realm extends Base {
    constructor(obj) {
        super(obj);
        if (obj) {
            this.name = obj.name;
            this.timestamp = new Date(obj.timestamp);
            this.description = obj.description;
            this.publicKey = obj.publicKey; // TODO: parse via node-jose
            this.endpoint = obj.endpoint;
            this.versions = obj.versions;
            this.inviteURL = obj.inviteURL;
            this.servicesURL = obj.servicesURL;
            this.keyHistory = obj.keyHistory;
            this.actionsURL = obj.actionsURL;
            this.icon = obj.icon;
            this.banner = obj.banner;
        }
    }
    toJSON() {
        let obj = super.toJSON();
        Object.assign(obj, this);
        return obj;
    }
}
//# sourceMappingURL=realm.js.map