const express = require("express");

const {
  getCategories,
  getReviewByID,
  patchReviewVotes,
  getUsers,
  getReviews,
  getComments,
  postComment,
  deleteComment,
  getSiteMap,
} = require("./controllers/controllers.js");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewByID);

app.patch("/api/reviews/:review_id", patchReviewVotes);

app.get("/api/users", getUsers);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getComments);

app.post("/api/reviews/:review_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api", getSiteMap);

app.use("*", (req, res) => {
    res.status(404).send({ msg: "Invalid Path" });
});

// error handling
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    };
});

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Incorrect format used for query." })
    } else {
        next(err);
    };
});

app.use((err, req, res, next) => {
    console.log(err, "<---- unhandled error");
    res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;