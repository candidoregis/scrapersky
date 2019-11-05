let axios = require("axios");
let cheerio = require("cheerio");
let db = require("../models");

module.exports = function (app) {

  // ARTICLES REQUEST ROUTES

  // GET route that scrape the tWSJ site and returns all the articles
  app.get("/api/scrape", function (req, res) {
    axios.get("https://wsj.com").then(function (response) {

      // Loading Cheerio to scrape the content
      var $ = cheerio.load(response.data);

      $("article").each(function (i, element) {

        var articleData = {};
        articleData.title = $(this).find("div").children("h3").children("a").text();
        articleData.url = $(this).find("div").children("h3").children("a").attr("href");

        // Trying to fix the summary when the original has comments on it
        articleData.summary = $(this).children("p").text();

        // Create the scrapped article in db
        db.Article.create(articleData).then(function () { }).catch(function () { });

      });
      res.send("Done!");
    });
  });

  // POST request to save an article
  app.post("/api/articles", function (req, res) {
    db.Article.findByIdAndUpdate(req.body.id, { saved: true }, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.send("Article Saved!");
      }
    });
  });

  // DELETE request to remove one specific article
  app.delete("/api/articles", function (req, res) {
    db.Article.findById(req.body.id, function (err, article) {
      db.Comment.deleteMany({
        _id: {
          $in: article.comments
        }
      }, function (err) {
        if (err) {
          console.log(err);
        } else {
          article.remove();
          res.send("Article removed!");
        }
      });
    });
  });

  // DELETE request to remove all articles
  app.delete("/api/articles/all", function (req, res) {
    db.Article.deleteMany({}, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        db.Comment.deleteMany({}, function (err) {
          if (err) {
            console.log(err);
          } else {
            res.send("All Articles Deleted");
          }
        });
      }
    });
  });


  // COMMENTS REQUEST ROUTES

  // Create a new comment and associate it to Article
  app.post("/api/comment/:articleId", function (req, res) {
    db.Comment.create(req.body)
      .then(function (dbComment) {
        return db.Article.findOneAndUpdate(
          { _id: req.params.articleId },
          {
            $push: {
              comments: dbComment._id
            }
          },
          { new: true });
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        console.log(err);
        res.json(err);
      });
  });

  // DELETE request to remove one specific comment 
  app.delete("/api/comment/:id/:articleId", function (req, res) {
    
    // To be done

  });

};