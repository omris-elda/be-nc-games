const express = require("express");

const { getCategories } = require("./controllers/controllers.js");

const app = express();
app.use(express.json());

// app.get("/api/categories", getCategories);




app.use("*", (req, res) => {
    res.status(404).send({ msg: "Invalid Path" });
});


module.exports = app;