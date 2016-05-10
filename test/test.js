var api = require('../lib/api.js');
var insights = require('../lib/insights.js');
var synthetics = require('../lib/synthetics.js');

var assert = require('assert');

describe('newrelic-api-test', function() {
  before(function(){

  });
  beforeEach(function(){

  });
  it('calls the applications api', function(done) {
    api.applicationsList(function(error, response, body) {
      assert.equal(error, null);
      assert.equal(response.statusCode, 200);
      done();
    });
  });
  after(function() {

  });
});

describe('synthetics-test', function() {
  it('calls the synthetics api', function(done) {
    synthetics.getAllMonitors(function(error, response, body) {
      assert.equal(error, null);
      assert.equal(response.statusCode, 200);
      done();
    })
  });
});

describe('insights-test', function() {
  before(function(){

  });
  it('calls the query api', function(done) {
    var nrql = 'SELECT count(*) FROM ARG';
    insights.query(nrql, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(response.statusCode, 200);
      done();
    });
  });
  after(function() {

  });
});

