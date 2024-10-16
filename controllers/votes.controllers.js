const { updateArticleVotes } = require("../models/votes.models");

exports.patchArticleVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  if (isNaN(article_id)
) {
    return next({ status: 400, message: "Invalid article ID" });
  }

  if (typeof inc_votes !== 'number') {
    return next({ status: 400, message: "inc_votes must be a number" });
  }

  updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      if (!updatedArticle) {
        return next({ status: 404, message: "Article not found" });
      }
      response.status(200).json({ article: updatedArticle });
    })
    .catch(next);
};