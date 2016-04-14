var api = require('../api.js');
var assert = require('assert');

describe('newrelic-api-test', function() {
  before(function(){

  });
  beforeEach(function(){

  });
  it('calls the api', function() {
    var callback = function(error, response, body) {
      assert.equal(error, null);
      assert.equal(response.statusCode, 200);
    }

    // Read config file
    api.applicationList(callback);
  });
  after(function() {

  });
})