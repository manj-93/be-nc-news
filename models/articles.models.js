const db = require("../db/connection");

exports.selectArticles = (sort_by = "created_at", order = "desc") => {
    const validColumns = ["article_id", "title", "author", "topic", "created_at", "votes"];
    const validOrders = ["asc", "desc"];

    if (!validColumns.includes(sort_by)) {
        return Promise.reject({ status: 400, message: "Invalid sort_by query" });
    }

    if (!validOrders.includes(order)) {
        return Promise.reject({ status: 400, message: "Invalid order query" });
    }

    const queryStr = `
        SELECT a.article_id, a.title, a.author, a.topic, a.created_at, a.votes, a.article_img_url,
               COUNT(c.comment_id) AS comment_count
        FROM articles AS a
        LEFT JOIN comments AS c ON a.article_id = c.article_id
        GROUP BY a.article_id
        ORDER BY ${sort_by} ${order};`;

    return db.query(queryStr).then((result) => {
        return result.rows;
    });
};

exports.selectArticleById = (articleId) => {
    return db
      .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject({
            status: 404,
            message: "Article not found"
          });
        }
        return result.rows[0];
      });
};
  
  exports.selectArticleComments = (articleId) => {
    return db
      .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
      .then((articleResult) => {
        if (articleResult.rows.length === 0) {
          return Promise.reject({
            status: 404,
            message: "Article not found"
          });
        }
        return db.query(
          `SELECT comment_id, votes, created_at, author, body, article_id
           FROM comments
           WHERE article_id = $1
           ORDER BY created_at DESC`,
          [articleId]
        );
      })
      .then((result) => result.rows);
};