const request = require('request');
const config = require('../config');
const helper = require('./helper.js');
const urls = require('./urls.json');

// Define the initial API
var api = {};
api.apps = {};
api.appHosts = {};
api.appInstances = {};
api.mobile = {};
api.browser = {};
api.keyTransactions = {};
api.usages = {};
api.servers = {};

// Applications
api.apps.list = function (cb) {
  helper.sendGetRequest(urls.api.apps.list, cb);
}

api.apps.show = function (appId, cb) {
  var url = urls.api.apps.show.replace('{application_id}', appId);
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

api.usages.list = function(cb) {
  helper.sendGetRequest(urls.api.usages.list, cb);
}

api.servers.list = function (cb) {
  helper.sendGetRequest(urls.api.servers.list, cb);
}


module.exports = api;
