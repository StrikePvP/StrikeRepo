const express = require("express");
const app = express();
const UserManager = require("./users/UserManager");
var cookieParser = require('cookie-parser')

console.log("Loading users...")
UserManager.loadUsers();

console.log("Loading repositories...")

console.log("Loading Website...");

app.set('views', './templates');
app.set('view engine', 'pug');

app.use(express.static('files'));
app.use(cookieParser())

app.listen(9087, () => {
    console.log("Website is loaded !")
})