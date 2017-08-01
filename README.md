# newrelic-api-test-js [![Build Status](https://travis-ci.org/kenahrens/newrelic-api-client-js.svg?branch=master)](https://travis-ci.org/kenahrens/newrelic-api-client-js)
JavaScript library to test connectivity to New Relic API

# How to use
This is just a simple library to test connectivity between NodeJS and New Relic API.

## Initial Setup
Clone the repository and run npm install which should install dependencies into node_modules
```
kahrens@kenbook8u:~/dev/node$ git clone https://github.com/kenahrens/newrelic-api-test-js.git
...
kahrens@kenbook8u:~/dev/node$ cd newrelic-api-test
kahrens@kenbook8u:~/dev/node/newrelic-api-test$ npm install
```

## Setup Your API Keys
This library uses the npm [config](https://www.npmjs.com/package/config) package to setup your [API Keys](https://rpm.newrelic.com/apikeys). There is a basic default.json that shows the 5 keys you can populate, with an account nicknamed *newrelic*:
* accountId - you will also see this in the URL bar
* restKey - overall REST API Key (legacy)
* adminKey - specific Admin user API Key, used for certain API calls
* insightsQueryKey - there are keys just for Insights in the Manage Data section



If you configure Environment Variables those will over-ride the values in default.json.

However you can also make your own JSON config file with multiple accounts in there.

### Environment Variables
Set 4 environment variables to the correct values for your account, this works if you're using a single account. 
* NEWRELIC_ACCOUNT_ID maps to accountId
* NEWRELIC_REST_API_KEY maps to restKey
* NEWRELIC_ADMIN_API_KEY maps to adminKey
* NEWRELIC_INSIGHTS_QUERY_KEY maps to insightsQueryKey

### Multiple Accounts
Here is an example of how to setup a custom JSON file with multiple sets of keys. At runtime you would set NODE_ENV to the name of this config.
```
{
  "MasterAccount": {
    "accountId": "",
    "restKey": "",
    "adminKey": "",
    "insightsQueryKey": ""
  },
  "SubAccount1": {
    "accountId": "",
    "restKey": "",
    "adminKey": "",
    "insightsQueryKey": ""
  },
  "SubAccount2": {
    "accountId": "",
    "restKey": "",
    "adminKey": "",
    "insightsQueryKey": ""
  }
}
```

Then in your code you could make the same API call against multiple accounts (of course you could use a variable or whatever):
```
insights.query(nrql, 'MasterAccount', cb);
insights.query(nrql, 'SubAccount1', cb);
insights.query(nrql, 'SubAccount2', cb);
```

### Partner Account

Gather the PartnerId from your partnership admin console, and the Partner Rest key from the Partnership account.

```
{
  "configArr": [
    "PartnerAccount_name"
  ],
  "PartnerAccount_name": {
    "partnerId": "<PARTNER_ID>",
    "restKey": "<PARNER_RESTKEY>"
  }
}
```

### Execute Tests
You can also run the test cases which is a way to double check things are configured properly.
```
kahrens:newrelic-api-client-js kahrens$ npm test

> newrelic-api-test@0.0.1 test /Users/kahrens/Documents/github/newrelic-api-client-js
> ./node_modules/mocha/bin/mocha



  New Relic API Test
    ✓ calls the applications api (293ms)
    ✓ gets a specific application (183ms)
    ✓ gets the metricNames for a specific application (282ms)
    ✓ gets the metricData for a specific application (225ms)
    ✓ gets the hosts for a specific application (212ms)
    ✓ gets the instances for a specific application (210ms)
    ✓ calls the mobile api (212ms)
    ✓ calls the browser api (412ms)
    ✓ calls the keyTransactions api (178ms)
    ✓ calls the servers api (188ms)
    ✓ calls the usages api for apm (193ms)
    ✓ calls the users api (167ms)
    ✓ calls the plugins api (227ms)
    ✓ gets the component for a specific plugin (292ms)

  New Relic Insights API Test
    ✓ calls the query api (272ms)

  New Relic Synthetics API Test
    ✓ calls the synthetics api (673ms)


  16 passing (4s)
```
