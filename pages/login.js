const express = require('express')
const router = express.Router()
const UserManager = require("../users/UserManager")
const crypto = require("crypto");

router.route("/login")
    .get((req,res) => {
        res.render("login")
    })

router.route("/login")
    .post((req,res) => {
        if(req.body.username != null && req.body.password != null){
            if(UserManager.isExist(req.body.username)){
                const user = UserManager.getUser(req.body.username);
                if(user.getHashedPassword() == )
            }
        }else{
            res.redirect("/login")
        }
    })

module.exports = router