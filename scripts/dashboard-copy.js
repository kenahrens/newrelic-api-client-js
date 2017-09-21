const dashboards = require('../lib/dashboards.js');
const config = require('config');
var program = require('commander');

var chkResult = function(error, response, body) {
  if (!error && response.statusCode == 200) {
    return true;
  } else {
    if (error) {
      console.error('API error: ' + error);
    } else {
      console.error('Bad response code: ', response.statusCode);
      console.error('HTTP response: ', body);
    }
  }
  return false;
}

// Print out the URL of the newly created dashboard
var handleCreate = function(error, response, body) {
  if (chkResult(error, response, body)) {
    var destId = config.get(program.dest).accountId;
    var url = 'http://insights.newrelic.com/accounts/' + destId + '/dashboards/' + body.dashboard.id;
    console.log('Dashboard created: ' + url);
  }
}

// Read the source dashboard
var readDash = function(error, response, body) {
  if (chkResult(error, response, body)) {
    console.log('Found source dashboard named: ' + body.dashboard.title);
    dashboards.create(body, program.dest, handleCreate);
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