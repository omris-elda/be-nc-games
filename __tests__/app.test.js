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
    test("Test that /api/reviews/ returns 200 and a correct object when given a valid review ID", () => {
        return request(app)
            .get("/api/reviews/1")
            .expect(200)
            .then(({ body }) => {
                const { review } = body;
                expect(review).toEqual(expect.objectContaining(testReview));
            });
    });
});