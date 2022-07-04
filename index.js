const express = require("express");

const { getCategories } = require("./controllers/controllers.js");

const app = express();
app.use(express.json());

app.get("/api/categories", getCategories);




app.use("*", (req, res) => {
    res.status(404).send({ msg: "Invalid Path" });
});

// error handling
app.use((err, req, res, next) => {
    if (typeof err === "string") {
        res.status(400).send({ msg: err });
    } else {
        next(err);
    };
});

app.use((err, req, res, next) => {
    console.log(err, "<---- unhandled error");
    res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;