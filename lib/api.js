const request = require('request');
const config = require('../config');
const helper = require('./helper.js');

// Define the initial API
var api = {};
api.applications = {};
api.servers = {};

// Setup the URLs
api.applications.urls = {
  'all': 'https://api.newrelic.com/v2/applications.json',
  'one': 'https://api.newrelic.com/v2/applications/{id}.json',
  'metricNames': 'https://api.newrelic.com/v2/applications/{id}/metrics.json',
  'metricData': 'https://api.newrelic.com/v2/applications/{id}/metrics/data.json'
}

api.servers.urls = {
  'all': 'https://api.newrelic.com/v2/servers.json',
  'one': 'https://api.newrelic.com/v2/servers/{id}.json',
  'metricNames': 'https://api.newrelic.com/v2/servers/{id}/metrics.json',
  'metricData': 'https://api.newrelic.com/v2/servers/{id}/metrics/data.json'
}

// Applications List
api.applications.list = function applicationsList(cb) {
  helper.sendGetRequest(api.applications.urls.all, cb);
}

// Servers List
api.servers.list = function serversList(cb) {
  helper.sendGetRequest(api.servers.urls.all, cb);
}

// TODO: Users List

module.exports = api;
