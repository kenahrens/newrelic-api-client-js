const api = require('../lib/api.js');
const config = require('config');
const assert = require('assert');

var quickAssert = function(error, response) {
  assert.equal(error, null);
  if(response.statusCode != 200) {
    console.log('ERROR:: ' + response.statusCode);
    console.log(response.body);
  }
  assert.equal(response.statusCode, 200);
}

// Global variables
var appId = 0;
var pluginId = 0;
var componentId = 0;
var configId = config.get('configArr')[0];

describe('New Relic Pagination Test', function() {
  this.timeout(15000);

  it('lists all plugin components', function(done) {
    api.pluginComponents.list(configId, function(error, response, body) {
      quickAssert(error, response);

      // Get the first component in the list
      componentId = body.components[0].id;
      var componentCount = body.components.length;
      assert.ok(componentCount != 200, 'componentCount can\'t be exactly count of 200: ' + componentCount);
      
      done();
    })
  });

  it('gets a specific component', function(done) {
    api.pluginComponents.show(componentId, configId, function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

});
