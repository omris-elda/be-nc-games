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
            if (rows.length === 0) {
                return Promise.reject({
                    status: 400,
                    msg: "Review ID provided is out of range.",
                });
            };
            return rows[0];
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
                        // console.log(rows);
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