const express = require('express');
const RepositoryManager = require('../repository/RepositoryManager');
const router = express.Router()
const UserManager = require("../users/UserManager");
const basicAuth = require("basic-auth");
const crypto = require("crypto")
const fs = require("fs");

var auth = function (req, res, next){
    var user = basicAuth(req)
    var isAdmin = false;
    if(RepositoryManager.isExist(req.params.repo)){
        var repo = RepositoryManager.getRepo(req.params.repo);
        isAdmin = repo.isAdmin;
    }
    if(!user || !user.name || !user.pass){
        res.set("WWW-Authenticate", "Basic realm=Authorization Required");
        res.sendStatus(401);
    }else{
        if(UserManager.verifyCreditials(user.name, crypto.createHash("md5").update(user.pass).digest("hex"), isAdmin)){
            next();
        }else{
            res.set("WWW-Authenticate", "Basic realm=Authorization Required");
            res.sendStatus(401);
        }
    }
}

router.route("/")
    .get((req,res) => {
        if(req.cookies["token"] == null){
            res.redirect("/login");
        }else{
            if(UserManager.verifyCookie(req.cookies["token"])){
                res.render("index", UserManager.getUserFromToken(req.cookies["token"]).toJson());
            }else{
                res.clearCookie("token")
                res.redirect("/login")
            }
        }
    })

router.route("/repos")
    .get((req,res) => {
        if(req.cookies["token"] == null){
            res.redirect("/login");
        }else{
            if(UserManager.verifyCookie(req.cookies["token"])){
                res.render("repositories", UserManager.getUserFromToken(req.cookies["token"]).toJsonWithRepos());
            }else{
                res.clearCookie("token")
                res.redirect("/login")
            }
        }
    })

router.route("/repo/:repo")
    .get((req, res) => {
        if(req.cookies["token"] == null){
            res.redirect("/login");
        }else{
            if(UserManager.verifyCookie(req.cookies["token"])){
                if(RepositoryManager.isExist(req.params.repo)){
                    res.render("repo", UserManager.getUserFromToken(req.cookies["token"]).toJsonWithRepo(req.params.repo));
                }else{
                    res.redirect("/");
                }
            }else{
                res.clearCookie("token")
                res.redirect("/login")
            }
        }
    })
router.route("/repo/:repo/:artefact")
    .get((req, res) => {
        if(req.cookies["token"] == null){
            res.redirect("/login");
        }else{
            if(UserManager.verifyCookie(req.cookies["token"])){
                if(RepositoryManager.isExist(req.params.repo)){
                    var repo = RepositoryManager.getRepo(req.params.repo);
                    if(repo.getArtefacts().keys().includes(req.params.artefact)){
                        var json = UserManager.getUserFromToken(req.cookies["token"]).toJson();
                        json["artefact"] = repo.getJSONArtefact(req.params.artefact);
                        res.render("artefact", json)
                    }else{
                        res.redirect("/");
                    }
                }else{
                    res.redirect("/");
                }
            }else{
                res.clearCookie("token")
                res.redirect("/login")
            }
        }
    })

router.route("/logout")
    .get((req, res) => {
        if(req.cookies["token"] == null){
            res.redirect("/login");
        }else{
            res.clearCookie("token")
            res.redirect("/login")
        }
    })

router.route("/repo/:repo/:package/:package2/:package3/:name/:version/:file")
    .get(auth, (req, res) => {
        if(RepositoryManager.isExist(req.params.repo)){
            var repo = RepositoryManager.getRepo(req.params.repo);
            if(repo.getArtefacts().keys().includes(req.params.name)){
                var artefact = repo.getArtefacts().get(req.params.name);
                if(artefact.splited_package[0] == req.params.package && artefact.splited_package[1] == req.params.package2 && artefact.splited_package[2] == req.params.package3){
                    if(artefact.version == req.params.version){
                        var folder = "./artefacts/"+artefact.package+"."+artefact.name+"."+artefact.version+"/";
                        if(fs.existsSync(folder+req.params.file)){
                            res.download(folder+req.params.file)
                        }else{
                            res.send("Error cannot find file")
                            res.end()
                        }
                    }else{
                        res.send("Incorrect version")
                        res.end()
                    }
                }else{
                    res.send("Incorrect package")
                    res.end()
                }
            }else{
                res.send("Incorrect artefact")
                res.end()
            }
        }else{
            res.send("Error cannot find the repo")
            res.end()
        }
    })


module.exports = router;