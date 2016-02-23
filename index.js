var api = require('./api.js');

// Callback
var callback = function(error, response, body) {
  if (!error && response.statusCode == 200) {
    var applications = body.applications;
    for(var i=0; i < applications.length; i++) {
      var app = applications[i];
      var id = app.id;
      var name = app.name;
      var health = app.health_status;

      console.log(name + '(' + id + ') is ' + health);
    }
  }
}

// Read config file
api.applicationList(callback);
