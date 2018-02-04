const synthetics = require('../lib/synthetics.js');
const helper = require('../lib/helper.js');
const config = require('config');
const fs = require('fs');
var program = require('commander');
const Converter = require('csvtojson').Converter;

// Global variables
var csvReader = new Converter({});
var monitorArr = [];

// Setup the CSV parsing logic
csvReader.on('end_parsed', function(csvArr) {
  
  // Loop through the list adding other required columns
  console.log('Read', csvArr.length, 'rows from the CSV file.');
  for (var i=0; i < csvArr.length; i++) {
    var csvName = csvArr[i].name;
    var monitorId = matchName(csvName);
    if (monitorId != 0) {
      // console.log('This monitor should be deleted', monitorId);

      synthetics.deleteMonitor(monitorId, program.dest, function deleteCB(error, response, body) {
        var rspBody = helper.handleCB(error, response, body);
        console.log(monitorId, 'deleted');
      });
    }
  }
});

var matchName = function(csvName) {
  for (var i=0; i < monitorArr.length; i++) {
    var monitor = monitorArr[i];
    var monitorName = monitor.name;
    // console.log('Compare', monitorName,'to',csvName);
    if (monitorName == csvName) {
      return monitor.id;
    }
  }
  return 0;
}

// Setup the commander program
program
  .version('0.0.1')
  .option('--dest [account]', 'Destination account where monitors are cleaned')
  .option('--csv [file]', 'Location of source CSV file')
  .parse(process.argv);

if (!process.argv.slice(4).length) {
  program.outputHelp();
} else {
  if (program.csv && program.dest) {

    // Get the list of all monitors
    synthetics.getAllMonitors(program.dest, function syntheticsCB(error, response, body) {
      var rspBody = helper.handleCB(error, response, body);
      if (rspBody != null) {
    
        // Put the public locations into the locations array
        monitorArr = rspBody.monitors;
        console.log('Got the ids for', monitorArr.length, 'monitors.');
        
        // Now that we have the locations, read the file
        console.log('Reading file:', program.csv);
        fs.createReadStream(program.csv).pipe(csvReader);
      }
    });
  } else {
    console.error('The --csv and --dest options are required.');
  }
}