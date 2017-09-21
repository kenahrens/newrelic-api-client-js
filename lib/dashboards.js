const request = require('request');
const helper = require('./helper.js');
const urls = require('./api-urls.json');

// Define the initial API
var dashboards = {};

// Get a particular page from the dashboard list
dashboards.getPage = function(pageId, configId, cb) {
  var url = urls.api.dashboards.all;
  var qs = { 'page': pageId }
  helper.sendGetQSKeyRequest(url, qs, configId, 'adminKey', cb);
}

// Get a single dashboard
dashboards.getOne = function(dashboardId, configId, cb) {
  var url = urls.api.dashboards.one.replace('{dashboard_id}', dashboardId);
  helper.sendGetKeyRequest(url, configId, 'adminKey', cb);
}

dashboards.create = function(dashboardBody, configId, cb) {
  var url = urls.api.dashboards.all;
  helper.sendPutOrPost(url, 'POST', dashboardBody, configId, 'adminKey', cb);
}

dashboards.update = function(dashboardId, dashboardBody, configId, cb) {
  var url = urls.api.dashboards.one.replace('{dashboard_id}', dashboardId);
  helper.sendPutOrPost(url, 'PUT', dashboardBody, configId, 'adminKey', cb);
}

dashboards.delete = function(dashboardId, configId, cb) {
  var url = urls.api.dashboards.one.replace('{dashboard_id}', dashboardId);
  helper.sendDelete(url, configId, 'adminKey', cb);
}

module.exports = dashboards;