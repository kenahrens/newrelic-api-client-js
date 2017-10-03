const alerts = require('../lib/alerts.js');
const insights = require('../lib/insights.js');
const helper = require('../lib/helper.js');
const config = require('config');
var program = require('commander');

// Items to configure
var eventType = 'AlertIncidents';
var integrationName = 'com.adg.alertIncidents';
var protocolVersion = 1;
var integrationVersion = '1.0.0';

// Global variables
var latestIncident = 0;
var policyArr = [];
var metricArr = [];
// var now = Date.now();

// For a given duration calculate how long it was open
var calcDuration = function(incident) {
  var opened = incident.opened_at;
  var closed = incident.closed_at;
  if (closed == null) {
    return null;
  } else {
    return closed - opened;
  }
}

// For a given id get the name of the policy
var getPolicyName = function(policyId) {
  for (var i=0; i < policyArr.length; i++) {
    var policy = policyArr[i];
    if (policyId == policy.id) {
      return policy.name;
    }
  }
}

// Log the metrics to the console
var logMetrics = function() {
  var fullResponse = {
    'name': integrationName,
    'protocol_version': protocolVersion,
    'integration_version': integrationVersion,
    'metrics': metricArr
  }
  console.log(JSON.stringify(fullResponse));
}

// Handle the callback with the list of incidents
var handleIncidents = function(error, response, body) {
  var rspBody = helper.handleCB(error, response, body);
  if (rspBody != null) {
    // Loop through the incidents
    var incidentArr = rspBody.incidents;
    for (var i=0; i < incidentArr.length; i++) {
      var incident = rspBody.incidents[i];
      
      // Check if the incident is newer than our latest one
      if (incident.id > latestIncident) {
        
        // If duration is null it's still open, skip it
        var duration = calcDuration(incident);
        if (duration != null) {
          // console.log(incident);
          var policyName = getPolicyName(incident.links.policy_id);
          var metric = {
            'event_type': eventType,
            'incidentId': incident.id,
            'opened_at': incident.opened_at,
            'closed_at': incident.closed_at,
            'policyName': policyName,
            'duration': duration,
            'timestamp': incident.closed_at
          }
          metricArr.push(metric);
          // console.log(metric);
        }
      }
    }
    // After looping through all incidents, log the result
    logMetrics();
  }
}

// Handle the callback with the latest alert info from Insights
var handleInsights = function(error, response, body) {
  var rspBody = helper.handleCB(error, response, body);
  if (rspBody != null) {
    var incidentId = rspBody.results[0].latest;
    if (incidentId != null) {
      latestIncident = incidentId;
    }
    // console.log('The latest incidentId is:', latestIncident);
    alerts.incidents.list(false, 1, configId, handleIncidents);
  }
}

// Handle the callback with the list of policies
var handlePolicies = function(error, response, body) {
  var rspBody = helper.handleCB(error, response, body);
  if (rspBody != null) {
    // Save off the list of policies for later
    policyArr = rspBody.policies;

    // Get the latest / newest incident from Insights
    var nrql = 'SELECT latest(incidentId) FROM ' + eventType + ' SINCE 1 day ago';
    insights.query(nrql, configId, handleInsights);
  }
}

// Setup the commander program
program
  .version('0.0.1')
  .option('--src [account]', 'Source account to check for alerts')
  .option('--dest [account]', 'Destination account for the data')
  .parse(process.argv);

// Grab the first configuration
var configArr = config.get('configArr');
var configId = configArr[0];

// First get all the policies (we'll need this info later)
alerts.policies.list(null, configId, handlePolicies);