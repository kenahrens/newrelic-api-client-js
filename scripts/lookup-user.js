const config = require('config');

var api = require('../lib/api.js');
var helper = require('../lib/helper.js');
var program = require('commander');

var email = null;
var userUrl = 'https://account.newrelic.com/accounts/{accountId}/users/{userId}'

function printUrl(configId, userId) {
  var accountId = config.get(configId + '.accountId');
  var parsedUrl = userUrl
    .replace('{accountId}', accountId)
    .replace('{userId}', userId);
  console.log(parsedUrl);
}

function parseResponse(configId, handledBody) {
  if (handledBody != null) {
    var userList = handledBody.users;
    userList.forEach(function(user) {
      if (user.email == program.email) {
        printUrl(configId, user.id);
      }
    })
  }
}

function getUserListFrom(configId) {
  // console.log('Searching:', configId);
  api.users.list(null, configId, function getUserCB(error, response, body) {
    var handledBody = helper.handleCB(error, response, body);
    parseResponse(configId, handledBody);
  });
}

////////////////////////////////////////////////////////////////////////////////
console.log('Lookup user helper tool');

program
  .version('0.0.1')
  .description('get direct links to users')
  .option('--email [email]', 'User\'s email address to look for')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
} else {
  if (program.email) {
    
    var cfgList = config.get('configArr');
    console.log('Searching for user:', program.email, 'across', cfgList.length, 'accounts.');

    // Get the list of configs
    cfgList.forEach(function(configId) {
      getUserListFrom(configId);
    });
  }
}