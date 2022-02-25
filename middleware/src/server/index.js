'use strict';

module.exports = (appPath) => {
  // get the app container
  const app = require('../components/common/providers/app')(appPath);
  // register settings
  app.register(require('../components/common/providers/settings'));

  // register session & auth
  app.register(require('../components/session/providers/sessionStore_live'));
  app.register(require('../components/session/providers/session'));

  // express instance (app)
  app.register(require('../components/core/providers/expressApp'));

  return app;
};
