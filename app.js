const express = require ("express")
const app = express()
const { getTopics } = require("./controllers/topics.controllers")
const endpoints = require ("./endpoints.json")
 

app.use(express.json())


app.get("/api/topics", getTopics)

app.get("/api", (request, response) => {
    response.status(200).send({endpoints: endpoints})
})


app.all("*", (request, response, next) => {
    response.status(404).send({message: "URL NOT FOUND"})

});

module.exports = app;