const request = require("supertest")
const app = require("../app.js")
const db = require ("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data")
const endpoints = require ("../endpoints.json")
require('jest-sorted');

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
    test("GET: 404 - responds with an error message for an id that is valid but does not exist in our database", ()=>{
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

describe("/api/articles", () => {
    test("GET: 200 - responds with an array of articles without body property", () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
            expect(articles).toBeInstanceOf(Array);
            expect(articles).toHaveLength(13);
                articles.forEach((article) => {
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number),
                    });
                });
            }
        );
    });
    test("GET: 200 - responds with an object of article information", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
                    expect(article).toMatchObject({               
                    author: "butter_bridge",
                    title: "Living in the shadow of a great man",
                    article_id: 1,
                    topic: "mitch",
                    created_at: expect.any(String),
                    votes: 100,
                    article_img_url:"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
                });         
        });
    });
    test("GET: 200 - articles are ordered by created_at in descending order", ()=>{
        return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy("created_at", { descending: true})
        })
    });
    test("GET: 400 - returns an error when given a non-valid sort_by", ()=>{
        return request(app)
        .get("/api/articles?sort_by=invalid_column")
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe("Invalid sort_by query")

        })
    });
    test("GET: 400 - responds with an error when passed an article_id that is of an invalid data type", ()=>{
        return request(app)
        .get("/api/articles/invalid")
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe("Invalid ID")

        })
    });
    test("GET: 404 - responds with an error when passed an article_id that is valid but not present in our database", ()=>{
        return request(app)
        .get("/api/articles?article_id=9999")
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe("Article not found")

        })
    });
});

describe("GET /api/articles/:article_id/comments", () => {
    test("GET: 200 - responds with an array of comments for the given article_id", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments).toBeInstanceOf(Array);
                expect(comments).toHaveLength(11);
                comments.forEach(comment => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: 1
                    });
                });
            });
    });

    test("GET: 400 - responds with an error for an invalid article_id", () => {
        return request(app)
            .get("/api/articles/invalid_id/")
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ message: "Invalid ID" });
            });
    });
    test("GET: 200 - responds with an empty array if no comments exist for an article_id", () => {
        return request(app)
            .get("/api/articles/2/comments") 
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments).toEqual([]); 
            });
    });

    test("GET: 200 - comments are sorted by most recent first", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments).toBeSortedBy("created_at", { descending: true });
            });
    });
    test("GET: 404 - responds with an error when trying to get comments for a non-existent article_id", () => {
        return request(app)
            .get("/api/articles/9999/comments")
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe("Article not found");
            });
    });
});

