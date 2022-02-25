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
  const http = c.get('http');
  const timeTracking = c.get('timeTracking');
  const config = c.get('settings');

  /**
   * Get user data and session id from the HTTP request.
   * @param Object req HTTP Request.
   * @returns Object with user data and session id.
   */

  return express.Router()
    .get('/tracking/time',
      auth.ensureCustomerAuthenticated(),
      http.prepareRequestOptions(),
      (req, res, next) => {
        extend(req.httpOptions, {
          method: 'GET',
          uri: `${config.services.adminAPI2.url}/tracking/time/current_values`
        });
        next();
      },
      http.proxyRequest(),
      http.writeProxyResults(true)
    )
    .post('/tracking/time/:eventType(start|pause|resume|stop|keepalive)',
      auth.ensureCustomerAuthenticated(),
      http.prepareRequestOptions(),
      (req, res, next) => {
        extend(req.httpOptions, {
          method: 'POST',
          uri: `${config.services.adminAPI2.url}/tracking/time/event`,
          body: timeTracking.createMessage(req.params.eventType),
          json: true,
        } );
        next();
      },
      http.proxyRequest(),
      http.writeProxyResults(true)
    );
};
