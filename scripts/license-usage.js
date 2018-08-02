const config = require('config');
const insights = require('../lib/insights.js');
const dashboards = require('../lib/dashboards.js');
const helper = require('../lib/helper.js');

var json2csv = require('json2csv');
const fs = require('fs');

var program = require('commander');

// Why do we divide by 1? Because it makes the JSON output have the attribute name "result"
const NRQL_APM = "SELECT sum(apmHoursUsed) / 750 FROM NrDailyUsage WHERE `productLine` = 'APM' AND `usageType` = 'Host' ";
const NRQL_BROWSER = "SELECT SUM(browserPageViewCount) / 1 FROM NrDailyUsage WHERE `productLine` = 'Browser' AND `usageType` = 'Application' AND `isPrimaryApp` = 'true' "
const NRQL_INFRA = "SELECT SUM(infrastructureComputeUnits) / 1 FROM NrDailyUsage WHERE `productLine` = 'Infrastructure' AND `usageType` = 'Host' ";
const NRQL_INSIGHTS = "SELECT SUM(insightsTotalEventCount - insightsIncludedEventCount) / uniqueCount(timestamp) FROM NrDailyUsage WHERE `productLine` = 'Insights' AND `usageType` = 'Event' ";
const NRQL_MOBILE = "SELECT sum(mobileUniqueUsersPerMonth) / 1 FROM NrDailyUsage WHERE `productLine` = 'Mobile' AND `usageType` = 'Application' "
const NRQL_SYN = "SELECT SUM(syntheticsSuccessCheckCount + syntheticsFailedCheckCount) / 1  FROM NrDailyUsage WHERE `productLine` = 'Synthetics' AND `usageType` = 'Check' AND `syntheticsTypeLabel` != 'Ping' "

// NRQL queries for script
const NRQL_FACET = " FACET consumingAccountId, consumingAccountName LIMIT 1000 "

// Global variables
var configId;
var sinceEpoch;
var untilEpoch;
var accountResult = [];
var doneCount = 0;
var doneExpected = 6;

function toCSV() {
  console.log('Create CSV');
  
  // Setup the input
  var input = {
    data: accountResult,
    fields: ['accountId', 'accountName', 'apm', 'browser', 'infra', 'insights', 'mobile', 'synthetics']
  }

  // Store the CSV
  json2csv(input, function(err, csvData) {
    if (err) {
      console.log('ERROR!');
      console.log(err);
    } else {
      var fname = 'usage-' + program.year + '-' + program.month + '-' + new Date().getTime() + '.csv';
      console.log('Writing usage to: ' + fname);
      fs.writeFile(fname, csvData, function(fileErr) {
        if(fileErr) {
          return console.log(fileErr);
        }
      });
    }
  });
}

function checkDone(usageType) {
  doneCount++;
  console.log(usageType, 'done');
  if (doneCount == doneExpected) {
    console.log('All done running queries');
    toCSV();
  }
}

function runQuery(nrql, usageType) {
  console.log(nrql);
  insights.query(nrql, configId, function(error, response, body) {
    var parsedBody = helper.handleCB(error, response, body);
    parseUsage(parsedBody.facets, usageType);
    checkDone(usageType);
  });
}

function parseUsage(facetArr, usageType) {
  // Loop over the facets
  for (var i=0; i < facetArr.length; i++) {
    var facet = facetArr[i];
    
    // In the facet name section, 0 is accountId, 1 is accountName
    var accountId = facet.name[0];
    var accountName = facet.name[1];

    // In the facet result section there should be a single value called result
    var usageVal = facet.results[0].result;

    // Get the account (or create it if it doesn't exist)
    var acct = lookupAccount(accountId, accountName);

    // Add that usage data to the account
    acct[usageType] = usageVal;
    // console.log(acct);
  }
}

function lookupAccount(accountId, accountName) {
  var acct = accountResult[accountId];
  if (acct == null) {
    acct = {
      'accountId': accountId,
      'accountName': accountName
    }
    accountResult[accountId] = acct;
  }
  return acct;
}

function runQueries() {
  var nrqlApm = NRQL_APM + NRQL_FACET + ' SINCE ' + sinceEpoch + ' UNTIL ' + untilEpoch;
  runQuery(nrqlApm, 'apm');
  
  var nrqlBrowser = NRQL_BROWSER + NRQL_FACET + ' SINCE ' + sinceEpoch + ' UNTIL ' + untilEpoch;
  runQuery(nrqlBrowser, 'browser');

  var nrqlInfra = NRQL_INFRA + NRQL_FACET + ' SINCE ' + sinceEpoch + ' UNTIL ' + untilEpoch;
  runQuery(nrqlInfra, 'infra');

  var nrqlInsights = NRQL_INSIGHTS + NRQL_FACET + ' SINCE ' + sinceEpoch + ' UNTIL ' + untilEpoch;
  runQuery(nrqlInsights, 'insights');

  // There is a special SINCE and UNTIL for Mobile, must grab last day of the month
  var lastDay = new Date(untilEpoch * 1000);
  lastDay.setDate(lastDay.getDate() - 1);
  console.log('Last day', lastDay);
  var lastDayEpoch = parseInt(lastDay.getTime() / 1000);
  var nrqlMobile = NRQL_MOBILE + NRQL_FACET + ' SINCE ' + lastDayEpoch + ' UNTIL ' + untilEpoch;
  runQuery(nrqlMobile, 'mobile');

  var nrqlSyn = NRQL_SYN + NRQL_FACET + ' SINCE ' + sinceEpoch + ' UNTIL ' + untilEpoch;
  runQuery(nrqlSyn, 'synthetics');

  // Make a dashboard with these queries
  // makeDashboard(nrqlApm, nrqlBrowser, nrqlInfra, nrqlInsights, nrqlMobile, nrqlSyn);
}

// function makeDashboard(nrqlApm, nrqlBrowser, nrqlInfra, nrqlInsights, nrqlMobile, nrqlSyn) {
//   var dashboardBody = require('./dashboards/license-usage.json');
//   // console.log(dashboardBody);
// }

////////////////////////////////////////////////////////////////////////////////
console.log('License usage to CSV tool');

program
  .version('0.0.1')
  .description('get license usage for your accounts')
  .option('--year [year]', 'Which year to report in format yyyy (ex: 2018)')
  .option('--month [month]', 'Which month to report in mm (ex: 01)')
  .option('--account [account]', 'Account name to run against from your config')
  .parse(process.argv);

if (!process.argv.slice(6).length) {
  program.outputHelp();
} else {
  if (program.year && program.month && program.account) {
    // Check that the month is valid
    var dateStart = new Date();
    var iYear = parseInt(program.year);
    var iMonth = parseInt(program.month) - 1; // JS months start at 0?
    dateStart.setFullYear(iYear, iMonth, 1);
    dateStart.setHours(0, 0, 0, 0);
    var dateEnd = new Date(dateStart.getTime());
    dateEnd.setMonth(iMonth + 1);

    // Check that the account is valid
    if (config.has(program.account)) {
      console.log('Run against', program.account, 'for the dates', dateStart, 'to', dateEnd);
      configId = program.account;
      sinceEpoch = dateStart.getTime() / 1000;
      untilEpoch = dateEnd.getTime() / 1000;
      runQueries();
    } else {
      console.error('Could not find account in config, double check your NODE_ENV=', process.env.NODE_ENV);
    }
  } else {
    program.outputHelp();
  }
}