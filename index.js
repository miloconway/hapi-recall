var call = require('call');
var Router = call.Router;
var RecallError = require('./lib/recall-error');

var callRouter = new Router({});

function isUndefined(val) {
  return typeof val === 'undefined';
}

function isString(val) {
  return typeof val === 'string';
}

function prepQueryForConsume(query) {
  var preppedQuery = {};

  for (var k in query) {
    var v = query[k];

    if (isString(v)) {
      preppedQuery[k] = {
        parts: v.split('/'),
        index: 0
      };
    }
  }

  return preppedQuery;
}

function hapiRecall(path, query) {
  if (typeof path !== 'string' || path.length < 1) {
    throw new RecallError('path must not be empty');
  }

  var preppedQuery = prepQueryForConsume(query || {});
  var analysis = callRouter.analyze(path);
  var params = analysis.params;
  var segments = analysis.segments;

  var pathParts = [];
  var nonLiteralIndex = 0;

  for (var i = 0; i < segments.length; i++) {
    var seg = segments[i];

    if (!isUndefined(seg.literal)) {
      pathParts.push(seg.literal);
    } else {
      var paramName = params[nonLiteralIndex];
      var prepped = preppedQuery[paramName];

      if (seg.empty && !prepped) {
        continue;
      }

      if (!prepped) {
        throw new RecallError(paramName + ' must be defined');
      }

      var queryVal = prepped.parts[prepped.index++];

      if (isUndefined(queryVal)) {
        throw new RecallError(paramName + ' does not have enough segments');
      }

      if (seg.mixed) {
        var spliceStart = 0;
        var mixedSegments = seg.segments;

        if (!seg.first) {
          spliceStart = 1;
        }

        mixedSegments.splice(spliceStart, 0, queryVal);

        queryVal = mixedSegments.join('');
      }

      pathParts.push(queryVal);

      if (seg.wildcard) {
        while (prepped.index < prepped.parts.length) {
          pathParts.push(prepped.parts[prepped.index++]);
        }
      }

      nonLiteralIndex += 1;
    }
  }

  return '/' + pathParts.join('/');
}

module.exports = hapiRecall;
