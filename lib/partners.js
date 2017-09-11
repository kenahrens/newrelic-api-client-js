const request = require('request');
const config = require('config');
const helper = require('./helper.js');
const urls = require('./api-urls.json');

// Define the initial API
var partners = {};

partners.list = function (configId, cb) {
  var partnerId = config.get(configId + '.partnerId');
  var url = urls.api.partner.list.replace('{partner_id}', partnerId);
  helper.sendGetRequest(url, configId, cb);
}

module.exports = partners;