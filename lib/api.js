const request = require('request');
const config = require('../config');

// Define the initial API
var api = {};

// Applications List
api.applicationsList = function applicationsList(cb) {
  var options = {
    'method': 'GET',
    'uri': 'https://api.newrelic.com/v2/applications.json',
    'headers': {'X-Api-Key': config.REST_API_KEY},
    'json': true
  };

  // Call the API
  request(options, cb);
}

// Servers List
api.serversList = function serversList(cb) {
  var options = {
    'method': 'GET',
    'uri': 'https://api.newrelic.com/v2/servers.json',
    'headers': {'X-Api-Key': config.REST_API_KEY},
    'json': true
  };

  // Call the API
  request(options, cb);
}

// TODO: Users List

module.exports = api;
