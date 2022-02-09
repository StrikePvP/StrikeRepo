const HashMap = require("hashmap");
const fs = require("fs");
const RepoUser = require("./RepoUser")
const UUID = require("uuid");
const crypto = require("crypto");
const users = new HashMap();
const jwt = require("jsonwebtoken");

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

    verifyCreditials(username, password, isAdmin = false){
        if(this.isExist(username)){
            var user = this.getUser(username);
            if(user.getHashedPassword() == password){
                if(isAdmin){
                    if(user.isAdmin){
                        return true
                    }else{
                        return false;
                    }
                }else{
                    return true;
                }
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
    },

    verifyCookie(cookie){
        try{
            const dt = jwt.verify(cookie, "JDOJhio87HgfUU86%jh");
            if(this.isExist(dt.username)){
                const user = this.getUser(dt.username);
                if(dt.uuid = user.getUUID()){
                    if(dt.hashed_password == user.getHashedPassword()){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }catch(e){
            return false;
        }
    },

    getUserFromToken(cookie){
        try{
            const dt = jwt.verify(cookie, "JDOJhio87HgfUU86%jh");
            return this.getUser(dt.username)
        }catch(e){
            return null;
        }
    },

    getUsers(){
        return users;
    },

    removeUser(username){
        if(this.isExist(username)){
            users.delete(username)
            fs.unlinkSync("./data/users/"+username+".json")
        }
    }
};