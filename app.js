const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const endpoints = require("./endpoints.json");
const { getArticleById, getArticles} = require("./controllers/articles.controllers");

app.use(express.json());

app.get("/api", (request, response) => {
    response.status(200).send({ endpoints: endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleById);

app.post('/api/articles/:article_id/comments', postComment);

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ message: err.message });
    } else {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


app.all("*", (request, response) => {
    response.status(404).send({ message: "URL NOT FOUND" });
});


module.exports = app;