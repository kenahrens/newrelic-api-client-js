# newrelic-api-test-js
JavaScript library to test connectivity to New Relic API

# How to use
This is just a simple library to test connectivity between NodeJS and New Relic API.
* Clone the repository
* > npm install
* You should see request gets installed into node_modules
* Copy _config.json to config.json and supply your API Key [http://rpm.newrelic.com/apikeys]
* > npm test
* You should see a list of your apps and their health status (green, yellow, red, gray)
