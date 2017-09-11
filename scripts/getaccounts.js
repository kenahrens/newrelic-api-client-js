var config = require('config');
var partnerApi = require('../lib/partners.js');
var json2csv = require('json2csv');
var fs = require('fs');


// Get all the accounts and apikeys for a partner account, output as CSV


// Write the output file
function outputFile(configId,outputdata){
  var fname= configId+ '_accounts.csv';
  console.log("Outputing file... "+fname);
  var input= {
    data: outputdata,
    fields: ['id','name','admin','admin_email','status','apm_url']
  };
  json2csv(input, function(err, csv) {
    if (err) {
      console.log('ERROR!');
      console.log(err);
    } else {
      fs.writeFile(fname,csv);
    }
  });
}
    
function acctFormat(configId, accountInfo, cb) {
  var nr_url = "https://rpm.newrelic.com/accounts/";
  console.log("Getting Admin Information...");
  for (acct in accountInfo){
    accountInfo[acct].admin = accountInfo[acct]["primary admin"].first_name + " " + accountInfo[acct]["primary admin"].last_name;
    accountInfo[acct].admin_email= accountInfo[acct]["primary admin"].email;
    //adding hyperlink to account
    accountInfo[acct].apm_url= "=HYPERLINK(\""+nr_url + accountInfo[acct].id + "/applications\",\""+accountInfo[acct].name+"\")";
    //console.log(accountInfo[acct].apm_url)
  }
  cb(configId,accountInfo);
}

// Get the list of partners
var partnerList = config.get('configArr');
partnerList.forEach(function (configId){

  partnerName = configId;
  // var partnerId= config.get(configId).partnerId;
  console.log("Processing Config: " + configId);

  partnerApi.list(configId, function(error, response, body) {
    if(response.statusCode == 200) {
      acctFormat(configId,body.accounts,outputFile);
    }
    else {
      console.log('error: '+ response.statusCode);
      console.log(body);
    }
  });
});
