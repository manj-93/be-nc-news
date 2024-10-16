const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const { getArticleById, getArticles } = require("./controllers/articles.controllers");
const { getComments, postComment } = require("./controllers/comments.controllers");

app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getComments);


app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    err.status = 400;
    err.message = "Invalid ID";
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


module.exports = app;