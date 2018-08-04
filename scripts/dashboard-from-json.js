const dashboards = require('../lib/dashboards.js');
const helper = require('../lib/helper.js');
const fs = require('fs');
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

// Read the source dashboard from the file system
function readDashFromFS(fname) {
  var dashboardBody = fs.readFileSync(fname);
  console.log('Read file:', fname);

  // Set the proper account_id on all widgets
  if (dashboardBody != null) {

    dashboardBody = JSON.parse(dashboardBody);
    console.log('Read source dashboard named: ' + dashboardBody.dashboard.title);
    
    var destId = config.get(program.dest).accountId;
    dashboardBody = dashboards.updateAccountId(dashboardBody, 1, destId);
    console.log(dashboardBody);
  } else {
    console.error('Problem reading file', fname);
  }

  return dashboardBody;
}

// Setup the commander program
program
  .version('0.0.1')
  .option('--fname [fname]', 'Location of the file with the JSON template')
  .option('--dest [account]', 'Destination account where the dashboard should be created')
  .parse(process.argv);

if (!process.argv.slice(5).length) {
  program.outputHelp();
} else {
  // Make sure [from] is in the config
  if (!config.has(program.dest)) {
    console.error('Your config does not have *dest* account: ' + program.dest);
  } else {
    // We have good data so try to read the dashboard
    var dashboardBody = readDashFromFS(program.fname);
    dashboards.create(dashboardBody, program.dest, handleCreate);
  }
}