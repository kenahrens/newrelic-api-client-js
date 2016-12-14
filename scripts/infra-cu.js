const config = require('config');
const insights = require('../lib/insights.js');
const helper = require('../lib/helper.js');
const cuHelper = require('../lib/cuHelper.js');
const json2csv = require('json2csv');
const fs = require('fs');

var program = require('commander');

// Standard Insights queries
const nrqlSystem = 'SELECT uniqueCount(entityId) FROM SystemSample TIMESERIES 1 hour FACET ec2InstanceType LIMIT 100 ';
const nrqlEC2 = 'SELECT uniqueCount(entityId) FROM ComputeSample WHERE `provider.ec2State` = \'running\' TIMESERIES 1 hour FACET ec2InstanceType LIMIT 100 ';
const nrqlTimestampSystem = 'SELECT min(timestamp) FROM SystemSample SINCE 751 hours ago';
const nrqlTimestampEC2 = 'SELECT min(timestamp) FROM ComputeSample SINCE 751 hours ago';

var configId = config.get('configArr')[0];
var usageData = [];
// var beginKeys = [];
// var daysOfData = 1;
var loopCount = 0;
var callbackCount = 0;
var almostNow = new Date();
var oldestDate = 0;
var hoursOfData = 0;

// This gets run at the end to write out the complete CSV
var finalizeUsage = function() {

  // Need to calculate the total for each instanceType
  var totalCU = 0;
  for(instanceType in usageData) {
    var usage = usageData[instanceType];

    // Loop through the time slices for this instanceType
    var totalHours = 0;
    for (slice in usage) {
      if (slice != 'ec2InstanceType') {
        totalHours += usage[slice];
      }
    }

    // Extrapolate if there are not enough hours in the data
    totalHours = (cuHelper.monthlyHours * totalHours) / hoursOfData;
    usage['totalHours'] = totalHours;

    // As a helper calculate the average number of monthly hosts
    usage['avgHosts'] = totalHours / cuHelper.monthlyHours;

    // Lookup the CU for this instanceType, then calculate the total CU
    var computeUnits = cuHelper.getComputeUnits('AWS', instanceType);
    usage['computeUnits'] = computeUnits;
    totalCU += computeUnits * totalHours;
    usage['totalCU'] = computeUnits * totalHours;
    usageData[instanceType] = usage;
  }

  // Write out the total of all instanceTypes
  usageData['CU Total'] = {
    'ec2InstanceType': 'CU Total',
    'totalHours': '',
    'avgHosts': '',
    'computeUnits': '',
    'totalCU': totalCU
  }

  // This will flatten the usageData so it can be written to CSV
  var outputArr = Object.keys(usageData).map(function(key) {
    return usageData[key];
  });

  // This is the code to setup the CSV file
  var input = {
    data: outputArr,
    fields: ['ec2InstanceType', 'avgHosts', 'totalHours', 'computeUnits', 'totalCU'],
    defaultValue: 0
  };

  json2csv(input, function(csvErr, csvData) {
    if (csvErr) {
      console.log('ERROR preparing CSV file!');
      console.log(csvErr);
    } else {
      var fname = 'infra-' + configId + '-' + (new Date).getTime() + '.csv';
      console.log('Writing usage data to: ' + fname);
      fs.writeFile(fname, csvData, function(fileErr) {
        if(fileErr) {
          return console.log(fileErr);
        }
      });
    }
  });
}

// This puts the unique count for each instanceType into usageData[]
var recordUniqueCount = function(instanceType, begin, usageCount) {
  // Get the usage object for this instance
  var usage = usageData[instanceType];
  if (usage == null) {
    usage = { 'ec2InstanceType': instanceType };
    usage[begin] = usageCount;
  } else {
    if (usage[begin] == null) {
      usage[begin] = usageCount;
    } else {
      usage[begin] += usageCount;
    }
  }

  usageData[instanceType] = usage;
}

