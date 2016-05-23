var api = require('../lib/api.js');
var insights = require('../lib/insights.js');
var synthetics = require('../lib/synthetics.js');

var assert = require('assert');

var quickAssert = function(error, response) {
  assert.equal(error, null);
  assert.equal(response.statusCode, 200);
}

describe('New Relic Synthetics API Test', function() {
  it('calls the synthetics api', function(done) {
    synthetics.getAllMonitors(function(error, response, body) {
      quickAssert(error, response);
      done();
    })
  });
});
