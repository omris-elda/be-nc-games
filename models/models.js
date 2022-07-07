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

exports.fetchReviews = (sortBy = "date", orderBy = "DESC", category) => {

    if (!["ASC", "DESC"].includes(orderBy)) {
        return Promise.reject({ status: 400, msg: "Invalid order query." });
    };

    const validSortBy = ["review_id", "title", "category", "designer", "owner", "reivew_body", "review_img_url", "date", "votes"]

    if (!validSortBy.includes(sortBy)) {
        return Promise.reject({ status: 400, msg: "Invalid sort query." });
    } else if (sortBy === "date") {
        sortBy = "created_at";
    };

    let queryStr = `SELECT reviews.*, COUNT(comments.comment_id) AS comment_count 
                FROM reviews
                LEFT JOIN comments
                ON reviews.review_id = comments.review_id`;

    
    let categories = [];
    let queryValues = [];
    
    return db.query(`SELECT * FROM categories`)
        .then(({ rows }) => {
            rows.forEach((row) => {
                categories.push(row.slug);
            });
            if (category !== undefined && categories.includes(category)) {
                queryStr += ` WHERE reviews.category = $1`;
                queryValues.push(category);
            } else if (category !== undefined && !categories.includes(category)) {
                return Promise.reject({ status: 404, msg: "The provided category doesn't exist." });
            };
            
            queryStr += ` GROUP BY reviews.review_id 
                ORDER BY reviews.${sortBy} ${orderBy};`;
        })
        
        .then(() => {
        
            return db
                .query(
                    queryStr, queryValues
                )
                .then(({ rows }) => {
                    rows.forEach((row) => {
                        row.comment_count = parseInt(row.comment_count);
                    });
                    return rows;
                });
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
    
    if (newComment.username === undefined) {
        return Promise.reject({
            status: 400,
            msg: "Please provide a username."
        });
    } else if (newComment.body === undefined) {
        return Promise.reject({
            status: 400,
            msg: "Please provide a body."
        });
    } else {
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
                        status: 404,
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
};

exports.removeComment = (comment_id) => {
    
}