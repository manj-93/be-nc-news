const db = require("../db/connection");

exports.selectArticleComments = (articleId, queryParams = {}) => {
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
  
exports.insertArticleComment = (articleId, username, body, queryParams = {}, params = {}) => {
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
          `INSERT INTO comments (article_id, author, body) 
           VALUES ($1, $2, $3) 
           RETURNING comment_id, votes, created_at, author, body, article_id`,
          [articleId, username, body]
        );
      })
      .then((result) => result.rows[0]);
  };


exports.deleteCommentById = (commentId, queryParams = {}, params = {}) => {
    return db.query(
      'DELETE FROM comments WHERE comment_id = $1 RETURNING *',
      [commentId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, message: 'Comment not found' });
      }
      return result.rows[0];
    });
  };

  
  