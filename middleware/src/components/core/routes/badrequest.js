'use strict';
const express = require('express');
const AuthenticationError = require(`../../common/providers/authenticationErrorHandler`);
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
  return express.Router()
  .all('*',
    auth.ensureUserAuthenticated(),
    () => {
      throw new AuthenticationError('Bad request', 400);
    }
  );
};
