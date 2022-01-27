const jwt = require("jsonwebtoken");

module.exports = class RepoUser{
    constructor(username, password, isAdmin, uuid){
        this.username = username;
        this.password = password;
        this.isAdmin = isAdmin;
        this.uuid = uuid;
    }

    isAdmin(){
        return this.isAdmin;
    }

    getUserName(){
        return this.username;
    }
    
    getHashedPassword(){
        return this.password;
    }

    getUUID(){
        return this.uuid;
    }

    toJsonWebToken(){
        return jwt.sign({
            "username" : this.getUserName(),
            "uuid" : this.getUUID()
        }, "JDOJhio87HgfUU86%jh");
    }
}