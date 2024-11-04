const db = require("../db/connection");


const validSortColumns = ["created_at", "votes", "article_id", "title", "topic", "author"];
const validOrders = ["asc", "desc"];

const isValidTopicFormat = (topic) => {
    return isNaN(Number(topic));
};

exports.selectArticles = (sort_by = "created_at", order = "desc", topic, queryParams= {}) => {

    const allowedParams = ['sort_by', 'order', 'topic'];
    const unexpectedParams = Object.keys(queryParams).filter(param => !allowedParams.includes(param));
    if (unexpectedParams.length > 0) {
      return Promise.reject({ status: 400, message: 'Invalid query parameter' });
    }
  
    if (!validSortColumns.includes(sort_by)) {
      return Promise.reject({ status: 400, message: "Invalid sort_by query" });
    }
    if (!validOrders.includes(order.toLowerCase())) {
      return Promise.reject({ status: 400, message: "Invalid order query" });
    }
  
    let queryStr = `
      SELECT
        a.article_id,
        a.title,
        a.author,
        a.topic,
        a.created_at,
        a.votes,
        a.article_img_url,
        COUNT(c.comment_id)::INT AS comment_count
      FROM
        articles AS a
      LEFT JOIN
        comments AS c ON a.article_id = c.article_id
    `;
  
    const queryValues = [];
  
    if (topic) {
      if (!isValidTopicFormat(topic)) {
        return Promise.reject({ status: 400, message: "Invalid topic format" });
      }
      const topics = topic.split(',');
      queryStr += ` WHERE a.topic = ANY($1)`;
      queryValues.push(topics);
    }
  
    queryStr += `
      GROUP BY a.article_id
      ORDER BY ${sort_by === 'order' ? 'a.order' : sort_by} ${order}
    `;
  
    return db.query(queryStr, queryValues)
      .then((result) => {
        if (result.rows.length === 0 && topic) {
          return db.query('SELECT  topic FROM articles WHERE topic = ANY($1)', [topic.split(',')])
            .then((topicResult) => {
              if (topicResult.rows.length === 0) {
                return Promise.reject({ status: 404, message: "Topic not found" });
              }
              return [];
            });
        }
        return result.rows;
      });
  };
exports.selectArticleById = (articleId, queryParams = {}) => {
    return db
      .query(`
        SELECT 
          a.*,
          COUNT(c.comment_id)::INT AS comment_count
        FROM 
          articles a
        LEFT JOIN 
          comments c ON a.article_id = c.article_id
        WHERE 
          a.article_id = $1
        GROUP BY 
          a.article_id
      `, [articleId])
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
exports.getValidTopics = () => {
    return db.query('SELECT topic FROM articles')
      .then((result) => {
        return result.rows.map(row => row.topic);
      });
};