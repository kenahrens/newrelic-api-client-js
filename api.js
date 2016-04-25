const request = require('request');
const config = require('./config');

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
