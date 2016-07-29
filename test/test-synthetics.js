var synthetics = require('../lib/synthetics.js');
var assert = require('assert');

var quickAssert = function(error, response) {
  assert.equal(error, null);
  assert.equal(response.statusCode, 200);
}

// Global variables
var syntheticsId = 0;
var configId = 'newrelic';

describe('New Relic Synthetics API Test', function() {
  this.timeout(5000);
  
  it('gets the list of all monitors', function(done) {
    synthetics.getAllMonitors(configId, function(error, response, body) {
      quickAssert(error, response);
      syntheticsId = body.monitors[0].id;
      done();
    })
  });

  it('gets a single monitor', function(done) {
    synthetics.getMonitor(syntheticsId, configId, function(error, response, body) {
      quickAssert(error, response);
      done();
    })
  });
});
