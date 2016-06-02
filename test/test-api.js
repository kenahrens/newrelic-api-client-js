var api = require('../lib/api.js');
var assert = require('assert');

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

describe('New Relic API Test', function() {
  this.timeout(5000);

  it('calls the applications api', function(done) {
    api.apps.list(function(error, response, body) {
      quickAssert(error, response);

      // Get the first app in the list
      appId = body.applications[0].id;

      done();
    });
  });

  it('gets a specific application', function(done) {
    api.apps.show(appId, function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

  it('gets the metricNames for a specific application', function(done) {
    api.apps.metricNames(appId, function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

  it('gets the metricData for a specific application', function(done) {
    var names = 'Agent/MetricsReported/count';
    api.apps.metricData(appId, names, function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

  it('gets the hosts for a specific application', function(done) {
    api.appHosts.list(appId, function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

  it('gets the instances for a specific application', function(done) {
    api.appInstances.list(appId, function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

  it('calls the mobile api', function(done) {
    api.mobile.list(function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

  it('calls the browser api', function(done) {
    api.browser.list(function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

  it('calls the keyTransactions api', function(done) {
    api.keyTransactions.list(function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

  it('calls the servers api', function(done) {
    api.servers.list(function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

  it('calls the usages api for apm', function(done) {
    api.usages.list('apm', function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

  it('calls the users api', function(done) {
    api.users.list(null, function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

  it('calls the plugins api', function(done) {
    api.plugins.list(function(error, response, body) {
      quickAssert(error, response);

      // Get the first plugin in the list
      pluginId = body.plugins[0].id;

      done();
    });
  });


  it('gets the component for a specific plugin', function(done) {
    api.pluginComponents.list(pluginId, function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

});
