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

const defaultItems = [];


const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});
const List = mongoose.model("List", listSchema);


app.get("/", function (req, res) {
    Item.find({}).then((items) => {
        if (items.length === 0) {
            Item.insertMany(defaultItems).then((status) => {
                console.log(status);
            });
            res.redirect("/");
        }
        else {
            res.render("list", {listTitle: "Today", items: items});
        }
    });
});


app.get("/:listName", function (req, res) {
    const listName = req.params.listName;

    List.findOne({name: listName}).then((foundList) => {
        if (foundList) {
            res.render("list", {listTitle: listName, items: foundList.items});
        }
        else {
            const list = new List ({
                name: listName,
                items: defaultItems
            });

            list.save();

            setTimeout(function () {
                res.redirect("/" + listName);
            }, 1000);
        }
    });
});


app.post("/", function (req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item ({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    }
    else {
        List.findOne({name: listName}).then((foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});


app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId).then((status) => {
            console.log(status);
        });
        res.redirect("/");
    }
    else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}).then(() => {
            res.redirect("/" + listName);
        });
    }
});


app.listen(3000, function () {
    console.log("server running on port 3000");
});
