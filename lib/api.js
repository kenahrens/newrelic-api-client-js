const request = require('request');
const config = require('../config');
const helper = require('./helper.js');

// Define the initial API
var api = {};
api.applications = {};
api.mobile = {};
api.servers = {};

// Nomenclature used:
// list - get all
// show - get one
// metricNames, metricData - only for one asset like {application_id}
api.applications.urls = {
  'list': 'https://api.newrelic.com/v2/applications.json',
  'show': 'https://api.newrelic.com/v2/applications/{application_id}.json',
  'metricNames': 'https://api.newrelic.com/v2/applications/{application_id}/metrics.json',
  'metricData': 'https://api.newrelic.com/v2/applications/{application_id}/metrics/data.json',
  'hosts': {
    'list': 'https://api.newrelic.com/v2/applications/{application_id}/hosts.json',
    'show': 'https://api.newrelic.com/v2/applications/{application_id}/hosts/{id}.json',
    'metricNames': 'https://api.newrelic.com/v2/applications/{application_id}/hosts/{host_id}/metrics.json',
    'metricData': 'https://api.newrelic.com/v2/applications/{application_id}/hosts/{host_id}/metrics/data.json'
  }
}

api.servers.urls = {
  'list': 'https://api.newrelic.com/v2/servers.json',
  'show': 'https://api.newrelic.com/v2/servers/{application_id}.json',
  'metricNames': 'https://api.newrelic.com/v2/servers/{application_id}/metrics.json',
  'metricData': 'https://api.newrelic.com/v2/servers/{application_id}/metrics/data.json'
}

// Applications List
api.applications.list = function applicationsList(cb) {
  helper.sendGetRequest(api.applications.urls.list, cb);
}

// Servers List
api.servers.list = function serversList(cb) {
  helper.sendGetRequest(api.servers.urls.list, cb);
}

// TODO: Users List

module.exports = api;
