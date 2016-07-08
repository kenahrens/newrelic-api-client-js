var synthetics = require('../lib/synthetics.js');
var assert = require('assert');

var quickAssert = function(error, response) {
  assert.equal(error, null);
  assert.equal(response.statusCode, 200);
}

var syntheticsId = 0;

describe('New Relic Synthetics API Test', function() {
  this.timeout(5000);
  
  it('gets the list of all monitors', function(done) {
    synthetics.getAllMonitors(function(error, response, body) {
      syntheticsId = body.monitors[0].id;
      quickAssert(error, response);
      done();
    })
  });

  it('gets a single monitor', function(done) {
    synthetics.getMonitor(syntheticsId, function(error, response, body) {
      quickAssert(error, response);
      done();
    })
  });
});
