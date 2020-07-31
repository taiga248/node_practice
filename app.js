const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Blog = require("./models/blogs");
const dbURI = require("./dbURI");

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose
  .connect(dbURI, { useNewUrlParser: true })
  .then(() => app.listen(port))
  .catch(err => console.log(err));

// ejsを登録
app.set("view engine", "ejs");

// ミドルウェア と　静的ファイル
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

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

app.post("/blogs", (req, res) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then(result => {
      res.redirect("/blogs");
    })
    .catch(err => {
      console.log(err);
    });
});

// 詳細表示、削除の実装より下にに書いちゃだめ 遷移しなくなる
app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a new blog" });
});

app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => {
      res.render("details", { blog: result, title: "Blog details" });
    })
    .catch(err => {
      console.log(err);
    });
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: "/blogs" });
    })
    .catch(err => console.log(err));
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Not Found" });
});
