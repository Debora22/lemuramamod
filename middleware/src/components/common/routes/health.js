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

  return express.Router()
  .get('/service/health',
    (req, res) => {
      res.send(200, {
        isHealthy: true,
        status: 200,
      });
      res.end();
    }
  );
};
