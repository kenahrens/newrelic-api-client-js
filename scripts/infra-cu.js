const config = require('config');
const insights = require('../lib/insights.js');
const json2csv = require('json2csv');
const fs = require('fs');

//const nrqlNonAWS = 'SELECT uniqueCount(hostname) FROM SystemSample TIMESERIES 1 hour WHERE ec2InstanceType IS NULL LIMIT 100';
const nrqlAWS = 'SELECT uniqueCount(hostname) FROM SystemSample TIMESERIES 1 hour FACET ec2InstanceType LIMIT 100 ';
var configId = config.get('configArr')[0];
var usageData = [];
var beginKeys = [];
var daysOfData = 32;
var callbackCount = 0;

// This gets run at the end to write out the complete CSV
var finalizeUsage = function() {

  // Need to calculate the total for each type
  for(name in usageData) {
    var usage = usageData[name];
    var totalCount = 0;
    for (slice in usage) {
      if (slice != 'ec2InstanceType') {
        var usageCount = usage[slice];
        totalCount += usageCount;
      }
    }
    usage['totalCount'] = totalCount;
    usageData[name] = usage;
  }
  
  // This will flatten the usageData so it can be written to CSV
  var outputArr = Object.keys(usageData).map(function(key) {
    return usageData[key];
  });
  beginKeys = beginKeys.sort();
  beginKeys.splice(0, 0, 'ec2InstanceType', 'totalHours');
  console.log(beginKeys);
  var input = {
    data: outputArr,
    fields: beginKeys 
  }
  json2csv(input, function(csvErr, csvData) {
    if (csvErr) {
      console.log('ERROR preparing CSV file!');
      console.log(csvErr);
    } else {
      var fname = 'infra-' + (new Date).getTime() + '.csv';
      console.log('Writing usage data to: ' + fname);
      fs.writeFile(fname, csvData, function(fileErr) {
        if(fileErr) {
          return console.log(fileErr);
        }
      });
    }
  });
}

// This puts the unique count for each ec2InstanceType into usageData[]
var recordUniqueCount = function(name, begin, usageCount) {
  // Get the usage object
  var usage = usageData[name];
  if (usage == null) {
    usage = { 'ec2InstanceType': name };
    usage[begin] = usageCount;
  } else {
    if (usage[begin] == null) {
      usage[begin] = usageCount;
    } else {
      usage[begin] += usageCount;
    }
  }

  usageData[name] = usage;
  // console.log(name + ' usage[' + begin + ']=' + usage[begin]);
}

// Callback from the Insights Query
var queryCb = function(error, response, body) {
  callbackCount++;
  var begin = body.metadata.beginTime;
  begin = begin.substring(0, begin.indexOf('T'));
  beginKeys.push(begin);
  console.log('Got response for begin time: ' + begin);

  // Start with the totalResult (total hosts per hour)
  var totalTS = body.totalResult.timeSeries;
  var runningCount = 0;
  for(var i=0; i<totalTS.length; i++) {
    var totalSlice = totalTS[i];
    var totalCount = totalSlice.results[0].uniqueCount;
    
    // Get the slice for each ec2InstanceType
    runningCount = 0;
    for(var j=0; j < body.facets.length; j++) {
      var facetName = body.facets[j].name;
      var facetCount = body.facets[j].timeSeries[i].results[0].uniqueCount
      recordUniqueCount(facetName, begin, facetCount);
      
      // Keep track of the running count for this timeSlice
      runningCount += facetCount;
    }

    // The difference between runningCount and totalCount is "unknown"
    var unknownCount = totalCount - runningCount;
    recordUniqueCount('unknown', begin, unknownCount);
  }

  // Check if we have all the data
  if (callbackCount == daysOfData) {
    console.log('we got all the responses, ' + callbackCount + ' days of data');
    finalizeUsage();
  }
}

// Helper method to loop over the previous 32 days
var monthlyLoop = function() {
  var d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  
  // Loop through the last 32 days
  for (var i = 1; i <= daysOfData; i++) {
    var startDate = d - (i * msPerDay());
    var endDate = startDate + msPerDay();
    var since = 'SINCE ' + startDate.valueOf() + ' UNTIL ' + endDate.valueOf();
    var nrql = nrqlAWS + ' ' + since;
    console.log('About to call: ' + nrql);
    insights.query(nrql, configId, queryCb);
  }
}

var msPerDay = function() {
  return 24 * 60 * 60 * 1000;
}

monthlyLoop();