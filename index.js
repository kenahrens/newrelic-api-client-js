var api = require('./lib/api.js');
var insights = require('./lib/insights.js');
var synthetics = require('./lib/synthetics.js');
var helper = require('./lib/helper.js');

// Callback
var appCB = function(error, response, body) {
  var body = helper.handleCB(error, response, body);
  console.log('\n*** Applications API output:');
  var applications = body.applications;
  for(var i=0; i < applications.length; i++) {
    var app = applications[i];
    var id = app.id;
    var name = app.name;
    var health = app.health_status;

    console.log(name + '(' + id + ') is ' + health);
  }
}

var serverCB = function(error, response, body) {
  var body = helper.handleCB(error, response, body);
  console.log('\n*** Servers API output:');
  var servers = body.servers;
  for (var i=0; i < servers.length; i++) {
    var server = servers[i];
    var id = server.id;
    var name = server.name;
    var health = server.health_status;

    console.log(name + ' (' + id + ') is ' + health);
  }
}

var nrql = 'SELECT count(*) FROM Transaction';
var insightsCB = function(error, response, body) {
  var body = helper.handleCB(error, response, body);
  console.log('\n*** Insights API output:');
  console.log('Transaction count = ' + body.results[0].count);
}

var syntheticsCB = function(error, response, body) {
  var body = helper.handleCB(error, response, body);
  console.log('\n*** Synthetics API output:');
  var monitors = body.monitors;
  for (var i=0; i < monitors.length; i++) {
    var name = monitors[i].name;
    var status = monitors[i].status;

    console.log(name + ' (' + status + ')');
  }
}

console.log(api);

// Run the queries
console.log('Details from the API calls');
api.apps.list(appCB);
api.servers.list(serverCB);
insights.query(nrql, insightsCB);
synthetics.getAllMonitors(syntheticsCB);