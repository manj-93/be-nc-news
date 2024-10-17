const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const endpoints = require("./endpoints.json");
const { getArticleById, getArticles } = require("./controllers/articles.controllers");
const { getComments, postComment, deleteComment } = require("./controllers/comments.controllers");
const { patchArticleVotes } = require("./controllers/votes.controllers");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getComments);
app.post('/api/articles/:article_id/comments', postComment);
app.patch('/api/articles/:article_id', patchArticleVotes);
app.delete('/api/comments/:comment_id', deleteComment)

app.all("*", (req, res) => {
  res.status(404).send({ message: "URL NOT FOUND" });
});

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ message: "Invalid ID" });
  } else if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    console.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = app;