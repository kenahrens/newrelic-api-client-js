const dashboards = require('../lib/dashboards.js');
const helper = require('../lib/helper.js');
const config = require('config');
var program = require('commander');

// Print out the URL of the newly created dashboard
var handleCreate = function(error, response, body) {
  var rspBody = helper.handleCB(error, response, body);
  if (rspBody != null) {
    var destId = config.get(program.dest).accountId;
    var url = 'http://insights.newrelic.com/accounts/' + destId + '/dashboards/' + rspBody.dashboard.id;
    console.log('Dashboard created: ' + url);
  }
}

// Read the source dashboard
var readDash = function(error, response, body) {
  var dashboardBody = helper.handleCB(error, response, body);
  if (dashboardBody != null) {
    console.log('Found source dashboard named: ' + dashboardBody.dashboard.title);
    dashboards.create(dashboardBody, program.dest, handleCreate);
  }
}

// Setup the commander program
program
  .version('0.0.1')
  .option('--src [account]', 'Source account that has the dashboard to be copied')
  .option('--dash [dashboardId]', 'Id of the dashboard to be copied')
  .option('--dest [account]', 'Destination account to copy the dashboard to')
  .parse(process.argv);

if (!process.argv.slice(7).length) {
  program.outputHelp();
} else {
  // Make sure [from] is in the config
  if (!config.has(program.src)) {
    console.error('Your config does not have *src* account: ' + program.from);
  } else if (!config.has(program.dest)) {
    console.error('Your config does not have *dest* account: ' + program.to);
  } else {
    // We have good data so try to read the dashboard
    console.log('Trying to find dashboard: ' + program.dash);
    dashboards.getOne(program.dash, program.src, readDash);
  }
}