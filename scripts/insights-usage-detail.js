const config = require('config');
const insights = require('../lib/insights.js');
const helper = require('../lib/helper.js');
const json2csv = require('json2csv');
const fs = require('fs');

const nrql = 'SELECT count(*) FROM Transaction FACET appName LIMIT 1000';
var since = ' SINCE 8 week ago';

var configArr = config.get('configArr');
var accountUsageCount = 0;
var accountLen = configArr.length;
var usedResult = [];

console.log('Going to query: ' + accountLen + ' accounts.');

// This gets run at the end to write out the complete CSV
var finalizeUsage = function() {
  console.log('Usage data found for ' + usedResult.length + ' apps');
  var input = {
    data: usedResult,
    fields: ['account', 'appName', 'usageCount'],
    fieldNames: ['Account', 'App Name', 'Usage']
  }
  json2csv(input, function(csvErr, csvData) {
    if (csvErr) {
      console.log('ERROR preparing CSV file!');
      console.log(csvErr);
    } else {
      var fname = 'insights-usage-' + (new Date).getTime() + '.csv';
      console.log('Writing usage data to: ' + fname);
      fs.writeFile(fname, csvData, function(fileErr) {
        if(fileErr) {
          return console.log(fileErr);
        }
      });
    }
  });
}

var runUsageQuery = function(fullNrql, configId) {
  insights.query(fullNrql, configId, function(error, response, body) {
    // console.log('Data received from: ' + configId);
    if (!error & response.statusCode == 200) {
      var resultBody = helper.handleCB(error, response, body);
      var accountResult = {};
      
      var facets = resultBody.facets;
      var appCount = facets.length;
      // console.log(configId + ' has ' + appCount + ' apps with events');
      for (var f = appCount - 1; f >= 0; f--) {
        var usedInfo = {
          'account': configId,
          'appName': facets[f].name,
          'usageCount': facets[f].results[0].count
        }
        usedResult.push(usedInfo);
      };
    } else {
      console.error('Error for account: ' + configId);
    }

    // Check if all accounts are finished
    accountUsageCount++;
    if (accountUsageCount == accountLen) {
      finalizeUsage();
    }
  });
}

// Loop through the accounts in the config array
var loopAccounts = function(){
  for (var i = 0; i < configArr.length; i++) {
    var configId = configArr[i];
    var fullNrql = nrql + since;
    runUsageQuery(fullNrql, configId);
  }
}

loopAccounts();
