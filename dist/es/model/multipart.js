import { Base } from "./base";
export class Part {
}
export class Multipart extends Base {
    constructor(obj) {
        super(obj);
        this.parts = obj.parts;
        this.type = 'multipart';
    }
    toJSON() {
        let obj = super.toJSON();
        obj.parts = this.parts;
        return obj;
    }
}
//# sourceMappingURL=multipart.js.map