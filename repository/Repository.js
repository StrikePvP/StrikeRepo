const HashMap = require("hashmap");
const fs = require("fs");
const moment = require("moment");
module.exports = class Repository {
    constructor(name, isAdmin, lastUpdate){
        this.isAdmin = isAdmin;
        this.name = name;
        this.artefacts = new HashMap();
        this.lastUpdate = lastUpdate;
    }

    getArtefacts(){
        return this.artefacts;
    }

    addArtefact(name, version, artefact_package){
        this.artefacts.set(name, {
            "name" : name,
            "package" : artefact_package,
            "splited_package" : artefact_package.split("."),
            "version" : version
        })
    }

    removeArtefact(name){
        this.artefacts.delete(name);
    }

    getName(){
        return this.name;
    }

    isAdmin(){
        return this.isAdmin();
    }

    saveRepo(){
        this.lastUpdate = moment().format("Do MMMM YYYY, h:mm")
        fs.writeFileSync("./data/repositories/"+this.name+".json", this.toJson());
    }

    toJson(){
        var json = {
            "name" : this.name,
            "onlyAdmin" : this.isAdmin,
            "last_update" : this.lastUpdate,
            "artefacts" : {}
        }
        if(this.artefacts.keys().length != 0){
            for(const [key,value] of this.artefacts.entries()){
                json["artefacts"][key] = value
            }
        }
        return json;
    }

    getJSONArtefact(artefact){
        return this.artefacts.get(artefact);
    }

    save(){
        this.lastUpdate = moment().format("dddd MMMM YYYY, h:mm").toString()
        fs.writeFileSync("./data/repositories/"+this.name+".json", JSON.stringify(this.toJson()))
    }
}