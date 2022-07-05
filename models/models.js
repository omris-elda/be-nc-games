const db = require("../db/connection.js");
const reviews = require("../db/data/test-data/reviews.js");

exports.selectCategories = () => {
    return db
        .query(`SELECT * FROM categories;`)
        .then(({ rows }) => {
            return rows;
        });
};

exports.fetchReviewByID = (review_id) => {
            return db
              .query(
                `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count 
                FROM reviews
                LEFT JOIN comments
                ON reviews.review_id = comments.review_id
                WHERE reviews.review_id = $1
                GROUP BY reviews.review_id;`,
                [review_id]
              )
              .then(({ rows }) => {
                console.log(rows);
                if (rows.length === 0) {
                  return Promise.reject({
                    status: 400,
                    msg: "Review ID provided is out of range.",
                  });
                  }
                  rows = rows[0];
                return rows;
              });
};

exports.addReviewVotes = (review_id, newVote) => {
    return db
        .query(`SELECT votes FROM reviews WHERE reviews.review_id = $1;`, [
            review_id
        ])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 400,
                    msg: "Review ID provided is out of range.",
                });
            } else if (rows[0].votes + newVote < 0) {
                return Promise.reject({
                    status: 400,
                    msg: "Votes cannot go below zero!",
                });
            } else {
                let numberOfVotes = rows[0].votes;
                numberOfVotes += newVote;
                return db.query(
                    `UPDATE reviews SET votes = $2 WHERE review_id = $1 RETURNING *`,
                    [review_id, numberOfVotes]
                )
                    .then(({ rows }) => {
                        return rows[0];
                    });
            };
        });
};

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users;`).then(({ rows }) => {
        return rows;
    });
};