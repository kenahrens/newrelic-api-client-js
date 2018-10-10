var config = require('config');

var partnerApi = require('../lib/partners.js');
var helper = require('../lib/helper.js');

var json2csv = require('json2csv');
var fs = require('fs');


// Get all the accounts and apikeys for a partner account, output as CSV


// Write the output file
function outputFile(configId, outputdata){
  var fname= configId+ '_accounts.csv';
  console.log("Outputing file... "+fname);
  var input= {
    data: outputdata,
    fields: ['id','name','status','subscriptionStarts','subscriptionExpires']
  };
  json2csv(input, function(err, csv) {
    if (err) {
      console.log('ERROR!');
      console.log(err);
    } else {
      fs.writeFileSync(fname,csv);
    }
  });
}
    
function parseAccounts(configId, accountInfo) {
  var outputArr = [];

  console.log("Getting Admin Information...");
  for (i in accountInfo){
    var account = accountInfo[i];
    var row = {
      id: account.id,
      name: account.name,
      status: account.status,
      subscriptionStarts: account.subscription.starts_on,
      subscriptionExpires: account.subscription.expires_on
    }
    outputArr.push(row);
  }

  // Write the output file
  outputFile(configId, outputArr);
}

// Get the list of partners
var partnerList = config.get('configArr');
partnerList.forEach(function (configId){

  partnerName = configId;
  // var partnerId= config.get(configId).partnerId;
  console.log("Processing Config: " + configId);

  partnerApi.list(1, configId, function(error, response, body) {
    var handledBody = helper.handleCB(error, response, body);
    if(handledBody != null) {
      parseAccounts(configId, body.accounts);
    }
  });
});
