var insights = require('../lib/insights.js');
var config = require('config');
var fs = require('fs');

var configId = config.get('configArr')[0];

// This is the base nrql query
var baseNrql = "SELECT count(*) FROM SyntheticCheck WHERE result = 'FAILED' ";

// If you want to filter on specific monitors or locations modify this variable
var filter = " WHERE ( monitorName like 'IDS%Production' AND location ='AWS_US_EAST_1' ) ";

// Number of hour time segments that have a deeper investigation
totalHourlyCount = 0;
currentHourlyCount = 0;

// This has a list of the outage details
var outageList = {};

// This is the last thing called, it will print out the outage details
var processOutageList = function() {
  console.log('Analysis finished, this many hours had an outage: ' + totalHourlyCount);
  
  var csvOutput = 'Start Time,End Time,Monitor List';

  // Loop through the list of outage data
  var keys = Object.keys(outageList);
  for (var i = 0; i < keys.length; i++) {
    var beginTimeSeconds = keys[i];
    var monitorList = outageList[beginTimeSeconds];
    var beginDate = new Date(beginTimeSeconds * 1000);
    var endTimeSeconds = parseInt(beginTimeSeconds) + 60;
    var endDate = new Date(endTimeSeconds * 1000);
    var row = beginDate + ',' + endDate + ',' + monitorList;
    csvOutput = csvOutput + '\n' + row;
  }
  
  // Write out the outage report
  var fname = 'outages-' + (new Date).getTime() + '.csv';
  fs.writeFile(fname, csvOutput, function(fileErr) {
    if(fileErr) {
      return console.error(fileErr);
    } else {
      console.log('Wrote file: ' + fname);
    }
  });
}

// This helper function will find 1 minute times when a monitor failed
var processFacet = function(facet) {
  var monitorName = facet.name;
  var tsArr = facet.timeSeries;

  // This has the minute-by-minute results for this monitor
  for (var j = 0; j < tsArr.length; j++) {
    var ts = tsArr[j];
    var count = ts.results[0].count;
    if (count > 0) {
      var outage = outageList[ts.beginTimeSeconds];
      if (outage == null) {
        outage = [monitorName];
      } else {
        outage.push(monitorName);
      }
      outageList[ts.beginTimeSeconds] = outage;
    }
  }
}

// Second pass looks into a specific hour, getting the exact monitors that failed
var hourlyQuery = function(beginTimeSeconds, endTimeSeconds) {
  var hourlySinceUntil = "SINCE " + beginTimeSeconds + " UNTIL " + endTimeSeconds;
  var hourlyDetail = " FACET monitorName TIMESERIES 1 minute ";
  var hourlyPassNrql = baseNrql + filter + hourlySinceUntil + hourlyDetail;
  insights.query(hourlyPassNrql, configId, function(error, response, body) {
    if (response.statusCode == 200) {
      var facetArr = body.facets;

      // There is a facet for each monitorName
      for (var i = 0; i < facetArr.length; i++) {
        var facet = facetArr[i];
        processFacet(facet);
      }
    } else {
      console.error('Insights hourly query error: ' + response.statusCode);
      console.error(body);
    }
    
    currentHourlyCount++;
    if (currentHourlyCount == totalHourlyCount) {
      processOutageList();
    }
  })
}

// First pass will look over a long period of time in 1 hour chunks
var firstPass = function(firstPassNrql) {
  console.log('Starting first pass');
  insights.query(firstPassNrql, configId, function(error, response, body) {
    if (response.statusCode == 200) {
      var tsArr = body.timeSeries;
      for (var i = 0; i < tsArr.length; i++) {
        var ts = tsArr[i];
        var count = ts.results[0].count;
        // Only do a deeper query on that 1 hour chunk of time if there are failures 
        if (count > 0) {
          hourlyQuery(ts.beginTimeSeconds, ts.endTimeSeconds);
          totalHourlyCount++;
        }
      }
    } else {
      console.error('Insights query error: ' + response.statusCode);
      console.error(body);
    }
  });
}

// First pass will look at last 2 weeks of data
var firstPassSince = " SINCE 15 days ago TIMESERIES 1 hour";

// This will kick off the script
var firstPassNrql = baseNrql + filter + firstPassSince;
firstPass(firstPassNrql);