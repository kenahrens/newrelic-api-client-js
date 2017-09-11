const request = require('request');
const helper = require('./helper.js');
const urls = require('./api-urls.json');

// Define the initial API
var dashboards = {};

dashboards.list = function(configId, page, cb) {
  var url = urls.api.dashboards.list;
  var qs = {
    'page': page
  }
  helper.sendGetQSKeyRequest(url, qs, configId, 'adminKey', cb);
}

module.exports = dashboards;