// Callback from the Insights Query
var queryCb = function(error, response, originalBody) {
  var body = helper.handleCB(error, response, originalBody);

  callbackCount++;
  // var begin = body.metadata.beginTime;
  console.log('- Got response for begin time: ' + body.metadata.beginTime);

  // Loop over the timeseries slices
  for(var i=0; i < body.totalResult.timeSeries.length; i++) {
    var totalCount = body.totalResult.timeSeries[i].results[0].uniqueCount;
    var beginTimeSeconds = body.totalResult.timeSeries[i].beginTimeSeconds;
    
    // Get the slice for each ec2InstanceType
    var runningCount = 0;
    for(var j=0; j < body.facets.length; j++) {
      var facetName = body.facets[j].name;
      var facetCount = body.facets[j].timeSeries[i].results[0].uniqueCount;
      recordUniqueCount(facetName, beginTimeSeconds, facetCount);

      // Keep track of the running count for this timeSlice
      runningCount += facetCount;
    }

    // The difference between runningCount and totalCount is "unknown"
    var unknownCount = totalCount - runningCount;
    if (runningCount >= totalCount) {
      unknownCount = 0;
    }
    recordUniqueCount('unknown', beginTimeSeconds, unknownCount);
  }

  // Check if we have all the data
  if (callbackCount == loopCount) {
    console.log('- Got all the Insights responses');
    finalizeUsage();
  } else {
    console.log('- Still waiting for more data : ' + callbackCount + ' != ' + loopCount);
  }
}

// Helper function to calculate number of milliseconds per hour
var msPerHour = function() {
  return 60 * 60 * 1000;
}

// Loop in 250 (or less) hour chunks since Insights wants 366 or fewer buckets
var queryLoop = function(sinceTime, nrqlStart) {
  if (sinceTime != almostNow.getTime()) {
    var untilTime = sinceTime + (250 * msPerHour());
    untilTime = Math.min(untilTime, almostNow.getTime());

    // Make the proper NRQL query for this time range
    var nrql = nrqlStart + ' SINCE ' + sinceTime + ' UNTIL ' + untilTime;
    insights.query(nrql, configId, queryCb);
    console.log('-> Query Insights SINCE ' + new Date(sinceTime) + ' UNTIL ' + new Date(untilTime));

    loopCount++;
    queryLoop(untilTime, nrqlStart);
  }
}

// Helper method to find the oldest timestamp, then kick off the loop
var oldestTimestamp = function(nrqlTimestamp, nrqlStart) {
  console.log('-> Query Insights for oldest timestamp');
  insights.query(nrqlTimestamp, configId, function(error, response, originalBody) {
    var body = helper.handleCB(error, response, originalBody);
    var oldestTimestamp = body.results[0].min;
    oldestDate = new Date(oldestTimestamp);
    oldestDate.setHours(oldestDate.getHours() + 1, 0, 0, 0);
    hoursOfData = (almostNow - oldestDate) / msPerHour();
    console.log('- There are ' + hoursOfData + ' hours of data in Insights');
    queryLoop(oldestDate.getTime(), nrqlStart);
  });
}

////////////////////////////////////////////////////////////////////////////////
console.log('Infrastructure compute unit (CU) helper tool');
console.log('- Source: https://github.com/kenahrens/newrelic-api-client-js/tree/master/scripts');

// Round the current time to the last hour
almostNow.setHours(almostNow.getHours(), 0, 0, 0);
console.log('- Report will gather data up until: ' + almostNow);

program
  .version('0.0.1')
  .description('calculate monthly compute units (CU)')
  .option('-d, --deployed', 'Report off deployed agents (default is EC2 integration)')
  .parse(process.argv);

// Determine how to start the program
if (program.deployed) {
  console.log('- Report CU based on deployed agents');
  oldestTimestamp(nrqlTimestampSystem, nrqlSystem);
} else {
  console.log('- Report CU based on data from EC2 integration');
  oldestTimestamp(nrqlTimestampEC2, nrqlEC2);
}