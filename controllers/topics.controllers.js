const { selectTopics } = require("../models/topics.models");
exports.getTopics = (req, res, next) => {
  selectTopics(req.query, req.params)  
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};