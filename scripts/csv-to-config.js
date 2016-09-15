// Dependencies
const Converter = require('csvtojson').Converter;
const fs = require('fs');

var csv2json = new Converter({});
var program = require('commander');

// This starts with a default that may be over-ridden
var outputFile = './config/output';

// Setup the CSV parsing logic
csv2json.on('end_parsed', function(csvArr) {
  var outputConfig = {};
  outputConfig.configArr = [];
  
  // Loop through the data from the csv
  for (var i = 0; i < csvArr.length; i++) {
    var account = csvArr[i];
    var name = account.accountName;
    delete account.accountName;
    
    // Put the account name to configArr[] and tack on the output
    if (name != null) {
      outputConfig.configArr.push(name);
      outputConfig[name] = account;
    }
  }

  // Save the result config object
  var fname = outputFile + (new Date).getTime() + '.json';
  var outputString = JSON.stringify(outputConfig, null, 2);
  fs.writeFile(fname, outputString, function(fileErr) {
    if(fileErr) {
      return console.error(fileErr);
    } else {
      console.log('Wrote output config file: ' + fname);
    }
  }); 
});

// Setup the commander program
program
  .version('0.0.1')
  .option('--csv [file]', 'Location of source CSV file')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
} else {
  // Read the CSV
  if (program.csv) {
    fs.createReadStream(program.csv).pipe(csv2json);
  } else {
    console.error('The --csv option is required.');
  }
  console.log(program.csv);
}