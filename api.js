var request = require('request');

// Read the config file
var config = require('./config.json');

// Define the initial API
var api = {};
api.applicationList = function applicationList(cb) {
  var options = {
    'method': 'GET',
    'uri': 'https://api.newrelic.com/v2/applications.json',
    'headers': {'X-Api-Key': config.REST_API_KEY},
    'json': true
  };

  // Call the API
  request(options, cb);
}

module.exports = api;
