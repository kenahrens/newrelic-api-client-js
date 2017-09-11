const dashboards = require('../lib/dashboards.js');
const config = require('config');
const assert = require('assert');

var quickAssert = function(error, response) {
  assert.equal(error, null);
  if(response.statusCode != 200) {
    console.log('ERROR!!!!!!!!');
    console.log(response.body);
  }
  assert.equal(response.statusCode, 200);
}

// Global variables
var appId = 0;
var pluginId = 0;
var componentId = 0;
var configId = config.get('configArr')[0];

describe('New Relic Dashboards Test', function() {
  this.timeout(15000);

  it('gets the list of Insights Dashboards', function(done) {
    dashboards.list(configId, 1, function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

});