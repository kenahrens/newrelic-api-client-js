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
    "PartnerName1", "PartnerName2"
  ],
  "PartnerName1": {
    "partnerId": "<PARTNER1_ID>",
    "restKey": "<PARNER1_RESTKEY>"
  },
  "PartnerName2": {
    "partnerId": "<PARTNER2_ID>",
    "restKey": "<PARNER2_RESTKEY>"
  }
}
```


### Execute Tests
You can also run the test cases which is a way to double check things are configured properly.
```
kahrens:newrelic-api-client-js kahrens$ npm test


> newrelic-api-client@0.1.3 test /Users/kahrens/Documents/github/newrelic-api-client-js
> ./node_modules/mocha/bin/mocha



  New Relic Alerts Test
    ✓ gets the list of alert events (5397ms)
    ✓ gets the list of alert policies (195ms)
    ✓ gets a specific alert policy by name (139ms)
    ✓ gets the notification channels (159ms)
    ✓ gets the first page of incidents (957ms)

  New Relic API Test
    ✓ calls the applications api (193ms)
    ✓ gets a specific application (160ms)
    ✓ gets the metricNames for a specific application (324ms)
    ✓ gets the metricData for a specific application (198ms)
    ✓ gets the hosts for a specific application (202ms)
    ✓ gets the instances for a specific application (244ms)
    ✓ gets the deployments for a specific application (143ms)
    ✓ calls the mobile api (165ms)
    ✓ calls the browser api (343ms)
    ✓ calls the keyTransactions api (145ms)
    ✓ calls the servers api (161ms)
    ✓ calls the usages api for apm (145ms)
    ✓ calls the users api (144ms)
    ✓ calls the plugins api (163ms)
    ✓ calls the plugins api with a GUID filter (177ms)
    ✓ gets a specific plugin (153ms)
    ✓ gets the components for this specific plugin (154ms)

  New Relic Dashboards Test
    ✓ gets the list of all Insights Dashboards (289ms)
    ✓ gets the first page of Insights Dashboards (595ms)
    ✓ gets the first dashboard from the list (266ms)
    ✓ creates a copy of the first dashboard (632ms)
    ✓ updates the title of the copied dashboard (614ms)
    ✓ deletes the copied dashboard (253ms)

  New Relic Insights API Test
    ✓ publishes some sample events (240ms)
    ✓ calls the query api (230ms)

  New Relic Pagination Test
    ✓ lists all plugin components (1638ms)
    ✓ gets a specific component (157ms)

  New Relic Synthetics API Test
    ✓ gets the list of all monitors (538ms)
    ✓ gets the list of locations (158ms)
    ✓ creates a ping monitor (670ms)
    ✓ deletes the ping monitor we just created (614ms)


  36 passing (17s)
```
