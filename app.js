const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/toodleDB");
const itemsSchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
    name: "Welcome to Toodle!"
});

const item2 = new Item ({
    name: "Hit the + button to add a new item."
});

const item3 = new Item ({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];


app.get("/", function (req, res) {
    const day = date.getDate();

    Item.find({}).then((items) => {
        if (items.length === 0) {
            Item.insertMany(defaultItems).then((status) => {
                console.log(status);
            });
            res.redirect("/");
        }
        else {
            res.render("list", {listTitle: day, items: items});
        }
    });
});

app.post("/", function (req, res) {
    const itemName = req.body.newItem;

    const item = new Item ({
        name: itemName
    });

    item.save();
    res.redirect("/");
});

app.get("/work", function (req, res) {
    res.render("list", {listTitle: "Work List", items: workItems});
});

app.post("/work", function (req, res) {
    workItems.push(req.body.newItem); 
    res.redirect("/work");
});


app.listen(3000, function () {
    console.log("server running on port 3000");
});
