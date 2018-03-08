var api = require('./lib/api.js');
var insights = require('./lib/insights.js');
var synthetics = require('./lib/synthetics.js');
var partners = require('./lib/partners.js');
var dashboards = require('./lib/dashboards.js');
var alerts = require('./lib/alerts.js');
var helper = require('./lib/helper.js');

module.exports = {
  api: api,
  insights: insights,
  synthetics: synthetics,
  partners: partners,
  dashboards: dashboards,
  alerts: alerts,
  helper: helper
}
