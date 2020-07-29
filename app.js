const express = require("express");
const morgan = require("morgan");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.listen(port);

app.use(express.static("public"));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  const blogs = [
    {
      title: "Title 1",
      snippet: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    },
    {
      title: "Title 2",
      snippet: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    },
    {
      title: "Title 3",
      snippet: "Lorem ipsum dolor sit amet consectetur adipisicing elit."
    }
  ];
  res.render("index", { title: "Home", blogs });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a new blog" });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Not Found" });
});
