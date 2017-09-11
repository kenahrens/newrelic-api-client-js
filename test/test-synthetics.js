const synthetics = require('../lib/synthetics.js');
const config = require('config');
const assert = require('assert');

var quickAssert = function(error, response) {
  assert.equal(error, null);
  assert.equal(response.statusCode, 200);
}

// Global variables
var syntheticsId = 0;
var configId = config.get('configArr')[0];

describe('New Relic Synthetics API Test', function() {
  this.timeout(15000);
  
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
