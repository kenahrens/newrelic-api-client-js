var api = require('../lib/api.js');
var insights = require('../lib/insights.js');
var synthetics = require('../lib/synthetics.js');

var assert = require('assert');

var quickAssert = function(error, response) {
  assert.equal(error, null);
  assert.equal(response.statusCode, 200);
}

describe('newrelic-api-test', function() {
  it('calls the applications api', function(done) {
    api.apps.list(function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });
  it('gets a specific application', function(done) {
    api.apps.list(function(error, response, body) {
      quickAssert(error, response);

      // Get the first app in the list
      var appId = body.applications[0].id;
      api.apps.show(appId, function(error, response, body) {
        quickAssert(error, response);
        done();
      });
    });
  });
  it('calls the servers api', function(done) {
    api.servers.list(function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });
});

describe('synthetics-test', function() {
  it('calls the synthetics api', function(done) {
    synthetics.getAllMonitors(function(error, response, body) {
      quickAssert(error, response);
      done();
    })
  });
});

describe('insights-test', function() {
  it('calls the query api', function(done) {
    var nrql = 'SELECT count(*) FROM ARG';
    insights.query(nrql, function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });
});

