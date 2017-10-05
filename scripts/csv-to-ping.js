const synthetics = require('../lib/synthetics.js');
const helper = require('../lib/helper.js');
const config = require('config');
const fs = require('fs');
var program = require('commander');
const Converter = require('csvtojson').Converter;

// Global variables
var csvReader = new Converter({});
var locationArr = [];

// This will put in default values for (assumes name and uri provided)
// type - SIMPLE (aka ping)
// frequency - 15
// locations - all public locations
// status - ENABLED
// slaThreshold - 7.0
// options - NONE
var fixMonitorBody = function fixMonitorBody(monitorBody) {
  if (monitorBody == null || monitorBody.name == null || monitorBody.uri == null) {
    console.error('Monitor must have name and uri!');
    return null;
  }
  if (monitorBody.type == null) {
    monitorBody.type = 'SIMPLE';
  }
  if (monitorBody.frequency == null) {
    monitorBody.frequency = 15;
  }
  if (monitorBody.locations == null) {
    monitorBody.locations = locationArr;
  }
  if (monitorBody.status == null) {
    monitorBody.status = 'ENABLED';
  }
  if (monitorBody.slaThreshold == null) {
    monitorBody.slaThreshold = 7.0;
  }
  return monitorBody;
}

// Setup the CSV parsing logic
csvReader.on('end_parsed', function(csvArr) {
  
  // Loop through the list adding other required columns
  console.log('Read', csvArr.length, 'rows from the CSV file.');
  for (var i=0; i < csvArr.length; i++) {
    var monitorBody = fixMonitorBody(csvArr[i]);
    if (monitorBody != null) {
      synthetics.createMonitor(monitorBody, program.dest, function createCB(error, response, body) {
        if (!error && response.statusCode == 201) {
          console.log('Created:', response.headers.location);
        } else {
          if (error) {
            console.error('error:', error);
          } else {
            console.error('bad status code:', response.statusCode);
            console.error(body);
          }
        }
      });
    }
  }
});

// Setup the commander program
program
  .version('0.0.1')
  .option('--dest [account]', 'Destination account where monitors are created')
  .option('--csv [file]', 'Location of source CSV file')
  .parse(process.argv);

if (!process.argv.slice(4).length) {
  program.outputHelp();
} else {
  if (program.csv && program.dest) {

    // Go fetch the full list of locations
    console.log('Getting list of locations from:', program.dest);
    synthetics.getLocations(program.dest, function syntheticsCB(error, response, body) {
      var rspBody = helper.handleCB(error, response, body);
      if (rspBody != null) {
    
        // Put the public locations into the locations array
        for (var i=0; i < rspBody.length; i++) {
          var loc = rspBody[i];
          if (!loc.private) {
            locationArr.push(loc.name);
          }
        }
        
        // Now that we have the locations, read the file
        console.log('There are', locationArr.length, 'locations.');
        console.log('Reading file:', program.csv);
        fs.createReadStream(program.csv).pipe(csvReader);
      }
    });
  } else {
    console.error('The --csv and --dest options are required.');
  }
}