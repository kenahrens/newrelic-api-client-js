const request = require('request');
const config = require('config');
const helper = require('./helper.js');
const urls = require('./api-urls.json');

// Define the initial api
var synthetics = {};

synthetics.getAllMonitors = function getAllMonitors(configId, cb) {
  var url = urls.synthetics.monitors.createRead;
  helper.sendGetKeyRequest(url, configId, 'adminKey', cb);
}

synthetics.getMonitor = function getMonitor(monitorId, configId, cb) {
  var url = urls.synthetics.monitors.monitor.replace('{monitor_id}', monitorId);
  helper.sendGetKeyRequest(url, configId, 'adminKey', cb);
}

synthetics.getLocations = function getLocations(configId, cb) {
  var url = urls.synthetics.locations.list;
  helper.sendGetKeyRequest(url, configId, 'adminKey', cb);
}

// Create Monitor requires a JSON body with this data:
// https://docs.newrelic.com/docs/apis/synthetics-rest-api/monitor-examples/manage-synthetics-monitors-rest-api
// { "name": string [required],
// "type": string (SIMPLE, BROWSER, SCRIPT_API, SCRIPT_BROWSER) [required],
// "frequency": integer (minutes) [required, must be one of 1, 5, 10, 15, 30, 60, 360, 720, or 1440],
// "uri": string [required for SIMPLE and BROWSER type],
// "locations": array of strings [at least one required],
// "status": string (ENABLED, MUTED, DISABLED) [required],
// "slaThreshold": double,
// "options": {
//   "validationString": string [only valid for SIMPLE and BROWSER types],
//   "verifySSL": boolean (true, false) [only valid for SIMPLE and BROWSER types],
//   "bypassHEADRequest": boolean (true, false) [only valid for SIMPLE types],
//   "treatRedirectAsFailure": boolean (true, false) [only valid for SIMPLE types]
//   }
// }
synthetics.createMonitor = function createMonitor(monitorBody, configId, cb) {
  var url = urls.synthetics.monitors.createRead;
  
  // uri, method, body, configId, keyType, cb
  helper.sendPutOrPostBody(url, 'POST', monitorBody, configId, 'adminKey', cb);
}

synthetics.deleteMonitor = function deleteMonitor(monitorId, configId, cb) {
  var url = urls.synthetics.monitors.monitor.replace('{monitor_id}', monitorId);
  helper.sendDelete(url, configId, 'adminKey', cb);
}

module.exports = synthetics;