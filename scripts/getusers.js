var api = require('../lib/api.js');
var config = require('config');
var json2csv = require('json2csv');

// Get all the users for an account, output as CSV

// Users qs:
// - filter[ids]
// - filter[email]
// - page
var qs = null;
api.users.list(qs, function(error, response, body) {
  if(response.statusCode == 200) {
    var input = {
      data: body.users,
      fields: ['id', 'first_name', 'last_name', 'email', 'role']
    }
    json2csv(input, function(err, csv) {
      if (err) {
        console.log('ERROR!');
        console.log(err);
      } else {
        console.log(csv);
      }
    })
  }
});