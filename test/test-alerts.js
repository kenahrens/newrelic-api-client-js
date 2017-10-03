const alerts = require('../lib/alerts.js');
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
var configId = config.get('configArr')[0];

// Global variables
var policyName = '';

describe('New Relic Alerts Test', function() {
  this.timeout(15000);

  it('gets the list of alert events', function(done) {
    alerts.events.list(configId, function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

  it('gets the list of alert policies', function(done) {
    alerts.policies.list(null, configId, function(error, response, body) {
      quickAssert(error, response);

      // Get the name first policy
      policyName = body.policies[0].name;

      done();
    })
  })

  it('gets a specific alert policy by name', function(done) {
    alerts.policies.list(policyName, configId, function(error, response, body) {
      quickAssert(error, response);
      assert.equal(body.policies.length, 1, 'Should return 1 policy');
      done();
    });
  });

  it('gets the notification channels', function(done) {
    alerts.channels.list(configId, function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

  // it('gets the list of incidents', function(done) {
  //   alerts.incidents.list(false, configId, function(error, response, body) {
  //     quickAssert(error, response);
  //     done();
  //   })
  // });

});