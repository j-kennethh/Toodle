const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var items = ["Buy Food", "Cook Food", "Eat Food"];


app.get("/", function (req, res) {
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day = today.toLocaleDateString("en-GB", options);
    res.render("list", {day: day, items: items});
});

app.post("/", function (req, res) {
    items.push(req.body.newItem);
    res.redirect("/");
});


app.listen(3000, function () {
    console.log("server running on port 3000");
});