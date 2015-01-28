// hapi-recall specific error
'use strict';

function RecallError(message) {
  this.message = message;
  this.stack = Error().stack;
};

RecallError.prototype = Object.create(Error.prototype);
RecallError.prototype.name = 'RecallError';

module.exports = RecallError;
