const { selectArticleById } = require("../models/articles.models");

exports.getArticleById = (request, response, next) => {
    const { article_id } = request.params;

    if (isNaN(article_id)) {
        return response.status(400).send({ message: "Invalid ID" });
    }

    const id = +article_id;

    selectArticleById(id)
        .then((article) => {
            response.status(200).send({ article });
        })
        .catch((err) => {
            if (err.status) {
                response.status(err.status).send({ message: err.message });
            } else {
                next(err); 
            }
        });
};