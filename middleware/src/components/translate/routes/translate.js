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
  .post('/translate/*',
    auth.ensureUserAuthenticated(),
    (req, res, next) => {
      req.query.key = config.services.google.translate.apiKey;
      req.query.q = req.body.params.q;
      req.query.target = req.body.params.target;
      req.httpOptions = {
        method: 'GET',
        uri: `${config.services.google.translate.url}/language/translate/v2`,
        qs: req.query
      };
      next();
    },
    http.proxyRequest(),
    http.writeProxyResults()
  );
};
