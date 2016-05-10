const request = require('request');
const config = require('../config');

// Define the initial api
var synthetics = {};

synthetics.getAllMonitors = function getAllMonitors(cb) {
  var options = {
    'method': 'GET',
    'uri': 'https://synthetics.newrelic.com/synthetics/api/v1/monitors',
    'headers': {'X-Api-Key': config.ADMIN_API_KEY},
    'json': true
  };

  // Call the API
  request(options, cb);
}

module.exports = synthetics;
