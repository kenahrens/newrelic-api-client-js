const config = require('config');
const insights = require('../lib/insights.js');
const synthetics = require('../lib/synthetics.js');
const helper = require('../lib/helper.js');
const json2csv = require('json2csv');
const fs = require('fs');

// This NRQL can be used for 1 month, 1 week, 1 day
const nrql = 'SELECT count(*) FROM SyntheticCheck WHERE type != \'SIMPLE\' FACET monitorName LIMIT 1000';
var since = ' SINCE 1 month ago';

// Global counters
var accountPlannedCount = 0;
var accountUsageCount = 0;
var usedResult = [];
var plannedResult = [];

// Array of accounts to parse through
// var configArr = ['newrelic'];
var configArr = config.get('configArr');
var accountLen = configArr.length;

// This gets run at the end to write out the complete CSV
var finalizeUsage = function() {
  console.log('Usage data found for ' + usedResult.length + ' monitors');
  var input = {
    data: usedResult,
    fields: ['account', 'monitorName', 'usageCount'],
    fieldNames: ['Account', 'Monitor Name', 'Usage in Last Month']
  }
  json2csv(input, function(csvErr, csvData) {
    if (csvErr) {
      console.log('ERROR preparing CSV file!');
      console.log(csvErr);
    } else {
      var fname = 'usage-' + (new Date).getTime() + '.csv';
      console.log('Writing usage data to: ' + fname);
      fs.writeFile(fname, csvData, function(fileErr) {
        if(fileErr) {
          return console.log(fileErr);
        }
      });
    }
  });
}

// Run the historical usage query
var runUsageQuery = function(fullNrql, configId) {
  insights.query(fullNrql, configId, function(error, response, body) {
    var resultBody = helper.handleCB(error, response, body);
    var accountResult = {};
    
    var facets = resultBody.facets;
    var monitorCount = facets.length;
    console.log(configId + ' has ' + monitorCount + ' total monitors that have run in the last month');
    for (var f = monitorCount - 1; f >= 0; f--) {
      var usedInfo = {
        'account': configId,
        'monitorName': facets[f].name,
        'usageCount': facets[f].results[0].count
      }
      usedResult.push(usedInfo);
    };

    // Check if all accounts are finished
    accountUsageCount++;
    if (accountUsageCount == accountLen) {
      finalizeUsage();
    }
  });
}

// We got all the planned accounts, now finalize the data
var finalizePlanned = function() {
  console.log('Data received for ' + plannedResult.length + ' non-simple, not disabled monitors');
  var input = {
    data: plannedResult,
    fields: ['account', 'name', 'checkCount'],
    fieldNames: ['Account', 'Monitor Name', 'Planned Monthly Usage']
  }
  json2csv(input, function(csvErr, csvData) {
    if (csvErr) {
      console.log('ERROR preparing CSV file!');
      console.log(csvErr);
    } else {
      var fname = 'scheduled-' + (new Date).getTime() + '.csv';
      console.log('Writing scheduled data to: ' + fname);
      fs.writeFile(fname, csvData, function(fileErr) {
        if(fileErr) {
          return console.log(fileErr);
        }
      });
    }
  });
}

// The planned query checks the Synthetics API
var runPlannedQuery = function(configId) {
  synthetics.getAllMonitors(configId, function(error, response, body) {
    var resultBody = helper.handleCB(error, response, body);

    var monitorCount = resultBody.count;
    console.log(configId + ' has ' + monitorCount + ' total monitors that have beeen created.');
    for (var i = monitorCount - 1; i >= 0; i--) {
      var monitor = resultBody.monitors[i];
      var type = monitor.type;
      if (type != 'SIMPLE') {
        var status = monitor.status;
        if (status != 'DISABLED') {
          monitor.account = configId;
          var frequency = monitor.frequency;
          var locationCount = monitor.locations.length;
          var checkCount = ((30 * 24 * 60) / frequency) * locationCount;
          monitor.checkCount = checkCount;
          plannedResult.push(monitor);
          // var name = monitor.name;
          // console.log(name + ' checks = ' + checkCount);
        }
      }
    }

    // Check if we got all the planned accounts
    accountPlannedCount++;
    if (accountPlannedCount == accountLen) {
      finalizePlanned();
    }
  })
}

// Loop through the accounts in the config array
var loopAccounts = function(since){
  for (var i = configArr.length - 1; i >= 0; i--) {
    var configId = configArr[i];
    var fullNrql = nrql + since;
    console.log('Query account: ' + configId);
    runUsageQuery(fullNrql, configId);
    runPlannedQuery(configId);
  }
}

loopAccounts(since);
