# newrelic-api-test-js
JavaScript library to test connectivity to New Relic API

# How to use
This is just a simple library to test connectivity between NodeJS and New Relic API.
* Clone the repository
* > npm install
* You should see request gets installed into node_modules
* Set 2 environment variables to the correct values for your account:
  * NEWRELIC_ACCOUNT_ID
  * NEWRELIC_REST_API_KEY
* > npm test
* You should see a list of your apps and their health status (green, yellow, red, gray)

```
kahrens:newrelic-api-test-js kahrens$ npm test

> newrelic-api-test@0.0.1 test /Users/kahrens/Documents/github/newrelic-api-test-js
> node ./index.js

Wordpress Test(5576440) is green
Express Test(8468007) is green
Drupal7 Test(9234209) is green
MEAN Cloud Dev(10139448) is green
Tomcat7(10554099) is green
Spray Can Test(11591002) is gray
New Relic Travel Local(12492455) is gray
```
