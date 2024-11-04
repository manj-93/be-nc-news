const { fetchAllUsers } = require('../models/users.models');
exports.getAllUsers = (req, res, next) => {
  fetchAllUsers(req.query, req.params) 
    .then((users) => {
      res.status(200).send({ users })
    })
    .catch(next);
};