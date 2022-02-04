const HashMap = require("hashmap");
const repositories = new HashMap();
const Repository = require("./Repository");
const fs = require("fs")

module.exports = {
    getRepositories(){
        return repositories.values().filter(function(repo){ return !repo.isAdmin});
    },

    getAdminRepositories(){
        return repositories.values();
    },

    getRepo(repo){
        return repositories.get(repo)
    },

    isExist(repo){
      return repositories.keys().includes(repo)  
    },
    
    loadRepositories(){
        const files = fs.readdirSync("./data/repositories").filter(file => file.endsWith('.json'));
        for(const file of files){
            const repojson = require("../data/repositories/"+file);
            const repo = new Repository(repojson.name, repojson.onlyAdmin, repojson.last_update);
            if(repojson["artefacts"] != null){
                for(var attribute in repojson["artefacts"]){
                    const jsonartefact = repojson["artefacts"][attribute];
                    repo.addArtefact(attribute, jsonartefact["version"], jsonartefact["package"])
                }
            }
            console.log("Loaded repo named "+repo.getName()+" with "+repo.getArtefacts().values().length+" artefact(s)")
            repositories.set(repo.getName(), repo)
        }

    }
}