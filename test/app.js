var api = require('../lib/api.js');
var insights = require('../lib/insights.js');
var synthetics = require('../lib/synthetics.js');

var assert = require('assert');

var quickAssert = function(error, response) {
  assert.equal(error, null);
  if(response.statusCode != 200) {
    console.log('ERROR!!!!!!!!');
    console.log(response.body);
  }
  assert.equal(response.statusCode, 200);
}

describe('New Relic API Test', function() {
  this.timeout(10000);

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

  it('gets the metricNames for a specific application', function(done) {
    api.apps.list(function(error, response, body) {
      quickAssert(error, response);

      // Get the first app in the list
      var appId = body.applications[0].id;
      api.apps.metricNames(appId, function(error, response, body) {
        quickAssert(error, response);
        done();
      });
    });
  });

  it('gets the hosts for a specific application', function(done) {
    api.apps.list(function(error, response, body) {
      quickAssert(error, response);

      // Get the first app in the list
      var appId = body.applications[0].id;
      api.appHosts.list(appId, function(error, response, body) {
        quickAssert(error, response);
        done();
      });
    });
  });

  it('gets the instances for a specific application', function(done) {
    api.apps.list(function(error, response, body) {
      quickAssert(error, response);

      // Get the first app in the list
      var appId = body.applications[0].id;
      api.appInstances.list(appId, function(error, response, body) {
        quickAssert(error, response);
        done();
      });
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
    api.users.list(function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

  it('calls the plugins api', function(done) {
    api.plugins.list(function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });


  it('gets the component for a specific plugin', function(done) {
    api.plugins.list(function(error, response, body) {
      quickAssert(error, response);

      // Get the first app in the list
      var pluginId = body.plugins[0].id;
      api.pluginComponents.list(pluginId, function(error, response, body) {
        quickAssert(error, response);
        done();
      });
    });
  });

});
