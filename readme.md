# thug-redis

A collection of thug filters and validations that leverage redis.

## Example

creates a model counter that starts a 1001.

```
var Thug = require('thug');
var redisDb = require('thug-redis');

module.exports = function(config) {
  var redis = redisDb(config.redis);
  var redis.seed(1000);
  
  var widget = new Thug({
    filters: {
      in: [redis.counter('foo')]
    }
  });
  widget.constructor.read = redis.read;
  widget.constructor.write = redis.write;
  widget.constructor.remove = redis.remove;
  
  return widget;
}
```

TODO

* unique validation
* document grouping
* reds search
