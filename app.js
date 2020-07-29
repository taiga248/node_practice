const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blogs");

const app = express();
const port = 3000;

// Connect to MongoDB
const dbURI =
  "mongodb+srv://energytaiga:energytaiga@energy.kihhb.gcp.mongodb.net/node_practice?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, { useNewUrlParser: true, userUnifieldTopology: true })
  .then(() => app.listen(port))
  .catch(err => console.log(err));

// ejsを登録
app.set("view engine", "ejs");

// ミドルウェア と　静的ファイル
app.use(express.static("public"));
app.use(morgan("dev"));

// MongoDB, サンドボックス
app.get("/add-blog", (req, res) => {
  // MongoDBに保存されるやつ
  const blog = new Blog({
    title: "new blog 2",
    snippet: "about my new blog",
    body: "more about new blog"
  });
  blog
    .save()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

// Find doc
app.get("/all-blogs", (req, res) => {
  Blog.find()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/single-blog", (req, res) => {
  Blog.findById("5f21b234d0f377640eae6654")
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

// ルーティング
app.get("/", (req, res) => {
  res.redirect("/blogs");
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/blogs", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then(result => {
      res.render("index", { title: "All Blogs", blogs: result });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a new blog" });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Not Found" });
});
