'use strict';

const expressSession = require('express-session');

module.exports = {
  register: (c) => {

    const settings = c.get('settings');

    const sessionSettings = {
      name: 'lemurama-middleware.sid',
      secret: '0l4pic Midd13W4r3',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 86400000 // 24hs
      }
    };

    if (settings.behindBalancer) {
      sessionSettings.cookie.secure = true; // use secure cookies
    }

    if (c.get('sessionStore')) {
      sessionSettings.store = c.get('sessionStore');
    }

    c.set('session', {
      express: expressSession(sessionSettings)
    });
  }
};
