const dashboards = require('../lib/dashboards.js');
const helper = require('../lib/helper.js');
const config = require('config');
var program = require('commander');

var nrqlCheck;

var checkNrql = function(widget, dashId) {
  // Should be an arry of nrqls
  var widgetId = widget.widget_id;
  
  // It's possible there's no nrql for other kinds of widgets
  widget.data.forEach(item => {
    var nrql = item.nrql;
    if (nrql != null) {
      var nrqlLower = nrql.toLowerCase();
      if (nrqlLower.indexOf(nrqlCheck) != -1) {
        console.log('Found nrql to fix on dashboard', dashId, 'widget', widgetId, nrql);
      }
    } else {
      // console.log('Null value for dashboard', dashId, 'widget', widgetId);
    }
  });
}

var handleShow = function(error, response, body) {
  var rspBody = helper.handleCB(error, response, body);
  if (rspBody != null) {
    // Get the nrql for each widget
    var dashId = rspBody.dashboard.id;
    rspBody.dashboard.widgets.forEach(widget => {
      checkNrql(widget, dashId);
    });
  }
}

var handleList = function(error, response, body) {
  var rspBody = helper.handleCB(error, response, body);
  if (rspBody != null) {
    // Get the dashboard body for each dashboard
    console.log('There are', rspBody.dashboards.length, 'dashboards');
    rspBody.dashboards.forEach(dash => {
      dashboards.getOne(dash.id, program.src, handleShow);
    });
  }
}

// Setup the commander program
program
  .version('0.0.1')
  .option('--src [account]', 'Source account where the dashboard should be created')
  .option('--nrql [nrql]', 'NRQL snippet to find in all dashboards')
  .parse(process.argv);

if (!process.argv.slice(5).length) {
  program.outputHelp();
} else {
  // Make sure [from] is in the config
  if (!config.has(program.src)) {
    console.error('Your config does not have *src* account: ' + program.src);
  } else {
    // Start by getting a list of all the dashboards
    nrqlCheck = program.nrql.toLowerCase();
    dashboards.list(program.src, handleList);
  }
}