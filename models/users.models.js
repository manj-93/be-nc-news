const db = require('../db/connection');

exports.fetchAllUsers = (queryParams = {}, params = {}) => {
  return db.query(
    'SELECT username, name, avatar_url FROM users'
  )
    .then((result) => result.rows);
};