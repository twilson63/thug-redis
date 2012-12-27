var Thug = require('thug');
var thugRedis = require('../');
var assert = require('assert');
var redis = require('redis');
var client = redis.createClient();

describe('redis read', function(){
  var obj = { name: 'foo', value: 'bar', colors: ['red','1',2]};
  var db = thugRedis({namespace: 'bar', port: null, host: null, options: null})
  var foo = new Thug();
  foo.constructor.prototype.read = db.read;
  before(function(done) {
    client.set('bar:1', JSON.stringify(obj))
    done();
  });
  it('should be successful', function(done) {
    foo.get(1, function(doc) {
      assert.deepEqual(obj, doc);
      done();
    });
  });
  after(function(done) {
    client.del('bar:1');
    done();
  })
});