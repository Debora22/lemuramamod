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
    /**
     * The following method handle calls to two AdminApi endpoints.
     *
     * The endpoint `/search/media` retrieve the Aggreation data used to build the filters.
     * Documentation: https://github.com/Olapic/AdminAPI/blob/a44b8331907be495c6b3bb26b0902f3ccc9ee354/docs/MediaSearch.md#query-media
     *
     * The endpoint /search/media/stream/positions retrieve the list of media filters by the recieved criteria.
     * Documentation: https://github.com/Olapic/AdminAPI/blob/a44b8331907be495c6b3bb26b0902f3ccc9ee354/docs/MediaSearch.md#query-media-search-stream-positions
     */
    (req, res, next) => {
      req.query.routing = req.user.customer.id;
      req.url = req.url
        .replace(/\/search\/media([\/|\?].*)/, '/media/indexed_search$1')
        .replace(/\/search\/(\w+)([\/|\?])(.*)/, '/$1/search$2$3');
      extend(req.httpOptions, {
        method: req.method.toUpperCase(),
        uri: `${config.services.adminAPI2.url}${req.url}`,
        qs: req.query
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
    (req, res, next) => {
      if (res.body.data.pagination) {
        // Re build the middleware URL based on the response.
        ['next', 'prev', 'self'].map(function(k) {
          if (res.body.data.pagination[k]) {
            res.body.data.pagination[k] = res.body.data.pagination[k]
              .replace(config.services.adminAPI2.url, '');
            res.body.data.pagination[k] = res.body.data.pagination[k]
              .replace(/media\/indexed_search(.*)/, 'search/media$1')
              .replace(/(\w+)\/search(.*)/, 'search/$1$2');
          }
        });
      }
      next();
    },
    http.writeProxyResults()
  ];
  return express.Router()
  .head('/search/*', middlewares)
  .get('/search/*', middlewares)
  .put('/search/*', middlewares)
  .post('/search/*', middlewares);
};
