var api = require('./api.js');
var insights = require('./insights.js');
var synthetics = require('./synthetics.js');

// Callback
var appCB = function(error, response, body) {
  if (!error && response.statusCode === 200) {
    console.log('\n*** APM API output:');
    var applications = body.applications;
    for(var i=0; i < applications.length; i++) {
      var app = applications[i];
      var id = app.id;
      var name = app.name;
      var health = app.health_status;

      console.log(name + '(' + id + ') is ' + health);
    }
  } else {
    console.log('Application API Error!');
    if (error) {
      console.log(error);
    } else {
      console.log(response.statusCode);
    }
  }
}

var nrql = 'SELECT count(*) FROM Transaction';
var insightsCB = function(error, response, body) {
  if (!error && response.statusCode === 200) {
    console.log('\n*** Insights API output:');
    console.log('Transaction count = ' + body.results[0].count);
  } else {
    console.log('Insights API Error!');
    if (error) {
      console.log(error);
    } else {
      console.log(response.statusCode);
    }
  }
}

var syntheticsCB = function(error, response, body) {
  if (!error && response.statusCode === 200) {
    console.log('\n*** Synthetics API output:');
    var monitors = body.monitors;
    for (var i=0; i < monitors.length; i++) {
      var name = monitors[i].name;
      var status = monitors[i].status;

      console.log(name + ' (' + status + ')');
    }
  } else {
    console.log('Synthetics API Error!');
    if (error) {
      console.log(error);
    } else {
      console.log(response.statusCode);
    }
  }
}

// Run the queries
console.log('Details from the API calls');
api.applicationsList(appCB);
insights.query(nrql, insightsCB);
synthetics.getAllMonitors(syntheticsCB);