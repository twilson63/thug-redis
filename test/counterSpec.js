var redisFilters = require('../');
var assert = require('assert');
var redis = require('redis');
var client = redis.createClient();

describe('redis counter', function(){
  before(function(done) {
    client.del('counters:test1');
    client.del('counters:test2');
    done();
  });
  it('should start at 0 when no seed', function(done) {
    var foo = redisFilters().counter('test1');
    var doc = {};
    foo(doc, function(doc) {
      assert.ok(doc.test1 === 1, 'should equal 1');
      foo({}, function(doc) {
        assert.ok(doc.test1 === 2, 'should equal 1');
        done();
      });
    });
  });
  it('should start at 1000 when seeded as 1000', function(done) {
    var rfilters = redisFilters()
    rfilters.seed('test2', 1000);
    var foo = rfilters.counter('test2');
    var doc = {};
    foo(doc, function(doc) {
      assert.ok(doc.test2 === 1001, 'should equal 1001');
      foo({}, function(doc) {
        assert.ok(doc.test2 === 1002, 'should equal 1002');
        done();
      });
    });
  });
  it('should only increment if field is not set', function(done) {
    var rfilters = redisFilters()
    rfilters.seed('test2', 1000);
    var foo = rfilters.counter('test2');
    var doc = { test2: 1001 };
    foo(doc, function(doc) {
      assert.ok(doc.test2 === 1001, 'should equal 1001');
      done();
    });
  });
})