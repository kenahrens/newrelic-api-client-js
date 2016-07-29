const request = require('request');
const config = require('config');

// Define the initial api
var synthetics = {};

synthetics.getAllMonitors = function getAllMonitors(configId, cb) {
  var adminKey = config.get(configId + '.adminKey');
  var options = {
    'method': 'GET',
    'uri': 'https://synthetics.newrelic.com/synthetics/api/v1/monitors',
    'headers': {'X-Api-Key': adminKey},
    'json': true
  };

  // Call the API
  request(options, cb);
}

synthetics.getMonitor = function getMonitor(id, configId, cb) {
  var adminKey = config.get(configId + '.adminKey');
  var options = {
    'method': 'GET',
    'uri': 'https://synthetics.newrelic.com/synthetics/api/v1/monitors/' + id,
    'headers': {'X-Api-Key': adminKey},
    'json': true
  }

  // Call the API
  request(options, cb);
}

module.exports = synthetics;
