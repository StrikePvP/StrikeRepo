const express = require('express')
const router = express.Router()
const UserManager = require("../users/UserManager")

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

module.exports = router;