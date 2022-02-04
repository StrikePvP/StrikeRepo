const express = require('express');
const router = express.Router()
const UserManager = require("../users/UserManager")

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
    
})



module.exports = router