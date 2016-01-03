var wiki = require('../wiki-api.js');
var bing = require('../bing-api.js');
var express = require('express');
var router = express.Router();

router.get('/bing', function(req, res) {
  res.render('bing');
});

/* POST Gets the top image result from Bing */
router.post('/findimage', function(req, res) {
  var searchTerm = encodeURIComponent(req.body.searchTerm);
  bing.searchImage(searchTerm, function(resp) {
    res.send(resp);
  })
})

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        'pathToAssets': '/bootstrap-3.3.1',
        'pathToSelectedTemplateWithinBootstrap' : '/bootstrap-3.3.1/docs/examples/starter-template'
    });
});

/* POST Gets the titles of each article linked to in an article */
router.post('/getLinkTitlesInArticle', function(req, res) {
    var originArticle = encodeURIComponent(req.body.articleTitle);
    wiki.getLinkTitles(originArticle, function(linkTitles) {
        res.send(linkTitles);
    });
});

module.exports = router;
