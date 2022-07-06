const seed = require("../db/seeds/seed.js");
const { categoryData, commentData, reviewData, userData } = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../index.js");


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
        const review_1 = {
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: "2021-01-18T10:00:20.514Z",
            votes: 1,
            comment_count: 0,
        };
        return request(app)
            .get("/api/reviews/1")
            .expect(200)
            .then(({ body }) => {
                const { review } = body;
                expect(review).toEqual(expect.objectContaining(testReview));
                expect(review).toEqual(review_1);
            });
    });

    test("Test that comment_count works when there are multiple comments", () => {
        return request(app)
          .get("/api/reviews/2")
          .expect(200)
          .then(({ body }) => {
            const { review } = body;
              expect(review.comment_count).toEqual(3);
          });
    })

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

describe("PATCH /api/reviews", () => {
    describe("happy path", () => {

        const returnObject = {
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 101,
        };

        test("Sending a request returns a valid response object and status 200", () => {
            return request(app)
                .patch("/api/reviews/1")
                .send({ inc_votes: 100 })
                .expect(200)
                .then(({ body }) => {
                    expect(body.review).toEqual(returnObject);
                });
        });

        test("Sending a request with extra properties does not break the request and they just get ignored", () => {
            return request(app)
                .patch("/api/reviews/1")
                .send({ inc_votes: 100, nonsense: "In this house?" })
                .expect(200)
                .then(({ body }) => {
                    expect(body.review).toEqual(returnObject);
                });
        });

        test("Sending a negative number will subtract votes", () => {
            return request(app)
                .patch("/api/reviews/1")
                .send({ inc_votes: -1 })
                .expect(200)
                .then(({ body }) => {
                    expect(body.review.votes).toEqual(0);
                })
        })
    });

    describe("Sad path :(", () => {
        test("Sending a patch request to an invalid review ID will get the appropriate error back", () => {
            return request(app)
                .patch("/api/reviews/9001")
                .send({ inc_votes: 10 })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Review ID provided is out of range.");
                });
        });

        test("Sending a patch request with no information will get the appropriate error back", () => {
            return request(app)
                .patch("/api/reviews/1")
                .send({})
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("No information given to update the selected review.");
                });
        });

        test("Sending a patch request with invalid info will result in the appropriate error being sent back", () => {
            return request(app)
                .patch("/api/reviews/1")
                .send({ inc_votes: "Numbers? In this economy?!" })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Added votes must be a number.");
                });
        });

        test("Sending a patch request with an invalid review ID format will result in an error being sent back", () => {
            return request(app)
                .patch("/api/reviews/invalid_format")
                .send({ inc_votes: 10 })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe("Incorrect format used for query.");
                });
        });
    });
});

describe("GET users", () => {
    const testUser = {
        username: expect.any(String),
        name: expect.any(String),
        avatar_url: expect.any(String),
    };

  test("Test that /api/users returns the correct type of object", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(expect.objectContaining(testUser));
        });
      });
  });
});

describe("GET all reviews", () => {
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
            comment_count: expect.any(Number),
        };

    test("Test that the endpoint returns an appropriate array of objects and a 200 status code", () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews).toHaveLength(13);
                reviews.forEach((review) => {
                    expect(review).toEqual(expect.objectContaining(testReview));
                });
            });
    });
    
    test("Ensure it's ordered by date in descending order", () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body }) => {
                const { reviews } = body;
                expect(reviews[0].review_id).toEqual(7);
            });
    });
});