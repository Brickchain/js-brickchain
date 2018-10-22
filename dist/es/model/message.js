import { Base } from "./base";
export class Message extends Base {
    constructor(obj) {
        super(obj);
        this.type = 'message';
        this.title = obj.title;
        this.message = obj.message;
    }
    toJSON() {
        let obj = super.toJSON();
        obj.title = this.title;
        obj.message = this.message;
        return obj;
    }
}
//# sourceMappingURL=message.js.map