import { Base } from './base';
export class Contract extends Base {
    constructor(obj) {
        super(obj);
        if (obj != undefined && obj != null) {
            this.text = obj.text;
        }
        this.type = 'contract';
    }
    toJSON() {
        let obj = super.toJSON();
        obj.text = this.text;
        return obj;
    }
}
//# sourceMappingURL=contract.js.map