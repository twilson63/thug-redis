var redis = require('redis');

module.exports = function(config) {
  if (!config) { config = {port: null, host: null, options: null}; }
  var client = redis.createClient(config.port, config.host, config.options);
  //var client = redis.createClient();

  return {
    seed: function(field, value) {
      client.set('counters:' + field, value);
    },
    counter: function(field) {
      var key = 'counters:' + field;
      return function(doc, next) {
        // if value is not set
        if (!doc[field]) {
          client.incr(key, function(error, value) {
            if (error) { console.log(error); doc[field] = -1; return next(doc); }
            doc[field] = value;
            next(doc);
          });
        } else {
          next(doc);
        }
      }
    }

  }
}