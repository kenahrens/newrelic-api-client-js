const request = require('request');
const config = require('config');

var uri = 'https://insights-api.newrelic.com/v1/accounts/' +
  config.get('newrelic.accountId') + '/query';

// Define the initial API
var insights = {};
insights.query = function applicationList(nrql, cb) {
  var options = {
    'method': 'GET',
    'uri': uri,
    'headers': {'X-Query-Key': config.get('newrelic.insightsQueryKey')},
    'json': true,
    'qs': {
      'nrql': nrql
    }
  };

  // Call the API
  request(options, cb);
}

module.exports = insights;
