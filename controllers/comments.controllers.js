const { selectArticleComments, insertArticleComment, deleteCommentById } = require("../models/comments.models");

exports.getComments = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleComments(article_id, request.query)
    .then(comments => {
      response.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;
  
  if (!username || !body) {
    return next({ status: 400, message: "Missing required fields" });
  }
  
  insertArticleComment(article_id, username, body, request.query, request.params) 
    .then(comment => {
      response.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  
  if (isNaN(comment_id) || !Number.isInteger(Number(comment_id))) {
    return next({ status: 400, message: 'Invalid comment ID' });
  }
  
  deleteCommentById(comment_id, request.query, request.params)  
    .then(() => {
      response.status(204).send();
    })
    .catch(next);
};