const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/article.js");
const articleRouter = require("./routes/articles");
const methodOverride = require("method-override");

//MiddleWare
const app = express();
const port = process.env.PORT || 9000;
app.use(express.json());

mongoose.connect("mongodb://localhost/myblog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.connection.once("open", () => {
  console.log("DB CONNECTED");
});
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

//Routes Rendering EJS
app.get("/", async (req, res) => {
  const articles = await Article.find().sort({
    date: "desc",
  });
  res.render("articles/index", {
    articles: articles,
  });
});
app.use("/articles", articleRouter);

app.listen(port, () => console.log("Listen on ", port));
