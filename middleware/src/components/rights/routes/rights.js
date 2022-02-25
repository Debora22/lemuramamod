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
  const middlewares = [
    auth.ensureCustomerAuthenticated(),
    http.prepareRequestOptions(),
    (req, res, next) => {
      extend(req.httpOptions, {
        method: 'POST',
        uri: `${config.services.adminAPI.url}${req.url}`,
        body: JSON.stringify(req.body),
        json: true
      });
      next();
    },
    http.proxyRequest(),
    (req, res) => {
      let response = res.body;
      let body = {
        data: {},
        metadata: {}
      };
      let status = 200;
      let err = '';

      if (response.meta){
        body.data.error_long_message = body.metadata.message;
        body.metadata = {
          code: response.meta.code,
          message: response.meta.error_message
        };
      } else {
        body.data = response.data;
        body.metadata.code = 200;
      }

      res.status(body.metadata.code).json(body);
    }
  ];

  return express.Router()
  .post('/rm/request', middlewares)
  .post('/rm/bulk-request', middlewares);
};
