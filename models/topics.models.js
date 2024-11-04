const db = require ("../db/connection")

exports.selectTopics = (queryParams = {}, params = {}) => {
    return db.query(`SELECT slug, description FROM topics;`)
      .then(({rows}) => {
        return rows;
      })
  };