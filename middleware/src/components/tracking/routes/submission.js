'use strict';
const express = require('express');
const extend = require('extend');
let getRouter;

module.exports = {
  register: (c) => {
    c.extend('routes', (routes) => {
      routes.push(getRouter(c));
      return routes;
    });
  }
};

getRouter = (c) => {
  const config = c.get('settings');
  const submission = c.get('submission');
  const auth = c.get('auth');
  const http = c.get('http');

  return express.Router()
    .post('/tracking/submission',
      auth.ensureCustomerAuthenticated(),
      http.prepareRequestOptions(),
      (req, res, next) => {
        // This endpoint returns all the tracking values to be sent to ModerationReportingService, it takes
        // into account the values automatically tracked and also the values sent in this request which
        // are those submitted by the user
        extend(req.httpOptions, {
          method: 'POST',
          uri: `${config.services.adminAPI2.url}/tracking/submittion`,
          body: JSON.stringify({
            submitted_data: req.body,
          }),
          json: true
        });
        next();
      },
      http.proxyRequest(),
      (req, res, next) => {
        const validationError = submission.validateSubmission(res.body.data);
        if (validationError) {
          res.status(validationError.status).send(validationError.message);
        } else {
          req.body = res.body.data;
          next();
        }
      },
      http.prepareRequestOptions(),
      (req, res, next) => {
        extend(req.httpOptions, {
          method: 'POST',
          uri: `${config.services.submission.url}/submissions`,
          body: JSON.stringify(req.body),
          json: true
        });
        next();
      },
      http.proxyRequest(),
      http.writeProxyResults()
    );
};
