const alerts = require('../lib/alerts.js');
const helper = require('../lib/helper.js');
const config = require('config');
var program = require('commander');

// List of policies
var policyArr = [];
var currentPolicyNum = 0;

// Handle callback from adding channel to policy
var updateCB = function(error, response, body) {
  var updateBody = helper.handleCB(error, response, body);
  currentPolicyNum++;
  if (updateBody != null) {
    console.log('SUCCESS');
  }
  updateNextPolicy();
}

// This function will update the next policy in the array
// We do it so the updates are done sequentially
var updateNextPolicy = function() {
  if (currentPolicyNum < policyArr.length) {
    var policy = policyArr[currentPolicyNum];
    var policyId = policy.id;
    console.log('Adding channel (' + program.channelId + ') to policy: ' + policy.name + '(' + policy.id + ')');
    alerts.policyChannels.update(policyId, program.channelId, program.accountName, updateCB);
  } else {
    console.log('Done updating policies');
  }
}

// Loop through the list of policies
var readPolicies = function(error, response, body) {
  var policyBody = helper.handleCB(error, response, body);
  if (policyBody != null) {
    policyArr = policyBody.policies;
    updateNextPolicy();
  }
}

// Read the list of channels to confirm the desired channel is there
var readChannels = function(error, response, body) {
  var channelBody = helper.handleCB(error, response, body);
  if (channelBody != null) {
    var found = false;
    for (var i=0; i < channelBody.channels.length; i++) {
      var channel = channelBody.channels[i];
      var id = channel.id;
      if (id == program.channelId) {
        console.log('Found channel: ' + channel.name + '(' + id + ')');
        alerts.policies.list(null, program.accountName, readPolicies);
        found = true;
      }
    }

    // If the channel was not found was there a typo?
    if (!found) {
      console.error('Your channel: ' + program.channelId + ' was not found.');
    }
  }
}

// Setup the commander program
program
  .version('0.0.1')
  .option('--channelId [channelId]', 'Alerts channel you want to add to all policies')
  .option('--accountName [accountName]', 'Account name from config file')
  .parse(process.argv);

if (!process.argv.slice(5).length) {
  program.outputHelp();
} else {
  // Make sure [from] is in the config
  if (!config.has(program.accountName)) {
    console.error('Your config does not have *account* account: ' + program.accountName);
  } else {
    // We have good data so try to read the dashboard
    console.log('Trying to confirm you have channelId: ' + program.channelId);
    alerts.channels.list(program.accountName, readChannels);
  }
}