const express = require("express");
const app = express();
const UserManager = require("./users/UserManager");
var cookieParser = require('cookie-parser')
const fs = require("fs")
const bodyParser = require("body-parser");

console.log("Loading users...")
UserManager.loadUsers();

console.log("Loading repositories...")

console.log("Loading Website...");

app.set('views', './templates');
app.set('view engine', 'pug');

app.use(express.static('files'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));


const files = fs.readdirSync("./pages/").filter(file => file.endsWith('.js'));
for(const file of files){
    const route = require("./pages/"+file);
    app.use("/", route)
}

app.listen(9087, () => {
    console.log("Website is loaded !")
})