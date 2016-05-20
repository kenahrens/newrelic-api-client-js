const request = require('request');
const config = require('../config');
const helper = require('./helper.js');

// Define the initial API
var api = {};
api.applications = {};
api.mobile = {};
api.browser = {};
api.keyTransactions = {};
api.usages = {};
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
  },
  'instances': {
    'list': 'https://api.newrelic.com/v2/applications/{application_id}/instances.json',
    'show': 'https://api.newrelic.com/v2/applications/{application_id}/instances/{id}.json',
    'metricNames': 'https://api.newrelic.com/v2/applications/{application_id}/instances/{instance_id}/metrics.json',
    'metricData': 'https://api.newrelic.com/v2/applications/{application_id}/instances/{instance_id}/metrics/data.json'
  }
}

api.mobile.urls = {
  'list': 'https://api.newrelic.com/v2/mobile_applications.json',
  'show': 'https://api.newrelic.com/v2/mobile_applications/{id}.json',
  'metricNames': 'https://api.newrelic.com/v2/mobile_applications/{mobile_application_id}/metrics.json',
  'metricData': 'https://api.newrelic.com/v2/mobile_applications/{mobile_application_id}/metrics/data.json'
}

api.browser.urls = {
  'list': 'https://api.newrelic.com/v2/browser_applications.json',
  'create': 'https://api.newrelic.com/v2/browser_applications.json'
}

api.keyTransactions.urls = {
  'list': 'https://api.newrelic.com/v2/key_transactions.json',
  'show': 'https://api.newrelic.com/v2/key_transactions/{id}.json'
}

api.servers.urls = {
  'list': 'https://api.newrelic.com/v2/servers.json',
  'show': 'https://api.newrelic.com/v2/servers/{application_id}.json',
  'metricNames': 'https://api.newrelic.com/v2/servers/{application_id}/metrics.json',
  'metricData': 'https://api.newrelic.com/v2/servers/{application_id}/metrics/data.json'
}

api.usages.urls = {
  'list': 'https://api.newrelic.com/v2/usages/{product}.json'
}

// Applications
api.applications.list = function applicationsList(cb) {
  helper.sendGetRequest(api.applications.urls.list, cb);
}

api.applications.show = function applicationsGet(appId, cb) {
  var url = api.applications.urls.show.replace('{application_id}', appId);
  helper.sendGetRequest(url, cb);
}

// Servers List
api.servers.list = function serversList(cb) {
  helper.sendGetRequest(api.servers.urls.list, cb);
}

// TODO: Users List

module.exports = api;
