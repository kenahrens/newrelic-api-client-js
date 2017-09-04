const request = require('request');
const helper = require('./helper.js');
const urls = require('./api-urls.json');

// Define the initial API
var api = {};
api.apps = {};
api.appHosts = {};
api.appInstances = {};
api.appDeployments = {};
api.mobile = {};
api.browser = {};
api.keyTransactions = {};
api.servers = {};
api.usages = {};
api.users = {};
api.plugins = {};
api.pluginComponents = {};
api.partner = {};

// Partners
api.partner.list = function (partnerId, configId, cb) {
  var url = urls.api.partner.list.replace('{partner_id}',partnerId);
  helper.sendGetRequest(url, configId, cb);
}

// Applications
api.apps.list = function (configId, cb) {
  helper.sendGetRequest(urls.api.apps.list, configId, cb);
}

api.apps.show = function (appId, configId, cb) {
  var url = urls.api.apps.show.replace('{application_id}', appId);
  helper.sendGetRequest(url, configId, cb);
}

api.apps.metricNames = function(appId, configId, cb) {
  var url = urls.api.apps.metricNames.replace('{application_id}', appId);
  helper.sendGetRequest(url, configId, cb);
}

api.apps.metricData = function(appId, names, configId, cb) {
  var url = urls.api.apps.metricData.replace('{application_id}', appId);
  var qs = {
    'names': names
  }
  helper.sendGetQSRequest(url, qs, configId, cb);
}

api.appHosts.list = function (appId, configId, cb) {
  var url = urls.api.appHosts.list.replace('{application_id}', appId);
  helper.sendGetRequest(url, configId, cb);
}

api.appInstances.list = function(appId, configId, cb) {
  var url = urls.api.appInstances.list.replace('{application_id}', appId);
  helper.sendGetRequest(url, configId, cb);
}

api.appDeployments.list = function(appId, configId, cb) {
  var url = urls.api.appDeployments.list.replace('{application_id}', appId);
  helper.sendGetRequest(url, configId, cb);
}

api.mobile.list = function(configId, cb) {
  helper.sendGetRequest(urls.api.mobile.list, configId, cb);
}

api.browser.list = function(configId, cb) {
  helper.sendGetRequest(urls.api.browser.list, configId, cb);
}

api.keyTransactions.list = function(configId, cb) {
  helper.sendGetRequest(urls.api.keyTransactions.list, configId, cb);
}

api.servers.list = function(qs, configId, cb) {
  //helper.sendGetRequest(urls.api.servers.list, configId, cb);
  helper.sendGetQSRequest(urls.api.servers.list, qs, configId, cb);
}

api.usages.list = function(product, configId, cb) {
  var url = urls.api.usages.list.replace('{product}', product);
  var d = new Date();
  var qs = {
    'start_date': d.toISOString(),
    'end_date': d.toISOString()
  }
  helper.sendGetQSRequest(url, qs, configId, cb);
}

api.users.list = function(qs, configId, cb) {
  helper.sendGetQSRequest(urls.api.users.list, qs, configId, cb);
}

api.plugins.list = function(configId, cb) {
  helper.sendGetRequest(urls.api.plugins.list, configId, cb);
}

api.plugins.listFilterGuid = function(guid, configId, cb) {
  var url = urls.api.plugins.list;
  var qs = {
    'filter[guid]': guid
  }
  helper.sendGetQSRequest(url, qs, configId, cb);
}

api.plugins.listFilterIds = function(ids, configId, cb) {
  var url = urls.api.plugins.list;
  var qs = {
    'filter[ids]': ids
  }
  helper.sendGetQSRequest(url, qs, configId, cb);
}

api.plugins.show = function (pluginId, configId, cb) {
  var url = urls.api.plugins.show.replace('{id}', pluginId);
  helper.sendGetRequest(url, configId, cb);
}

api.pluginComponents.list = function(configId, cb) {
  var url = urls.api.pluginComponents.list;
  helper.sendGetRequest(url, configId, cb);
}

api.pluginComponents.listFilterPluginId = function(pluginId, configId, cb) {
  var url = urls.api.pluginComponents.list;
  var qs = {
    'filter[plugin_id]': pluginId
  }
  helper.sendGetQSRequest(url, qs, configId, cb);
}

api.pluginComponents.show = function (componentId, configId, cb) {
  var url = urls.api.pluginComponents.show.replace('{component_id}', componentId);
  helper.sendGetRequest(url, configId, cb);
}

api.pluginComponents.metricNames = function(componentId, configId, cb) {
  var url = urls.api.pluginComponents.metricNames.replace('{component_id}', componentId);
  helper.sendGetRequest(url, configId, cb);
}

api.pluginComponents.metricData = function(componentId, names, configId, cb) {
  var url = urls.api.pluginComponents.metricData.replace('{component_id}', componentId);
  var qs = {
    'names': names
  }
  helper.sendGetQSRequest(url, qs, configId, cb);
}

module.exports = api;
