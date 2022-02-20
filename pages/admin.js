const express = require('express');
const router = express.Router()
const UserManager = require("../users/UserManager")
const fs = require("fs");
const formidable = require("formidable");
const e = require('express');
const RepositoryManager = require('../repository/RepositoryManager');

router.all("/admin/*", (req, res, next) => {
    if(req.cookies["token"] == null){
        res.redirect("/login");
    }else{
        if(UserManager.verifyCookie(req.cookies["token"])){
            if(!UserManager.getUserFromToken(req.cookies["token"]).isAdmin){
                res.redirect("/")
            }else{
                next()
            }
        }else{
            res.clearCookie("token")
            res.redirect("/login")
        }
    }
})

router.get("/admin/", (req, res) => {
    res.render("admin_repo", UserManager.getUserFromToken(req.cookies["token"]).toJsonWithRepos())
})

router.get("/admin/artefacts", (req, res) => {
    res.render("admin_artefact", UserManager.getUserFromToken(req.cookies["token"]).toJsonWithRepos())
})

router.post("/admin/add_artefact", (req, res) => {
    if(req.fields.package && req.fields.version && req.fields.name){
        const folder = "./artefacts/"+req.fields.package+"."+req.fields.name+"."+req.fields.version;
        if(!fs.existsSync(folder)) fs.mkdirSync(folder)
        fs.writeFile(folder+"/"+req.fields.name+"-"+req.fields.version+".jar", fs.readFileSync(req.files.file.path), (err) => {
            if(err){
                console.log(err);
            }
        })
        const pom = fs.readFileSync("./data/template/pom.xml").toString().replace("%p%", req.fields.package).replace("%n%", req.fields.name).replace("%v%", req.fields.version)
        fs.writeFile(folder+"/"+req.fields.name+"-"+req.fields.version+".pom", pom, (err) => {
            if(err){
                console.log(err);
            }
        });
        RepositoryManager.getRepo(req.fields.repository).addArtefact(req.fields.name, req.fields.version, req.fields.package);
        RepositoryManager.getRepo(req.fields.repository).save()
    }
    res.redirect("./")
})

router.get("/admin/repo", (req, res) => {
    res.render("admin_repocreate", UserManager.getUserFromToken(req.cookies["token"]).toJson())
})

router.post("/admin/add_repo", (req, res) => {
    if(req.fields.name) RepositoryManager.createRepo(req.fields.name, req.fields.onlyadmin == "on");
    res.redirect("/")
})

router.get("/admin/delete_repo/:repo", (req, res) => {
    RepositoryManager.removeRepo(req.params.repo)
    res.redirect("/")
})

router.get("/admin/users", (req, res) => {
    var json = {
        "user" : UserManager.getUserFromToken(req.cookies["token"]).toJson(),
        "users" : {}
    }
    for(var user of UserManager.getUsers().values()){
        json["users"][user.getUserName()] = user.toJson();
    }
    res.render("admin_user", json)
})

router.post("/admin/add_user", (req, res) => {
    if(req.fields.username && req.fields.password) UserManager.createUser(req.fields.username, req.fields.password, req.fields.isadmin == "on");
    res.redirect("/admin/users")
})

router.get("/admin/delete_user/:user", (req, res) => {
    UserManager.removeUser(req.params.user);
    res.redirect("/admin/users")
})

module.exports = router;