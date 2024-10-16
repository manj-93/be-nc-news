const db = require("../db/connection");

exports.selectArticleComments = (article_id) => {
    return db
      .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
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
          [article_id]
        );
      })
      .then((result) => result.rows);
  };
  exports.insertArticleComment = (article_id, username, body) => {
    return db
      .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
      .then((articleResult) => {
        if (articleResult.rows.length === 0) {
          return Promise.reject({ status: 404, msg: 'Article not found' });
        }
        return db.query(
          `INSERT INTO comments (article_id, author, body) 
           VALUES ($1, $2, $3) 
           RETURNING comment_id, votes, created_at, author, body, article_id`,
          [article_id, username, body]
        );
      })
      .then((result) => result.rows[0]);
  };