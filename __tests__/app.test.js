const request = require("supertest")
const app = require("../app.js")
const db = require ("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data")
const endpoints = require ("../endpoints.json")

beforeEach(()=>{
    return seed(data)
})

afterAll(()=>{
    db.end()
})


describe("/api/topics", () => {
    test("200: responds with an array of topic objects", () => {
        return request(app)
        .get ("/api/topics")
        .expect(200)
        .then(({body:{topics}}) => {
            if(topics.length === 0){
                return;
            }
            topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String),
                })
            })
        })   
    });
    test("404: responds with an error message when a request is made to a path that doesn't exist", ()=>{
        return request(app)
        .get("/api/tipics")
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe("URL NOT FOUND")
        })

    });
});

describe("/api", ()=>{
    test("GET: 200 - responds with an object detailing all available endpoints", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body })=>{
            expect(body.endpoints).toEqual(endpoints)
        })
    });
    test("GET: 404 - responds with and error message when a non-existent endpoint is requested", ()=>{
        return request(app)
        .get("/api/tipics")
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe("URL NOT FOUND")
        });
    });
});

describe("/api/articles/:article_id", () => {
    test("GET: 200 - responds with the correct article object for a valid id", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: 1,
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                });
            });
    });
    test("GET: 404 - responds with an error message for an id that does not exist", ()=>{
        return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(({ body })=>{
            expect(body.message).toBe("Article not found")
        })
    });
    test("GET: 400 - responds with an error message for an invalid ID", ()=>{
        return request(app)
        .get("/api/articles/invalid")
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe("Invalid ID")

        })
    })
});