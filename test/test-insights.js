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
  
  it('publishes some sample events', function(done) {
    var eventArr = [];
    eventArr.push({
      "eventType":"ZInsertTest",
      "account":3,
      "amount":259.54
    });
    eventArr.push({
      "eventType":"ZInsertTest",
      "account":5,
      "amount":12309,
      "product":"Super expensive thing"
    });
    insights.publish(eventArr, configId, function(error, response, body) {
      quickAssert(error, response);
      done();
    })
  });

  it('calls the query api', function(done) {
    var nrql = 'SELECT count(*) FROM Transaction';
    insights.query(nrql, configId, function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });
});
