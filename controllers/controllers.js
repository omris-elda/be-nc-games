const {
  selectCategories,
  fetchReviewByID,
  addReviewVotes,
  selectUsers,
  fetchReviews,
  fetchComments,
  addComment,
  removeComment,
} = require("../models/models.js");

exports.getCategories = (request, response, next) => {
  selectCategories()
    .then((categories) => {
      response.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewByID = (request, response, next) => {
  const review_id = request.params.review_id;

  fetchReviewByID(review_id)
    .then((review) => {
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
    response
      .status(400)
      .send({ msg: "No information given to update the selected review." });
  } else if (isNaN(newVote)) {
    response.status(400).send({ msg: "Added votes must be a number." });
  } else {
    addReviewVotes(review_id, newVote)
      .then((review) => {
        response.status(200).send({ review: review });
      })
      .catch((err) => {
        next(err);
      });
  }
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
  let sortBy = request.query.sort_by;
  let orderBy = request.query.order;
  let category = request.query.category;

  if (orderBy !== undefined) {
    orderBy = orderBy.toUpperCase();
  }

  fetchReviews(sortBy, orderBy, category)
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch((err) => {
      console.log(err);
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

  addComment(review_id, newComment)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (request, response, next) => {
  const comment_id = request.params.comment_id;

  removeComment(comment_id)
    .then(() => {
      response.status(204);
    })
    .catch((err) => {
      next(err);
    });
};
