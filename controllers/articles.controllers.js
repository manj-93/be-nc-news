const { selectArticleById, selectArticles } = require("../models/articles.models");
const { selectArticleComments } = require("../models/comments.models");


  
exports.getArticleById = (request, response, next) => {
    const { article_id } = request.params;
  
    selectArticleById(article_id)
      .then((article) => {
        response.status(200).send({ article });
      })
      .catch(next);
  };

  exports.getArticles = (request, response, next) => {
    const { sort_by, order, topic } = request.query;
    selectArticles(sort_by, order, topic, request.query)
      .then(articles => {
        response.status(200).send({ articles });
      })
      .catch(next);
  };
  
exports.getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;
  
    const articlePromise = selectArticleById(article_id);
    const commentsPromise = selectArticleComments(article_id);
  
    Promise.all([articlePromise, commentsPromise])
    .then(([article, comments]) => {
      if (!article) {
        return Promise.reject({ status: 404, message: "Article not found" });
      }
      response.status(200).send({ comments });
    })
    .catch(next);
  };