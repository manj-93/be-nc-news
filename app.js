const express = require ("express")
const app = express()
const { getTopics } = require("./controllers/topics.controllers")
 

app.use(express.json())


app.get("/api/topics", getTopics)


app.all("*", (request, response) => {
    response.status(404).send({msg: "URL NOT FOUND"})
});

module.exports = app;