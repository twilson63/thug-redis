var redis = require('redis');

module.exports = function(config) {
  if (!config) { config = {port: null, host: null, options: null}; }
  var client = redis.createClient(config.port, config.host, config.options);
  //var client = redis.createClient();
  var namespace = config.namespace || 'default';
  return {
    read: function(id, cb) {
      if (id !== 'new') {
        client.get(namespace + ":" + id, function(err, obj) {
          cb(JSON.parse(obj));
        });
        return;
      }
      cb({});
    },
    write: function(id, doc, cb) {
      if (id === 'new' && !doc.id) { return cb(['key required!']); }
      if (id === 'new') { id = doc.id }
      client.set(namespace + ":" + id, JSON.stringify(doc), function(err, obj) {
        if(!err) { cb(doc) };
      });
    },
    remove: function(id, doc, cb) {
      client.del(namespace + ":" + id, function(err, obj){
        cb('OK');
      });
    },
    seed: function(field, value) {
      client.set(namespace + ':counters:' + field, value);
    },
    counter: function(field) {
      var key = namespace + ':counters:' + field;
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