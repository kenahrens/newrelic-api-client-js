// Generic helper to process request() callback

var helper = {};

helper.handleCB = function handleCB(error, response, body) {
  if (!error && response.statusCode === 200) {
    return body;
  } else {
    console.log('API Error!');
    if (error) {
      throw(error);
    } else {
      throw(new Error(body));
    }
  }
}

module.exports = helper;