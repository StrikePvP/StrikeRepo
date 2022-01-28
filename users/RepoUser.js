const jwt = require("jsonwebtoken");

module.exports = class RepoUser{
    constructor(username, password, hashed_password, isAdmin, uuid){
        this.username = username;
        this.password = password;
        this.hashed_password = hashed_password;
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
        return this.hashed_password;
    }

    getPassword(){
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