let db = require("../models");

module.exports = function (app) {
  // GET route for the home page 
  app.get("/", function (req, res) {
    db.Article.find({ saved: false })
      .populate("comments")
      .then(function (articles) {
        res.render("index", { articles: articles });
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // GET route for the saved articles page 
  app.get("/saved", function (req, res) {
    db.Article.find({ saved: true })
      .populate("comments")
      .then(function (articles) {
        res.render("saved",{articles: articles});
      })
      .catch(function(err) {
        res.json(err);
      });
  });

};