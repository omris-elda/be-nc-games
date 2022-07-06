const {
  selectCategories,
  fetchReviewByID,
  addReviewVotes,
  selectUsers,
  fetchReviews,
  fetchComments,
  addComment,
} = require("../models/models.js");

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
    if (newVote === undefined) {
        response.status(400).send({ msg: "No information given to update the selected review." });
    } else if (isNaN(newVote)) {
        response.status(400).send({ msg: "Added votes must be a number." });
    } else {
        addReviewVotes(review_id, newVote).then(review => {
            response.status(200).send({ review: review });
        }).catch((err) => {
            next(err);
        });
    };
};

exports.getUsers = (request, response, next) => {
    selectUsers()
        .then((users) => {
            response.status(200).send({ users });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getReviews = (request, response, next) => {
    fetchReviews()
        .then((reviews) => {
            response.status(200).send({ reviews });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getComments = (request, response, next) => {
    const review_id = request.params.review_id;
    fetchComments(review_id)
        .then((comments) => {
            response.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        });
};

exports.postComment = (request, response, next) => {
    const review_id = request.params.review_id;
    let newComment = request.body;

    if (newComment.username === undefined) {
        response
          .status(400)
          .send({ msg: "Please provide a username." });
    } else if (newComment.body === undefined) {
        response
          .status(400)
          .send({ msg: "Please provide a body." });
    } else {    
        addComment(review_id, newComment)
            .then(( comment ) => {
                response.status(201).send({ comment });
            })
            .catch((err) => {
                next(err);
            });
    };
};