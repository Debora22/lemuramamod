'use strict';

const Jimple = require('jimple');
const container = new Jimple();
const path = require('path');

module.exports = (appPath, env) => {

  container.set('appPath', path.normalize(appPath));
  container.set('env', env);

  // register common modules
  container.register(require('../../common/providers/appErrorHandler'));
  container.register(require('../../common/providers/settings'));
  container.register(require('../../common/providers/controller'));
  container.register(require('../../common/providers/http'));
  container.register(require('../../common/providers/httpErrorHandler'));
  // container.register(require('../../common/providers/authenticationErrorHandler'));

  // register passport
  container.register(require('../../authentication/providers/passport'));

  // register (non) aws modules
  container.register(require('../../aws/providers/elastiCache'));

  // register tracking
  container.register(require('../../tracking/providers/timeTracking'));
  container.register(require('../../tracking/providers/submission'));

  // register express routes
  container.register(require('../../common/routes/health'));
  container.register(require('../../authentication/routes/auth'));
  container.register(require('../../customer/routes/customer'));
  container.register(require('../../data/routes/data'));
  container.register(require('../../media/routes/media'));
  container.register(require('../../search/routes/search'));
  container.register(require('../../suggestions/routes/suggestions'));
  container.register(require('../../translate/routes/translate'));
  container.register(require('../../user/routes/user'));
  container.register(require('../../rights/routes/rights'));
  container.register(require('../../tracking/routes/timeTracking'));
  container.register(require('../../tracking/routes/actionTracking'));
  container.register(require('../../tracking/routes/submission'));

  // bad request by default
  container.register(require('../../core/routes/badrequest'));

  return container;
};
