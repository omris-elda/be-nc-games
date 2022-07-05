const { selectCategories, fetchReviewByID, addReviewVotes } = require("../models/models.js");

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
        response.status(200).send({ review: review });
    })
        .catch((err) => {
            next(err);
        });
};

exports.patchReviewVotes = (request, response, next) => {
    const review_id = request.params.review_id;
    const newVote = request.body.inc_votes;
    // console.log(newVote);
    if (newVote === undefined) {
        response.status(400).send({ msg: "No information given to update the selected review." });
    } else if (isNaN(newVote)) {
        response.status(400).send({ msg: "Added votes must be a number." });
    } else {
        addReviewVotes(review_id, newVote).then(review => {
            console.log({ review: review });
            response.status(200).send({ review: review });
        }).catch((err) => {
            next(err);
        });
    };

};