const { selectCategories, fetchReviewByID } = require("../models/models.js");

exports.getCategories = (request, response, next) => {
    selectCategories().then(categories => {
        response.status(200).send({ categories });
    })
        .catch((err) => {
            next(err);
        });
}

exports.getReviewByID = (request, response, next) => {
    const review_id = request.params.review_id;

    fetchReviewByID(review_id).then(review => {
        response.status(200).send({ review });
    })
        .catch((err) => {
            next(err);
        });
};