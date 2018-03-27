// Get all the users for an account, output as CSV

const config = require('config');

var api = require('../lib/api.js');
var helper = require('../lib/helper.js');

var json2csv = require('json2csv');
const fs = require('fs');

// Script-wide variables
var cfgList = config.get('configArr');
var totalAccountCount = cfgList.length;
var currentAccountCount = 0;
var userArr = [];

function makeFields() {
  
  // Standard fields
  var fieldArr = ['userId', 'first_name', 'last_name', 'email'];
  
  // Add 1 field {accountId}_role
  for (var i=0; i < cfgList.length; i++) {
    var configId = cfgList[i];
    var accountId = config.get(configId + '.accountId');
    var colName = accountId + '_role';
    fieldArr.push(colName);
  }
  return fieldArr;
}

function toCSV() {
  
  // Setup the input
  var input = {
    data: userArr,
    fields: makeFields()
  }

  // Store the CSV
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

function parseUser(user, accountId) {
  // Lookup the user
  var newUser = userArr[user.id];
  if (newUser == null) {
    newUser = {
      userId: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    }
  }

  // Add this accountId role
  var colName = accountId + '_role';
  newUser[colName] = user.role;

  // Add the new user to the array
  userArr[newUser.userId] = newUser;
}

function parseResponse(configId, handledBody) {
  // Lookup the accountId
  var accountId = config.get(configId + '.accountId');
  
  // Make sure we got a valid response
  if (handledBody != null) {
    var userList = handledBody.users;
    console.log('Parsing', userList.length, 'users for', configId);
    for (var i=0; i < userList.length; i++) {
      var user = userList[i];
      parseUser(user, accountId);
    }
  }

  // Check if we got all counts
  if (currentAccountCount == totalAccountCount) {
    toCSV();
  }
}

////////////////////////////////////////////////////////////////////////////////
console.log('Geting users across', totalAccountCount, 'accounts.');
cfgList.forEach(function(configId) {
  api.users.list(null, configId, function(error, response, body) {
    var handledBody = helper.handleCB(error, response, body);
    
    currentAccountCount++;
    parseResponse(configId, handledBody);
  });
});