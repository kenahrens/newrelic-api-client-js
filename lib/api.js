const request = require('request');
const config = require('../config');
const helper = require('./helper.js');
const urls = require('./api-urls.json');

// Define the initial API
var api = {};
api.apps = {};
api.appHosts = {};
api.appInstances = {};
api.mobile = {};
api.browser = {};
api.keyTransactions = {};
api.servers = {};
api.usages = {};
api.users = {};
api.plugins = {};
api.pluginComponents = {};

// Applications
api.apps.list = function (cb) {
  helper.sendGetRequest(urls.api.apps.list, cb);
}

api.apps.show = function (appId, cb) {
  var url = urls.api.apps.show.replace('{application_id}', appId);
  helper.sendGetRequest(url, cb);
}

api.apps.metricNames = function(appId, cb) {
  var url = urls.api.apps.metricNames.replace('{application_id}', appId);
  helper.sendGetRequest(url, cb);
}

api.appHosts.list = function (appId, cb) {
  var url = urls.api.appHosts.list.replace('{application_id}', appId);
  helper.sendGetRequest(url, cb);
}

api.appInstances.list = function(appId, cb) {
  var url = urls.api.appInstances.list.replace('{application_id}', appId);
  helper.sendGetRequest(url, cb);
}

api.mobile.list = function(cb) {
  helper.sendGetRequest(urls.api.mobile.list, cb);
}

api.browser.list = function(cb) {
  helper.sendGetRequest(urls.api.browser.list, cb);
}

api.keyTransactions.list = function(cb) {
  helper.sendGetRequest(urls.api.keyTransactions.list, cb);
}

api.servers.list = function(cb) {
  helper.sendGetRequest(urls.api.servers.list, cb);
}

api.usages.list = function(product, cb) {
  var d = new Date();
  var url = urls.api.usages.list.replace('{product}', product);
  var options = {
    'method': 'GET',
    'uri': url,
    'headers': {'X-Api-Key': config.REST_API_KEY},
    'qs': {
      'start_date': d.toISOString(),
      'end_date': d.toISOString()
    },
    'json': true
  };

  // Call the API
  request(options, cb);
}

api.users.list = function(cb) {
  helper.sendGetRequest(urls.api.users.list, cb);
}

api.plugins.list = function(cb) {
  helper.sendGetRequest(urls.api.plugins.list, cb);
}

api.pluginComponents.list = function(pluginId, cb) {
  var url = urls.api.pluginComponents.list.replace('{component_id}', pluginId);
  helper.sendGetRequest(url, cb);
}

module.exports = api;
