const request = require('request');
const config = require('config');
const helper = require('./helper.js');
const urls = require('./api-urls.json');

// Define the initial API
var partners = {};

partners.list = function (page, configId, cb) {
  var partnerId = config.get(configId + '.partnerId');
  var url = urls.api.partner.list.replace('{partner_id}', partnerId);
  
  // Page 1 is the default
  if (page == null) {
    page = 1;
  }
  
  var qs = {
    'page': page
  }
  helper.sendGetQSRequest(url, qs, configId, cb);
}

module.exports = partners;