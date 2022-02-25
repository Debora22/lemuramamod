'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

module.exports = {
  register: (c) => {
    const settings = c.get('settings');
    const app = express();
    app.use(express.static(settings.publicPath));
    app.use(cookieParser());
    app.use(bodyParser.json({limit: '5mb'}));
    app.use(bodyParser.urlencoded({limit: '5mb'}));

    app.use(c.get('session').express);
    app.use(c.get('auth').express);

    c.get('routes').forEach((router) => {
      app.use(router);
    });

    app.use(c.get('httpErrorHandler').http);

    app.set('trust proxy', 1); // trust on 1 HTTP proxy hop

    c.set('app', {
      express: app
    });
  }
};
