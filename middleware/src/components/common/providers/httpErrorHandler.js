'use strict';

const httpError = (err, req, res, next) => {
  let status = err.status || err.statusCode || 500;
  res.status(status).json({
    metadata: {
      status: status,
      error: (status === 401) ? 'Unauthorized' : err.message
    },
    data: (err.error) ? err.error.data : null,
  });
};

module.exports = {
  register: (c) => {
    c.set('httpErrorHandler', {
      http: httpError
    });
  }
};
