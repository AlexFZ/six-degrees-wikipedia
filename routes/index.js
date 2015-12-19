var wiki = require('../wiki-api.js');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        'pathToAssets': '/bootstrap-3.3.1',
        'pathToSelectedTemplateWithinBootstrap' : '/bootstrap-3.3.1/docs/examples/starter-template'
    });
});

/* GET the titles of each article linked to in an article */
router.get('/getLinkTitlesInArticle', function(req, res) {
    var originArticle = encodeURIComponent(req.param('articleTitle'));
    wiki.getLinkTitles(originArticle, function(linkTitles) {
        res.send(linkTitles);
    });
});

module.exports = router;
