'use strict';

const extend = require('extend');

const fetch = require('node-fetch');
const urijs = require('urijs');

const prepareRequestOptions = (options) => {
  options = options || {};
  return (req, res, next) => {
    req.httpOptions = extend(options, {
      headers: {
        Authorization: `Bearer ${req.user.token}`,
        'x-olapic-customer-id': `${req.user.customer.id}`,
        'Content-Type': 'application/json',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
      },
      qsStringifyOptions: { encode: false },
      qsParseOptions: { encode: false }
    });
    next();
  };
};

const doRequest = (url, options) => {
  return fetch(url, options)
  // this is necesary because json()/text() returns a promise
  .then((body) => {
    // parse json only if the context-type is set.
    if(body.headers.get('content-type').search('json') > -1){
      return body.json();
    } else {
      return body.text();
    }
  })
};

const fetchRequest = (url, options) => {
  return fetch(url, options);
};

const proxyRequest = () => {
  return (req, res, next) => {
    if (req.httpOptions.qs) {
      // since fetch does not support QS parameter, we add the QS into the URI
      req.httpOptions.uri = urijs(req.httpOptions.uri)
        .addSearch(req.httpOptions.qs)
        .toString();
      delete req.httpOptions.qs;
    }

    const url = req.httpOptions.uri;
    delete req.httpOptions.uri;

    doRequest(url, req.httpOptions).then((body) => {
      res.body = body;
      next();
    })
    .catch(err => next(err));
  };
};

const writeProxyResults = (dataOnly) => {
  return (req, res, next) => {
    let status = 200;
    if (res.body && res.body.metadata) {
      status = res.body.metadata.code;
    } else if (res.body && res.body.meta) {
      status = res.body.meta.code;
    }
    res.status(status).json(
      dataOnly === true ? res.body.data : res.body
    );
  };
};

module.exports =  {
  register: (c) => {
    c.set('http', {
      http: fetch,
      prepareRequestOptions: prepareRequestOptions,
      proxyRequest: proxyRequest,
      writeProxyResults: writeProxyResults,
      doRequest: doRequest,
      fetchRequest: fetchRequest
    });
  }
};
