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
            if (rows.length === 0) {
                return Promise.reject({
                    status: 400,
                    msg: "Review ID provided is out of range.",
                });
            };
            rows = rows[0];
            rows.comment_count = parseInt(rows.comment_count);
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

exports.fetchReviews = () => {
    return db
        .query(
            `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count 
                FROM reviews
                LEFT JOIN comments
                ON reviews.review_id = comments.review_id
                GROUP BY reviews.review_id
                ORDER BY reviews.created_at DESC;`
        )
        .then(({ rows }) => {
            rows.forEach(row => {
                row.comment_count = parseInt(row.comment_count);
            })
            return rows;
        });
};

exports.fetchComments = (review_id) => {


    return db
        .query(
            `SELECT * FROM reviews WHERE review_id = $1`,
            [review_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 400,
                    msg: "Review ID provided is out of range.",
                });
            }
        })
        .then(() => {
            return db
                .query(`SELECT * FROM comments WHERE review_id = $1;`, [review_id])
                .then(({ rows }) => {
                    return rows;
                });
        
        });
};

exports.addComment = (review_id, newComment) => {
    return db
        .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 400,
                    msg: "Review ID provided is out of range.",
                });
            };
        })
        .then(() => {
            return db.query(`SELECT * FROM users WHERE username = $1`, [newComment.username])
        })
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: 400,
                    msg: "Username provided does not exist.",
                });
            };
        })
        .then(() => {
            return db
                .query(`INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *;`, [newComment.username, newComment.body, review_id])
        })
        .then(({ rows }) => {
            return rows[0];
        });
};

