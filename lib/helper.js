const request = require('request');
const config = require('config');

var helper = {};

// Generic helper to process request() callback
helper.handleCB = function (error, response, body) {
  if (!error && response.statusCode === 200) {
    return body;
  } else {
    console.log('API Error!');
    if (error) {
      throw(error);
    } else {
      console.error(body);
    }
  }
}

helper.sendGetQSRequest = function (uri, qs, configId, cb) {
  var restKey = config.get(configId + '.restKey');

  var options = {
    'method': 'GET',
    'uri': uri,
    'headers': {'X-Api-Key': restKey},
    'qs': qs,
    'json': true
  };

  // Call the API
  request(options, cb);
}

helper.sendGetRequest = function (uri, configId, cb) {
  helper.sendGetQSRequest(uri, null, configId, cb);
}

module.exports = helper;
