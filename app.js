require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const mongoose = require("mongoose");
const Item = require("./models/items");
const mongodbUser = encodeURIComponent(process.env.MONGODB_USER);
const mongodbPass = encodeURIComponent(process.env.MONGODB_PASS);
const mongodbUrl = process.env.MONGODB_URL;

const mongodb =
  "mongodb+srv://" +
  mongodbUser +
  ":" +
  mongodbPass +
  "@" +
  mongodbUrl +
  "/?retryWrites=true&w=majority";

mongoose
  .connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port);
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: " + err);
  });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Get Main Page
app.get("/", (req, res) => {
  res.redirect("/get-items");
});

// Get Items Overview Page
app.get("/get-items", (req, res) => {
  Item.find().then((result) => {
    res.render("index", { items: result });
  });
});

// Get Items Page
app.get("/add-item", (req, res) => {
  res.render("add-item");
});

// Post Items Page -> Redirect to Items Overview
app.post("/items", (req, res) => {
  const item = Item(req.body);
  item
    .save()
    .then(() => {
      res.redirect("/get-items");
    })
    .catch((err) => {
      console.log(err);
    });
});

// Get specific Item Page
app.get("/items/:id", (req, res) => {
  const id = req.params.id;
  Item.findById(id)
    .then((result) => {
      res.render("item-detail", { item: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Delete Item -> Redirect to Items Overview
app.delete("/items/:id", (req, res) => {
  const id = req.params.id;
  Item.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/get-items" });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Put Item (Update) -> Redirect to Items Overview
app.put("/items/:id", (req, res) => {
  const id = req.params.id;
  Item.findByIdAndUpdate(id, req.body)
    .then((result) => {
      res.json({ msg: "Updated Successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Fallback: Error Page
app.use((req, res) => {
  res.render("error");
});
