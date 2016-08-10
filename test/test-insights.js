const insights = require('../lib/insights.js');
const config = require('config');
const assert = require('assert');

var quickAssert = function(error, response) {
  assert.equal(error, null);
  assert.equal(response.statusCode, 200);
}

// Global variables
var configId = config.get('configArr')[0];

describe('New Relic Insights API Test', function() {
  this.timeout(5000);
  
  it('calls the query api', function(done) {
    var nrql = 'SELECT count(*) FROM Transaction';
    insights.query(nrql, configId, function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });
});
