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

describe('/api/topics', () => {
    test('GET: 200 - responds with an array of topic objects', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                expect(body.topics).toBeInstanceOf(Array);
                body.topics.forEach(topic => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String),
                        })
                    );
                });
            });
    });

})
