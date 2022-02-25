'use strict';
// TODO implement AuthenticationError as providers
// to be consumed on core/routes/badrequest.js#21

class AuthenticationError extends Error {
  constructor(message, status) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'AuthenticationError';
    this.message = message;
    this.statusCode = status || 401;
  }
}

module.exports = AuthenticationError;
