const db = require("../db/connection.js");

exports.selectCategories = () => {
    return db
        .query(`SELECT * FROM categories;`)
        .then(({ rows }) => {
            // console.log(rows);
            return rows;
        });
};

exports.fetchReviewByID = (review_id) => {
    return db
        .query(`SELECT * FROM reviews WHERE reviews.review_id = $1;`, [review_id])
        .then(({ rows }) => {
            return rows;
        });
};