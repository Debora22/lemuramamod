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
  const auth = c.get('auth');
  const config = c.get('settings');
  const http = c.get('http');

  return express.Router()
    .get('/tracking/actions',
      auth.ensureCustomerAuthenticated(),
      http.prepareRequestOptions(),
      (req, res, next) => {
        extend(req.httpOptions, {
          method: 'GET',
          uri: `${config.services.adminAPI2.url}/tracking/actions/current_values`,
        });
        next();
      },
      http.proxyRequest(),
      http.writeProxyResults(true)
    )
    .put('/tracking/reset_counters',
      auth.ensureCustomerAuthenticated(),
      http.prepareRequestOptions(),
      (req, res, next) => {
        extend(req.httpOptions, {
          method: 'PUT',
          uri: `${config.services.adminAPI2.url}/tracking/reset_counters`,
          body: req.body,
          json: true
        });
        next();
      },
      http.proxyRequest(),
      http.writeProxyResults()
    );
};
