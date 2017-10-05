const synthetics = require('../lib/synthetics.js');
const config = require('config');
const assert = require('assert');

var quickAssert = function(error, response) {
  assert.equal(error, null);
  if(response.statusCode != 200) {
    console.error('Bad status code: ', response.statusCode);
    console.error(response.body);
  }
  assert.equal(response.statusCode, 200);
}

// Global variables
var monitorId = 0;
var locationArr = [];
var configId = config.get('configArr')[0];

describe('New Relic Synthetics API Test', function() {
  this.timeout(15000);
  
  it('gets the list of all monitors', function(done) {
    synthetics.getAllMonitors(configId, function(error, response, body) {
      quickAssert(error, response);
      // monitorId = body.monitors[0].id;
      done();
    })
  });

  it('gets the list of locations', function(done) {
    synthetics.getLocations(configId, function(error, response, body) {
      quickAssert(error, response);

      // Add the first location to our array
      locationArr.push(body[0].name);

      done();
    });
  });

  it('creates a ping monitor', function(done) {
    var monitorBody = {
      'name': 'client-api-test-' + Date.now(),
      'type': 'SIMPLE',
      'frequency': 5,
      'uri': 'https://newrelic.com/synthetics',
      'locations': locationArr,
      'status': 'ENABLED',
      'slaThreshold': 7.0
    }
    synthetics.createMonitor(monitorBody, configId, function(error, response, body) {
      
      // Make sure there is no error and it returns a 201
      assert.equal(error, null);
      assert.equal(response.statusCode, 201);
      
      // The newly created monitor url is in the HTTP header location field
      var monitorSyntheticsUrl = response.headers.location;
      var slash = monitorSyntheticsUrl.lastIndexOf('/');
      monitorId = monitorSyntheticsUrl.substring(slash + 1);
      done();
    })
  });

  it('deletes the ping monitor we just created', function(done) {
    synthetics.deleteMonitor(monitorId, configId, function(error, response, body) {
      
      // Make sure there is no error and it returns a 204
      assert.equal(error, null);
      assert.equal(response.statusCode, 204);
      done();
    });
  });

});
