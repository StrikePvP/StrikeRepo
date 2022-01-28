const HashMap = require("hashmap");
const fs = require("fs");
const RepoUser = require("./RepoUser")
const UUID = require("uuid");
const crypto = require("crypto");
const users = new HashMap();

module.exports = {
    loadUsers(){
        const files = fs.readdirSync("./data/users").filter(file => file.endsWith('.json'));
        for(const file of files){
            const user = require("../data/users/"+file);
            users.set(user.username, new RepoUser(user.username, user.password, user.hashed_password, user.isAdmin, user.uuid));
            console.log("Loaded user named "+user.username+" with UUID "+user.uuid);
        }
    },

    createUser(name, password, isAdmin){
        const useruuid = UUID.v4();
        const md5 = crypto.createHash("md5");
        const pass = md5.update(password).digest("hex");
        users.set(name, new RepoUser(name, password, pass, isAdmin, useruuid));
        const json = {
            "username" : name,
            "password" : password,
            "hashed_password" : pass,
            "uuid" : useruuid,
            "isAdmin" : isAdmin
        }
        console.log("Creating user "+name+" with UUID "+useruuid);
        fs.writeFileSync('./data/users/'+name+".json", JSON.stringify(json));
    },

    verifyCreditials(username, password){
        if(this.isExist(username)){
            if(this.getUser(username).getHashedPassword() == password){
                return true;
            }else{
                return false;
            }
        }else{
            return false;
        }
    },

    getUser(username){
        return users.get(username);
    },

    isExist(username){
        return users.has(username);
    }
}