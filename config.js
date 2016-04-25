// Read the config from environment:'
var config = {
  ACCOUNT_ID: process.env.NEWRELIC_ACCOUNT_ID,
  REST_API_KEY: process.env.NEWRELIC_REST_API_KEY,
  INSIGHTS_QUERY_KEY: process.env.NEWRELIC_INSIGHTS_QUERY_KEY
}

module.exports = config;
