var api = require('./api.js');
var insights = require('./insights.js');

// Callback
var appCB = function(error, response, body) {
  if (!error && response.statusCode === 200) {
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
    console.log('Insights Transactions = ' + body.results[0].count);
  } else {
    console.log('Insights API Error!');
    if (error) {
      console.log(error);
    } else {
      console.log(response.statusCode);
    }
  }
}

// Read config file
api.applicationList(appCB);
insights.query(nrql, insightsCB);