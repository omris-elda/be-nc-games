const seed = require("../db/seeds/seed.js");
const { categoryData, commentData, reviewData, userData } = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../index.js");
const { forEach } = require("../db/data/test-data/categories.js");


beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));

afterAll(() => db.end());

describe("404 endpoint", () => {
    test("If invalid url is sent, output 404 status code and a message", () => {
        return request(app)
            .get("/api/invalid_url")
            .expect(404)
            .then(({ body: { msg } }) => {
                expect(msg).toBe("Invalid Path");
            });
    });
});

describe("GET Categories", () => {
    const testCategory = {
        slug: expect.any(String),
        description: expect.any(String)
    }
    
    test("Test that /api/categories returns the correct type of object", () => {
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({ body }) => {
                const { categories } = body;
                expect(categories).toHaveLength(4);
                categories.forEach(category => {
                    expect(category).toEqual(expect.objectContaining(testCategory));
                });
            });
    });
});

describe("GET reviews by ID", () => {
    const testReview = {
      review_id: expect.any(Number),
      title: expect.any(String),
      category: expect.any(String),
      designer: expect.any(String),
      owner: expect.any(String),
      review_body: expect.any(String),
      review_img_url: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
    };
    test("Test that /api/reviews/ returns 200 and the correct review in the appropriate format when given a valid review ID", () => {
        return request(app)
            .get("/api/reviews/1")
            .expect(200)
            .then(({ body }) => {
                const { review } = body;
                expect(review).toEqual(expect.arrayContaining([expect.objectContaining(testReview)]));
                expect(review).toHaveLength(1);
                expect(review[0].review_id).toEqual(1);
            });
    });

    test("Test that api/reviews/ returns 400 and a message when given an out of range ID", () => {
        return request(app)
            .get("/api/reviews/9001")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Review ID provided is out of range.");
            });
    });

    test("Test that api/reviews/ returns 400 and a message when given an invalid ID", () => {
      return request(app)
        .get("/api/reviews/tomato")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Incorrect format used for query.");
        });
    });
});