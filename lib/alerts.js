const request = require('request');
const helper = require('./helper.js');
const urls = require('./api-urls.json');

// Define the initial API
var alerts = {};
alerts.events = {};
// alerts.conditions = {};
// alerts.pluginConditions = {};
// alerts.externalServiceConditions = {};
// alerts.syntheticsConditions = {};
// alerts.nrqlConditions = {};
alerts.policies = {};
alerts.channels = {};
alerts.policyChannels = {};
// alerts.violations = {};
alerts.incidents = {};
// alerts.entityConditions = {};

// TODO - Add the filters
alerts.events.list = function(configId, cb) {
  var url = urls.api.alertsEvents.list;
  helper.sendGetRequest(url, configId, cb);
}

// Note: This covers APM, Browser and Mobile
// alerts.conditions.list = function(policyId, configId, cb) {
//   var url = urls.api.alertsConditions.list;
//   var qs = { 'policy_id': policyId }
//   helper.sendGetQSRequest(url, qs, configId, cb);
// }

alerts.policies.list = function(name, configId, cb) {
  var url = urls.api.alertsPolicies.createRead;
  if (name != null) {
    var qs = { 'filter[name]': name };
    helper.sendGetQSRequest(url, qs, configId, cb);
  } else {
    helper.sendGetRequest(url, configId, cb);
  }
}

alerts.channels.list = function(configId, cb) {
  var url = urls.api.alertsChannels.createRead;
  helper.sendGetRequest(url, configId, cb);
}

alerts.policyChannels.update = function(policyId, channelIds, configId, cb) {
  var url = urls.api.alertsPolicyChannels.updateDelete;
  var qs = {
    'policy_id': policyId,
    'channel_ids': channelIds
  }
  helper.sendPutOrPostQS(url, 'PUT', qs, configId, 'adminKey', cb);
}

alerts.incidents.list = function(onlyOpen, pageId, configId, cb) {
  var url = urls.api.alertsIncidents.list;
  var qs = {
    'only_open': onlyOpen,
    'page': pageId
  }
  // Call sendGetQSKeyRequest and request only this pageId (not all pages)
  helper.sendGetQSKeyRequest(url, qs, configId, 'restKey', false, cb);
}

module.exports = alerts;