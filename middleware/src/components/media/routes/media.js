'use strict';
const express = require('express');
const extend = require('extend');
const Media = require('../lib/media');
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

  let originalReq;
  let promises = [];

  return express.Router()
  .post('/media/:id/streams/positions',
    auth.ensureCustomerAuthenticated(),
    http.prepareRequestOptions(),
    (req, res, next) => {
      let mediaProvider = new Media(http, config.services.adminAPI2.url)

      mediaProvider.setReq(req);
      //save stream relationship and create annotations
      mediaProvider.save()
        .then((response) => {
          res.body = response;
          next()
        })
        .catch((err) => next(err))
    },
    http.writeProxyResults()
  )
  .get('/media/streams/positions',
    auth.ensureCustomerAuthenticated(),
    http.prepareRequestOptions(),
    (req, res, next) => {
      extend(req.httpOptions, {
        method: 'GET',
        uri: `${config.services.adminAPI2.url}/media/streams/positions`,
        qs: req.query
      });
      next();
    },
    http.proxyRequest(),
    http.writeProxyResults()
  )
  .get('/media/image',
    auth.ensureCustomerAuthenticated(),
    (req, res, next) => {
      http.fetchRequest(req.query.mediaUrl).then(response => {
        response.buffer().then(bodyBuffer => {
          res.status(response.status);
          res.headers = response.headers;
          res.set('Content-Type', 'image/jpeg');
          res.send(bodyBuffer);
        });
      });
    }
  )
  .post('/media/streams/positions',
    auth.ensureCustomerAuthenticated(),
    http.prepareRequestOptions(),
    (req, res, next) => {
      extend(req.httpOptions, {
        method: 'POST',
        uri: `${config.services.adminAPI2.url}/media/streams/positions`,
        qs: { media_ids: req.query.media_ids},
        body: JSON.stringify(req.body),
        json: true,
      });
      next();
    },
    http.proxyRequest(),
    http.writeProxyResults()
  )
  .get('/media/:id/streams/suggestions',
    auth.ensureCustomerAuthenticated(),
    http.prepareRequestOptions(),
    (req, res, next) => {
      extend(req.httpOptions, {
        method: 'GET',
        uri: `${config.services.adminAPI2.url}/media/${req.params.id}/streams/suggestions`,
        qs: req.query
      });
      next();
    },
    http.proxyRequest(),
    http.writeProxyResults()
  )
  .post('/media/:id/streams/suggestions',
    auth.ensureCustomerAuthenticated(),
    http.prepareRequestOptions(),
    (req, res, next) => {
      extend(req.httpOptions, {
        method: 'POST',
        uri: `${config.services.adminAPI2.url}/media/${req.params.id}/streams/suggestions`,
        body: JSON.stringify(req.body),
        json: true,
      });
      next();
    },
    http.proxyRequest(),
    http.writeProxyResults()
  )
  .put('/media/:id',
    auth.ensureCustomerAuthenticated(),
    http.prepareRequestOptions(),
    (req, res, next) => {
      extend(req.httpOptions, {
        method: 'PUT',
        uri: `${config.services.adminAPI2.url}/media/${req.params.id}`,
        body: JSON.stringify(req.body),
        json: true
      });
      next();
    },
    http.proxyRequest(),
    http.writeProxyResults()
  )
  .put('/media/status',
    auth.ensureCustomerAuthenticated(),
    http.prepareRequestOptions(),
    (req, res, next) => {
      extend(req.httpOptions, {
        method: 'PUT',
        uri: `${config.services.adminAPI2.url}/media/status`,
        body: JSON.stringify(req.body),
        json: true
      });
      next();
    },
    http.proxyRequest(),
    http.writeProxyResults()
  )
  .get('/media/:id/annotations',
    auth.ensureCustomerAuthenticated(),
    http.prepareRequestOptions(),
    (req, res, next) => {
      extend(req.httpOptions, {
        method: 'GET',
        uri: `${config.services.adminAPI2.url}/media/${req.params.id}/annotations`,
        qs: req.query
      });
      next();
    },
    http.proxyRequest(),
    http.writeProxyResults()
  )
  .put('/media/metadata/approve',
    auth.ensureCustomerAuthenticated(),
    http.prepareRequestOptions(),
    (req, res, next) => {
      extend(req.httpOptions, {
        method: 'PUT',
        uri: `${config.services.adminAPI2.url}/metadata`,
        body: JSON.stringify({
          media: req.body.media,
          name: 'lemurama_qa_finish',
          type: 'boolean',
          value: req.body.value
        }),
        json: true
      });
      next();
    },
    http.proxyRequest(),
    http.writeProxyResults()
  );
};
