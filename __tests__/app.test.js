const request = require("supertest")
const app = require("../app.js")
const db = require ("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const data = require("../db/data/test-data")

beforeEach(()=>{
    return seed(data)
})

afterAll(()=>{
    db.end()
})

describe("all bad URLs",()=>{
    describe("/api/topics",()=>{
        test("404 URL NOT FOUND", () => {
        return request(app)
        .get("/api/tipics")
        .expect(404)
        .then(({ body }) => {
        expect(body.msg).toBe("URL NOT FOUND")
        }) 
     })
    })
})

describe('/api/topics', () => {
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

})
