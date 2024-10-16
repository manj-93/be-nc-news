const { selectArticleById, selectArticles } = require("../models/articles.models");
const { selectArticleComments } = require("../models/comments.models");


exports.getArticleById = (request, response, next) => {
    const { article_id } = request.params;
    if (isNaN(article_id)) {
      return next({ status: 400, message: "Invalid ID" });
    }
    selectArticleById(article_id)
      .then((article) => {
        if (!article) {
          return next({ status: 404, message: "Article not found" });
        }
        response.status(200).send({ article });
      })
      .catch(next);
  };


exports.getArticles = (request, response, next) => {
    const { sort_by, order, article_id } = request.query;

    if (article_id) {

        return selectArticleById(article_id)
            .then((article) => {
                return selectCommentsByArticleId(article_id) 
                    .then(comments => {
                        response.status(200).send({ article, comments }); 
                    });
            })
            .catch(next)
    }

    const validSortColumns = ['created_at', 'votes', 'article_id'];
    const validOrders = ['asc', 'desc'];

    if (sort_by && !validSortColumns.includes(sort_by)) {
        return next({ status: 400, message: 'Invalid sort_by query' });
    }

    if (order && !validOrders.includes(order)) {
        return next({ status: 400, message: 'Invalid order query' });
    }

    selectArticles(sort_by || "created_at", order || "desc")
        .then(articles => {
            const articlePromises = articles.map(article => {
                return selectArticleComments(article.article_id)
                    .then(comments => {
                        return { ...article, comment_count: comments.length }; 
                    });
            });
            return Promise.all(articlePromises);
        })
        .then(articlesWithCounts => {
            response.status(200).send({ articles: articlesWithCounts });
        })
        .catch(next);
};

exports.getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;

    if (isNaN(article_id) || !Number.isInteger(Number(article_id))) {
        return next({ status: 400, message: "Invalid ID" });
    }

    const articlePromise = selectArticleById(article_id);
    const commentsPromise = selectArticleComments(article_id);

    Promise.all([articlePromise, commentsPromise])
        .then(([article, comments]) => {
            if (!article) {
                return next({ status: 404, message: 'Article not found' });
            }
            response.status(200).send({ comments });
        })
        .catch(next);
};
