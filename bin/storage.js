
const fs = require('fs')

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
  
            fs.readFile(file, (err,data)=>{
                if (err) return faliure(err)
                let list = new Array()
                let rows = data.toString().split("\n");
                for(let i in rows) {
                    let row = rows[i]
                    if (row.length > 0 && row[0] == '{') {
                        try {
                            list.push(JSON.parse(row))
                        } catch (e) {
                            console.error(e,"\nrow: ",row)
                        }
                    }
                }
                success(list)
            })
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
                writer.write(line+"\n")
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
            .on('data', (data) => {
                buf = buf + data; 
            })
            .on('end', ()=> {
                try {
                    let obj = JSON.parse(buf)
                    success(obj)
                } catch (err) {
                    console.error("cant parse json: "+buf)
                    failure(err)
                }
            })
            .on('error', (err) => { failure(err);});
        })
    }

    static writeObject(file, obj) {

        let json = "{}"
        try {
            json = JSON.stringify(obj,null,2)
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
