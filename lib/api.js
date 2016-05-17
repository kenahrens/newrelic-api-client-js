const request = require('request');
const config = require('../config');

// Define the initial API
var api = {};
api.applications = {};
api.servers = {};

// Applications List
api.applications.list = function applicationsList(cb) {
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
api.servers.list = function serversList(cb) {
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
