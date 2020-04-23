const request = require("supertest")

const server = require("./server")
const db = require("../data/dbConfig")

describe("server", function () {
    describe("/", function () {
        it("should return 200 OK", function () {
            return request(server) // return the async call to let jest know it should wait
            .get('/')
            .then (res => {
                expect(res.status).toBe(200)
            })
        })
    })
    describe("/hobbits", function () {
        beforeEach(async () => {
            await db('hobbits').truncate()
        });

        it("should return 201 on success", function () {
            return request(server) // return the async call to let jest know it should wait
            .post('/hobbits')
            .send({name: "Garfield"})
            .then (res => {
                expect(res.status).toBe(201)
            })
        })
        it("should return message saying Hobbit created successfully", function () {
            return request(server) // return the async call to let jest know it should wait
            .post('/hobbits')
            .send({name: "Garfield"})
            .then (res => {
                expect(res.body.message).toBe("Hobbit")
            })
        })
        it("add hobbit to db", async function () {
            const hobbitName = "Garfield"
            const existing = await db("hobbits").where({name: hobbitName})
            expect(existing).toHaveLength(0)

            await request(server) // return the async call to let jest know it should wait
            .post('/hobbits')
            .send({name: hobbitName})
            .then (res => {
                expect(res.body.message).toBe("Hobbit")
            })
            const inserted = await db("hobbits").where({name: hobbitName})
            expect(inserted).toHaveLength(1)
        })
    })
})