const db = require("../db/connection.js");

exports.selectCategories = () => {
    return db
        .query(`SELECT * FROM categories;`)
        .then(({ rows }) => {
            // console.log(rows);
            return rows;
        })
}