const request = require('request');
const config = require('../config');

var uri = 'https://insights-api.newrelic.com/v1/accounts/' +
  config.ACCOUNT_ID + '/query';

// Define the initial API
var insights = {};
insights.query = function applicationList(nrql, cb) {
  var options = {
    'method': 'GET',
    'uri': uri,
    'headers': {'X-Query-Key': config.INSIGHTS_QUERY_KEY},
    'json': true,
    'qs': {
      'nrql': nrql
    }
  };

  // Call the API
  request(options, cb);
}

module.exports = insights;
