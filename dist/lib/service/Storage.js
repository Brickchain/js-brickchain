"use strict";
/**
 * Abstract class for storage
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("./Logger");
var logger = Logger_1.Logger.create("Storage");
var Storage = /** @class */ (function () {
    function Storage() {
    }
    Storage.prototype.set = function (key, value) {
        throw new ReferenceError("set unimplemented. set " + key);
    };
    Storage.prototype.setObj = function (key, json) {
        var v = JSON.stringify(json);
        return this.set(key, v);
    };
    Storage.prototype.get = function (key) {
        return Promise.reject("get not implemented");
    };
    Storage.prototype.getObj = function (key) {
        return Promise.reject("getObj not implemented");
    };
    Storage.prototype.list = function () {
        return Promise.reject("list not implemented");
    };
    Storage.prototype.delete = function (key) {
        return Promise.reject("delete not implemented");
    };
    Storage.prototype.writeReadTest = function (k, d) {
        var _this = this;
        return this.set(k, d)
            .then(function (v) { return _this.get(k); })
            .then(function (v) { return v == d; });
    };
    Storage.prototype.test = function () {
        var _this = this;
        var key = "_test";
        return this.delete(key).then(function (ok) { return _this.writeReadTest(key, "1"); })
            .then(function (ok) {
            logger.info("storage.test1-write ", ok);
            if (!ok)
                throw new Error("bad");
            return _this.writeReadTest(key, "2");
        })
            .then(function (ok) {
            logger.info("storage.test2-delete ", ok);
            return _this.delete(key).then(function (k) {
                logger.info("storage.test2.deleted key: ", k);
                return ok;
            });
        })
            .then(function (ok) {
            logger.info("storage.test3-get ", ok);
            return _this.get(key).then(function (v) {
                logger.info("storage.test3.deleted key-value: ", key, "value: ", v);
                return ok;
            });
        })
            .catch(function (err) {
            logger.error("storage.test.error: ", err, JSON.stringify(err, null, 2));
            return false;
        });
    };
    return Storage;
}());
exports.Storage = Storage;
//# sourceMappingURL=Storage.js.map