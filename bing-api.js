var request = require('request'),
    btoa = require('btoa');

var authKey = btoa(':xTAx6ssD6RHz76ZT9CQsSjSN+QBrnvT2DfVaXPE0224='),
    serviceUrl = 'https://api.datamarket.azure.com/Bing/Search/Image';

var searchOptions = {
  '$format' : 'json',
  '$top' : '1',
  'Adult' : 'off',
  'ImageFilters' : 'Size:Small+Aspect:Square'
};

var buildSearchUrl = function(searchTerm) {
  // put single quotes around the term, assume it is already encoded
  var queryParam = "?Query=%27" + searchTerm + "%27";
  
  // add single quotes around each search option and encode the option values
  for (var paramName in searchOptions) {
    // params that begin with $ should not be touched
    var paramValue = searchOptions[paramName];
    if (paramName.indexOf("$") != 0) {
      paramValue = "%27" + encodeURIComponent(paramValue) + "%27";
    }
    queryParam += "&" + paramName + "=" + paramValue;
  }

  var result = serviceUrl + queryParam;
  return result;
}

var searchImage = function(searchTerm, callback) {
  var options = {
    url: buildSearchUrl(searchTerm),
    headers: {
      'Authorization': 'Basic ' + authKey
    }
  };

  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("done");
      console.log(body);
      callback(body);
    } else {
      console.log("errorrrrr: "+error);
      console.log(response);
      callback("error");
    }
  });
}

module.exports.searchImage = searchImage;