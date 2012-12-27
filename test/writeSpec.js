var Thug = require('thug');
var thugRedis = require('../');
var assert = require('assert');
var redis = require('redis');
var client = redis.createClient();

describe('redis write', function(){
  var db = thugRedis({namespace: 'bar', port: null, host: null, options: null})
  var foo = new Thug();
  foo.constructor.prototype.write = db.write;
  foo.constructor.prototype.read = db.read;
  before(function(done) {
    done();
  });
  it('should be successful', function(done) {
    var obj = { name: 'foo', value: 'bar', colors: ['red','1',2]};
    foo.set(1, obj, function(e, doc) {
      client.get('bar:1', function(e, s){
        assert.deepEqual(obj, JSON.parse(s));
        done();
      })
    });
  });
  it('should create error', function(done) {
    var obj = { name: 'foo', value: 'bar', colors: ['red','1',2]};
    foo.set("new", obj, function(e, doc) {
      //console.log(doc[0]);
      assert.ok(doc[0] === 'key required');
      done();
    });
  });
  after(function(done) {
    client.del('bar:1');
    done();
  })
});