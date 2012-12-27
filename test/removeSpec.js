var Thug = require('thug');
var thugRedis = require('../');
var assert = require('assert');
var redis = require('redis');
var client = redis.createClient();

describe('redis remove', function(){
  var obj = { name: 'foo', value: 'bar', colors: ['red','1',2]};
  var db = thugRedis({namespace: 'bar', port: null, host: null, options: null})
  var foo = new Thug();
  foo.constructor.prototype.remove = db.remove;
  before(function(done) {
    client.set('bar:1', JSON.stringify(obj))
    done();
  });
  it('should be successful', function(done) {
    foo.del(1, function(resp) {
      assert.ok(resp === 'OK');
      done();
    });
  });
});