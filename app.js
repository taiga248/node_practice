const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const blogRoutes = require("./routes/blogRoutes");
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

// blogsのルーティング
app.use("/blogs", blogRoutes);

app.use((req, res) => {
  res.status(404).render("404", { title: "Not Found" });
});
