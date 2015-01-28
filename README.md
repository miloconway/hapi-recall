# hapi-recall
[hapi's](https://www.npmjs.com/package/hapi) router module, [call](https://www.npmjs.com/package/call), parses a path and extract the params from a matching path. This module does the inverse: given a `hapi` path and a query object representing the path params, return a formatted path

# To use
```
var hapiRecall = require('hapi-recall');

hapiRecall('/{foo}', {foo:'bar'}); // => '/bar'
hapiRecall('/{foo}/literal/{buzz}', {foo:'bar',buzz:'bee'}); // => '/bar/literal/bee'
```
