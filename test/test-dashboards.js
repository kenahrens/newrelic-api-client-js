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
var configId = config.get('configArr')[0];

// Global variables
var firstDashboardId = 0;
var dashboardBody = '';
var secondDashboardId = 0;

describe('New Relic Dashboards Test', function() {
  this.timeout(15000);

  it('gets the list of all Insights Dashboards', function(done) {
    dashboards.list(configId, function(error, response, body) {
      quickAssert(error, response);
      done();
    })
  });

  it('gets the first page of Insights Dashboards', function(done) {
    dashboards.getPage(1, configId, function(error, response, body) {
      quickAssert(error, response);

      // Get the first dashboard in the list
      firstDashboardId = body.dashboards[0].id;

      done();
    });
  });

  it('gets the first dashboard from the list', function(done) {
    dashboards.getOne(firstDashboardId, configId, function(error, response, body) {
      quickAssert(error, response);
      dashboardBody = body;
      done();
    });
  });

  it('creates a copy of the first dashboard', function(done) {
    dashboardBody.dashboard.title = 'API Copy of ' + dashboardBody.dashboard.title;
    dashboards.create(dashboardBody, configId, function(error, response, body) {
      quickAssert(error, response);
      secondDashboardId = body.dashboard.id;
      done();
    });
  });

  it('updates the title of the copied dashboard', function(done) {
    dashboardBody.dashboard.title = 'API Update of ' + dashboardBody.dashboard.title;
    dashboards.update(secondDashboardId, dashboardBody, configId, function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

  it('deletes the copied dashboard', function(done) {
    dashboards.delete(secondDashboardId, configId, function(error, response, body) {
      quickAssert(error, response);
      done();
    });
  });

});