const { selectArticleById, selectArticles } = require("../models/articles.models");
const { selectCommentsByArticleId } = require("../models/comments.models"); 

exports.getArticleById = (request, response, next) => {
    const { article_id } = request.params;
    const id = +article_id;

    if (isNaN(article_id)) {
        return response.status(400).send({ message: "Invalid ID" });
    }

    selectArticleById(id)
        .then((article) => {
            return selectCommentsByArticleId(id) 
                .then(comments => {
                    const commentCount = comments.length;
                    response.status(200).send({ 
                        article: { ...article, comment_count: commentCount }
                    });
                });
        })
        .catch((err) => {
            if (err.status) {
                response.status(err.status).send({ message: err.message });
            } else {
                next(err);
            }
        });
};

exports.getArticles = (request, response, next) => {
    const { sort_by, order, article_id } = request.query;

    if (article_id) {
        const id = +article_id;

        return selectArticleById(id)
            .then((article) => {
                return selectCommentsByArticleId(id) 
                    .then(comments => {
                        response.status(200).send({ article, comments }); 
                    });
            })
            .catch((err) => {
                if (err.status) {
                    response.status(err.status).send({ message: err.message });
                } else {
                    next(err);
                }
            });
    }

    const validSortColumns = ['created_at', 'votes', 'article_id'];
    const validOrders = ['asc', 'desc'];

    if (sort_by && !validSortColumns.includes(sort_by)) {
        return response.status(400).send({ message: 'Invalid sort_by query' });
    }

    if (order && !validOrders.includes(order)) {
        return response.status(400).send({ message: 'Invalid order query' });
    }

    selectArticles(sort_by || "created_at", order || "desc")
        .then(articles => {
            const articlePromises = articles.map(article => {
                return selectCommentsByArticleId(article.article_id)
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
