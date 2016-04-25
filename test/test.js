var api = require('../api.js');
var insights = require('../insights.js');

var assert = require('assert');

describe('newrelic-api-test', function() {
  before(function(){

  });
  beforeEach(function(){

  });
  it('calls the application api', function() {
    var callback = function(error, response, body) {
      assert.equal(error, null);
      assert.equal(response.statusCode, 200);
    }

    // Read config file
    api.applicationList(callback);
  });
  after(function() {

  });
});

describe('insights-test', function() {
  before(function(){

  });
  beforeEach(function(){

  });
  it('calls the query api', function() {
    var callback = function(error, response, body) {
      assert.equal(error, null);
      assert.equal(response.statusCode, 200);
    }

    // Read config file
    api.applicationList(callback);
  });
  after(function() {

  });
});

