const express = require('express')
const router = express.Router()
const UserManager = require("../users/UserManager")
const crypto = require("crypto");

router.route("/login")
    .get((req,res) => {
        if(req.cookies["token"] != null){
            if(UserManager.verifyCookie(req.cookies["token"])){
                res.redirect("/")
            }else{
                res.render("login");
            }
        }else{
            res.render("login");
        }
    })

router.route("/login")
    .post((req,res) => {
        if(req.fields.username != null && req.fields.password != null){
            if(UserManager.isExist(req.fields.username)){
                const user = UserManager.getUser(req.fields.username);
                if(user.getHashedPassword() == crypto.createHash("md5").update(req.fields.password).digest("hex")){
                    res.cookie("token", user.toJsonWebToken())
                    res.redirect("/")
                }else{
                    res.redirect("/login")
                }
            }else{
                res.redirect("/login")
            }
        }else{
            res.redirect("/login")
        }
    })

module.exports = router