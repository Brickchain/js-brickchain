/**
 * Abstract class for storage
 *
 */
import { Logger } from './Logger';
var logger = Logger.create("Storage");
export class Storage {
    constructor() {
    }
    set(key, value) {
        throw new ReferenceError("set unimplemented. set " + key);
    }
    setObj(key, json) {
        let v = JSON.stringify(json);
        return this.set(key, v);
    }
    get(key) {
        return Promise.reject("get not implemented");
    }
    getObj(key) {
        return Promise.reject("getObj not implemented");
    }
    list() {
        return Promise.reject("list not implemented");
    }
    delete(key) {
        return Promise.reject("delete not implemented");
    }
    writeReadTest(k, d) {
        return this.set(k, d)
            .then(v => this.get(k))
            .then(v => v == d);
    }
    test() {
        let key = "_test";
        return this.delete(key).then(ok => this.writeReadTest(key, "1"))
            .then(ok => {
            logger.info("storage.test1-write ", ok);
            if (!ok)
                throw new Error("bad");
            return this.writeReadTest(key, "2");
        })
            .then(ok => {
            logger.info("storage.test2-delete ", ok);
            return this.delete(key).then(k => {
                logger.info("storage.test2.deleted key: ", k);
                return ok;
            });
        })
            .then(ok => {
            logger.info("storage.test3-get ", ok);
            return this.get(key).then(v => {
                logger.info("storage.test3.deleted key-value: ", key, "value: ", v);
                return ok;
            });
        })
            .catch(err => {
            logger.error("storage.test.error: ", err, JSON.stringify(err, null, 2));
            return false;
        });
    }
}
//# sourceMappingURL=Storage.js.map