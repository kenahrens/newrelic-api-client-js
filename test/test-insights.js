var api = require('../lib/api.js');
var insights = require('../lib/insights.js');
var synthetics = require('../lib/synthetics.js');

var assert = require('assert');

var quickAssert = function(error, response) {
  assert.equal(error, null);
  assert.equal(response.statusCode, 200);
}

describe('New Relic Insights API Test', function() {
  this.timeout(5000);
  
  it('calls the query api', function(done) {
    var nrql = 'SELECT count(*) FROM Transaction';
    insights.query(nrql, function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });
});
