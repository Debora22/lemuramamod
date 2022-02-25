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
  .all('/data/internal*',
    auth.ensureCustomerAuthenticated(),
    http.prepareRequestOptions(),
    (req, res, next) => {
      req.url = req.url.replace(/data\//, '');
      extend(req.httpOptions, {
        method: req.method.toUpperCase(),
        uri: `${config.services.anafrus.url}${req.url}`,
      });
      if (req.body) {
        extend(req.httpOptions, {
          body: JSON.stringify(req.body),
          json: true
        });
      }
      next();
    },
    http.proxyRequest(),
    http.writeProxyResults()
  );
};
