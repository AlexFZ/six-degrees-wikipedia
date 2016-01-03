var linksContainer = $('.links-container'),
    header = $('.header'),
    breadcrumb = $('.breadcrumb'),
    articleInput = $('.article-input'),
    containerHeight = $(window).height();

var getArticleTitleFromInput = function() {
    return articleInput.val().trim();
}

var displayLinks = function(links, originatingArticleTitle) {
    // create a new panel for this level
    var newLevelNumber = linksContainer.children().size() + 1,
        levelClassName = 'level-' + newLevelNumber;

    var newLevelPanel = $('<div/>', {
        'class': 'panel panel-default'
    }).append($('<div/>', {
        'class': 'panel-heading level-heading',
        text: newLevelNumber + '. ' + originatingArticleTitle
    }));

    // store the links in a new list group inside the panel
    var newLevelLinksList = $('<ul/>', {
        'class': 'link-list list-group ' + levelClassName
    }).css({
        'height': containerHeight + 'px',
        'overflow-y': 'scroll',
        'overflow-x': 'hidden'
    }).appendTo(newLevelPanel);

    // add links to the new panel
    links = links.sort();
    for (var i=0; i<links.length; i++) {
        var articleTitle = links[i];
        var newLink = $('<li>', {
            'class': 'article-link list-group-item',
            'data-level': newLevelNumber,
            text: articleTitle,
            click: function() {
                // set this link to active and de-activate all other links in the panel
                $('.'+levelClassName+' li').removeClass('active');
                $(this).addClass('active');

                // delete any existing level panels that come after this link's level
                var linkLevel = $(this).attr('data-level')-1;
                $('.level-column:gt(' + linkLevel + ')').remove();
                $('li:gt(' + linkLevel + ')', breadcrumb).remove();

                // get the next level of links
                getLinks($(this).text());
            }
        }).appendTo(newLevelLinksList);
    }

    // add the created panel to a column in the DOM
    $('<div/>', {
        'class': 'col-sm-2 level-column',
        'data-level': newLevelNumber
    }).append($(newLevelPanel)).appendTo(linksContainer);
}

var getLinks = function(articleTitle) {
    $.ajax({
        type: "POST",
        url: '/getLinkTitlesInArticle',
        data: {'articleTitle': articleTitle},
    })
    .done(function(articleLinks) {
        // add the new page to the breadcrumb nav
        $('<a>', {
            text: articleTitle
        }).appendTo($('<li>', {
            'class': 'active'
        }).appendTo(breadcrumb));

        displayLinks(articleLinks, articleTitle);
    })
    .fail(function() {
        console.log("error");
    });
}

$(document).ready(function() {
    var containerHeight = $(window).height() - header.height();

    // get them initial links
    $('.submit-btn').click(function() {
        getLinks(getArticleTitleFromInput());
    });

    // keep the heights of the link lists up to date with resizes
    $(window).resize(function () {
        containerHeight = $(window).height() - header.height();
        $('.link-list').css({
            'height': containerHeight + 'px',
            'overflow-y': 'scroll',
            'overflow-x': 'hidden'
        });
    });

});

