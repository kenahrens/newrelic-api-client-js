var config = require('config');
var api = require('../lib/api.js');
var json2csv = require('json2csv');
var fs = require('fs');

// Get all the accounts and apikeys for a partner account, output as CSV

// Servers qs:
// - filter[name]
// - filter[host]
// - page



function outputFile(outputdata){
    var fname= configId + '_accounts.csv';
    console.log("Outputing file... "+fname);
//    console.log(JSON.stringify(outputdata)); 
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
        //console.log(csv);

      }
    });
}
    
function acctFormat(accountInfo,cb) {
    var nr_url = "https://rpm.newrelic.com/accounts/";
    console.log("Getting Admin Information...");
    for (acct in accountInfo){
        accountInfo[acct].admin = accountInfo[acct]["primary admin"].first_name + " " + accountInfo[acct]["primary admin"].last_name;
        accountInfo[acct].admin_email= accountInfo[acct]["primary admin"].email;
        //adding hyperlink to account
        accountInfo[acct].apm_url= "=HYPERLINK(\""+nr_url + accountInfo[acct].id + "/applications\",\""+accountInfo[acct].name+"\")";
        //console.log(accountInfo[acct].apm_url)

    }
    cb(accountInfo);
}

var configId = config.get('configArr')[0];
var partnerId= config.get(configId).partnerId;
console.log("Processing Config: "+configId +' PartnerID: '+partnerId);
api.partner.list(partnerId, configId, function(error, response, body) {
  if(response.statusCode == 200) {
    acctFormat(body.accounts,outputFile);
  }
  else {
    console.log('error: '+ response.statusCode);
    console.log(body);
  }
});
