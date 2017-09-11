const request = require('request');
const config = require('config');
const _ = require('lodash');
const assert = require('assert');

var helper = {};

// Generic helper to process request() callback
helper.handleCB = function (error, response, body) {
  if (!error && response.statusCode === 200) {
    return body;
  } else {
    console.error('API Error!');
    if (error) {
      throw(error);
    } else {
      console.error(body);
    }
  }
}

// Helper to check if multiple pages of data should be returned
// - One type of format is URI?page=#
// - For metric data the format is URI?cursor=#
helper.linkCheck = function (link) {
  if (link == null) {
    return null;
  }

  // There can be parameters for first, prev, next, and last
  // Note: if last ends with 0, then we need to return null
  var lastUri = null;
  var nextUri = null;

  // Split the link value
  var paramList = link.split(',');
  for (var i=0; i < paramList.length; i++) {
    
    // Split the parameter
    var param = paramList[i].split(';');

    // Look for next and last
    if (param[1].indexOf('last') > 0) {
      lastUri = param[0].replace('<', '').replace('>', '').trim();
    } else if (param[1].indexOf('next') > 0) {
      nextUri = param[0].replace('<', '').replace('>', '').trim();
    }
  }
  
  // If last points to "cursor=" (blank cursor) we should return null
  if (nextUri != null) {
    if (nextUri.indexOf('cursor=', nextUri.length - 'cursor='.length) !== -1) {
      return null;
    }
  }

  // If last points to page=0 then we should return null
  if (lastUri != null) {
    if (lastUri.indexOf('page=0', lastUri.length - 6) !== -1) {
      return null;
    }
  }
  return nextUri;
}

function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

// If the link does not have a cursor, merge the page number into the query string
helper.addPageToQS = function(qs, linkUri) {
  if (qs == null) {
    qs = {};
  }
  
  // Grab the part that says 'page=#' from the end of the URI
  var linkPage = linkUri.substring(linkUri.indexOf('page='));
  
  // This will just grab the part after the = sign
  qs.page = linkPage.substring(linkPage.indexOf('=')+1);
  return qs;
}

// uri - https uri
// qs - query string
// configId - which account to use from config json
// keyType - either restKey or adminKey
// cb - callback
// pagesData - storage for multiple pages
helper.sendGetQSKeyRequest = function (uri, qs, configId, keyType, cb, pagesData) {
  
  // This gets either the restKey or adminKey
  var localKey = config.get(configId + '.' + keyType);

  // Setup all the options
  var options = {
    'method': 'GET',
    'uri': uri,
    'headers': {'X-Api-Key': localKey},
    'qs': qs,
    'json': true
  };

  // Call the API, check for pagination
  // request(options, cb);
  request(options, function(error, response, body) {
    if (pagesData == null) {
      pagesData = body;
    } else {
      _.mergeWith(pagesData, body, customizer);
    }

    var nextUri = helper.linkCheck(response.headers.link);
    if (nextUri != null) {
      helper.sendGetQSKeyRequest(nextUri, qs, configId, keyType, cb, pagesData);
    } else {
      cb(error, response, pagesData);
    }
  });
}

// Call endpoint with query string (assumes restKey)
helper.sendGetQSRequest = function (uri, qs, configId, cb, pagesData) {
  helper.sendGetQSKeyRequest(uri, qs, configId, 'restKey', cb, pagesData);
}

// Simple version to use with null query string (assumes restKey)
helper.sendGetRequest = function (uri, configId, cb) {
  helper.sendGetQSRequest(uri, null, configId, cb);
}

module.exports = helper;
