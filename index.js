const express = require("express");

const {
  getCategories,
  getReviewByID,
} = require("./controllers/controllers.js");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewByID);



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