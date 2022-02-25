'use strict';

const express = require('express');
const AuthenticationError = require(`../../common/providers/authenticationErrorHandler.js`);
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

  return express.Router()
  .post('/auth/api/login',
    (req, res, next) => {
      req.logout();
      next();
    },
    auth.ensureUserAuthenticated(),
    http.prepareRequestOptions(),
    (req, res, next) => {
      extend(req.httpOptions, {
        method: 'POST',
        uri: `${config.services.adminAPI2.url}/tracking/time/event`,
        body: timeTracking.createMessage('start'),
        json: true,
      } );
      next();
    },
    http.proxyRequest(),
    (req, res, next) => {
      res.status(200).send({
          message: 'Session set successfully',
          time_tracking: {
            status: res.status,
            data: res.body.data
          }
      });
    }
  )
  .post('/auth/api/logout',
    auth.ensureUserAuthenticated(),
    (req, res) => {
      req.logout();
      req.session.destroy();
      res.status(200).send({
        message: 'The session has successfully ended'
      });
    }
  )
  .get('/auth/api/session',
    auth.ensureUserAuthenticated(),
    (req, res) => {
      if (req.user) {
        res.status(200).send({
          user: req.user.user,
          customer: req.user.customer,
          tokeninfo: req.user.tokeninfo
        });
      } else {
        res.status(404).send({
          message: 'Session not initialized'
        });
      }
    }
  )
  .get('/auth/sso/callback',
    (req, res) => {
      res.redirect('/#/login');
    }
  );
};
