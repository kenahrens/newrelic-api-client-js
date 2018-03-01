const config = require('config');

var api = require('../lib/api.js');
var helper = require('../lib/helper.js');

var json2csv = require('json2csv');
const fs = require('fs');

// Get all the users for an account, output as CSV
var totalAccountCount = 0;
var currentAccountCount = 0;
var userArr = [];

function toCSV() {
  var input = {
    data: userArr,
    fields: ['accountId', 'userId', 'first_name', 'last_name', 'email', 'role']
  }
  json2csv(input, function(err, csvData) {
    if (err) {
      console.log('ERROR!');
      console.log(err);
    } else {
      var fname = 'users-' + (new Date).getTime() + '.csv';
      console.log('Writing user list to: ' + fname);
      fs.writeFile(fname, csvData, function(fileErr) {
        if(fileErr) {
          return console.log(fileErr);
        }
      });
    }
  });
}

function parseResponse(configId, handledBody) {
  // Lookup the accountId
  var accountId = config.get(configId + '.accountId');
  
  // Make sure we got a valid response
  if (handledBody != null) {
    var userList = handledBody.users;
    userList.forEach(function(user) {
      user.accountId = accountId;
      user.userId = user.id;
      userArr.push(user);
    });
  }

  // Check if we got all counts
  if (currentAccountCount == totalAccountCount) {
    toCSV();
  }
}

////////////////////////////////////////////////////////////////////////////////
var cfgList = config.get('configArr');
totalAccountCount = cfgList.length;

console.log('Geting users across', totalAccountCount, 'accounts.');
cfgList.forEach(function(configId) {
  api.users.list(null, configId, function(error, response, body) {
    var handledBody = helper.handleCB(error, response, body);
    
    currentAccountCount++;
    parseResponse(configId, handledBody);
  });
});