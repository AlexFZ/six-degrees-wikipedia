var request = require('request');
var cheerio = require('cheerio');
var memoize = require('memoizee');

var PREFIX_BLACKLIST = [
    'Wikipedia:', 
    'Talk:',
    'Edit:',
    'Edit_section:',
    'Edit section:',
    'Help:', 
    'File:', 
    'Template_talk:', 
    'Template talk:',
    'Commons:',
    'Template:', 
    'Special:', 
    'wiktionary:',
    'Category:'];

var extractLinkTitlesFromArticleHtml = function(articleHtml) {
    var parsedHtml = cheerio.load(articleHtml),
        linkTitles = [],
        seenLinkUrls = new Set(),
        seenLinkTitles = new Set();

    var links = parsedHtml('a').each(function(i, tag) {
        // filter out external URLs, generic Wikipedia tools/help links, duplicates, and broken links
        var title = parsedHtml(this).attr('title'),
            url = parsedHtml(this).attr('href').toLowerCase(),
            doesExist = false,
            isBlacklisted = true,
            isInternal = url.startsWith('/'),
            isDuplicate = seenLinkUrls.has(url.toLowerCase()) || ( title && seenLinkTitles.has(title.toLowerCase()));

        if (title) {
            // a title is not guaranteed to be present for non-internal links
            isBlacklisted = PREFIX_BLACKLIST.reduce(
                (prev, curr) => 
                    prev || title.toLowerCase().indexOf(curr.toLowerCase()) > -1 
                        || url.indexOf(curr.toLowerCase()) > -1,
                false );
            doesExist = title.indexOf("(page does not exist)") == -1;
        }

        if (isInternal && !isBlacklisted && !isDuplicate && doesExist) {
            linkTitles.push(title);
            seenLinkUrls.add(url.toLowerCase());
            seenLinkTitles.add(title.toLowerCase());
        }
    });

    return linkTitles;
}

var extractRedirectArticleTitle = function(articleHtml) {
    var parsedHtml = cheerio.load(articleHtml),
        redirectTag = parsedHtml('ul.redirectText > li > a');
    return redirectTag.attr('title');
}

var getLinkTitles = function(originArticle, callback) {
    var apiUrl = "http://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles="+originArticle+"&rvprop=content&format=json&rvparse=1";
    request(apiUrl, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            // get the raw html of the latest article revision
            var pagesJson = JSON.parse(body)['query']['pages'];
            var articleHtml = null;
            for (page in pagesJson) {
                articleHtml = pagesJson[page]['revisions'][0]['*'];
                break;
            }

            // handle redirects
            if (articleHtml.startsWith('<div class=\"redirectMsg\">')) {
                getLinkTitles(extractRedirectArticleTitle(articleHtml), callback);
            } else {
                callback(extractLinkTitlesFromArticleHtml(articleHtml));
            }
        } else {
            console.log("errorrrrr: "+error);
            callback("error");
        }
    });
}

module.exports.getLinkTitles = getLinkTitles;