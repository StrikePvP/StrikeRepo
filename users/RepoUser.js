module.exports = class RepoUser{
    constructor(username, password, isAdmin){
        this.username = username;
        this.password = password;
        this.isAdmin = isAdmin;
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
}