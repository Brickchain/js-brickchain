
const fs = require('fs')
var split = require('split')

/**
 * Storage with lines of json-structures, lines not starting with '{' ignored. 
 * Supports appending new lines and streaming objects though filters. 
 * TODO: make it support indexeddb API...
 */
class RowStorage {

    constructor(file) {
        this.file = file;
        this.objects = [];
    }

    readObjects() {
        return RowStorage.loadObjects(this.file)
    }

    writeObjects(list) {
        this.objects = list; 
        return RowStorage.writeObjects(this.file, this.objects)
    }

    static loadObjects(file) {

        if (!fs.existsSync(file)) return Promise.resolve(new Array())

        return new Promise((success,failure)=>{
            let list = new Array()
            fs.createReadStream(file)
            .pipe(split())
            .on('end', ()=> {
                this.objects = list
                success(list)
            })
            .on('data', (line) => {
                if (line.length > 0 && line[0] == '{') {
                    list.push(JSON.parse(line))
                }
            })
            .on('error', (err) => { failure(err);});
        })
    }

    static writeObjects(file, list) {    
        return new Promise((success, failiure)=>{
            let writer = fs.createWriteStream(file)
            .on('finish', ()=> {
                success(list.length)
            }).on('error', (err) => { failure(err);});

            list.forEach(obj => {
                let line = JSON.stringify(obj,null,0).replace('\n', '')
                writer.write(line)
            })
            writer.end();
        })
    }

}

exports.RowStorage = RowStorage; 

/**
 * plain JSON data drop. Nice indent, readable.
 */
class JSONStorage {

    constructor(file) {
        this.file = file;
        this.object = {}; 
    }

    readObject() {
        return JSONStorage.loadObject(this.file)
    }

    writeObject(object) {
        this.object = object; 
        return JSONStorage.writeObject(this.file, this.object)
    }

    static loadObject(file) {
        if (!fs.existsSync(file)) return Promise.resolve({})
        return new Promise((success,failure)=>{
            let buf = ""
            fs.createReadStream(file)
            .pipe(split())
            .on('end', ()=> {
                try {
                    let obj = JSON.parse(buf)
                    success(obj)
                } catch (err) {
                    failure(err)
                }
            })
            .on('data', (data) => {
                buf = buf + data; 
            })
            .on('error', (err) => { failure(err);});
        })
    }

    static writeObject(file, obj) {

        let json = "{}"
        try {
            let json = JSON.stringify(obj,null,2)
        } catch (err) {
            return Promise.reject(err)
        }

        return new Promise((success, fail)=>{
            let writer = fs.createWriteStream(file)
            writer.on('finish', ()=> { success(json.length) })
            writer.on('error', (err) => { fail(err);});
            writer.write(json);
            writer.end();
        })
    }
}
exports.JSONStorage = JSONStorage; 
