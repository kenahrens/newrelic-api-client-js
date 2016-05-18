const request = require('request');
const config = require('../config.js');

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
      throw(new Error(body));
    }
  }
}

helper.sendGetRequest = function (uri, cb) {
  var options = {
    'method': 'GET',
    'uri': uri,
    'headers': {'X-Api-Key': config.REST_API_KEY},
    'json': true
  };

  // Call the API
  request(options, cb);
}

module.exports = helper;