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
  .post('/users/blacklist',
    auth.ensureCustomerAuthenticated(),
    http.prepareRequestOptions(),
    (req, res, next) => {
      extend(req.httpOptions, {
        method: 'POST',
        uri: `${config.services.adminAPI2.url}/users/blacklist`,
        body: JSON.stringify(req.body),
        json: true
      });
      next();
    },
    http.proxyRequest(),
    http.writeProxyResults()
  );
};
