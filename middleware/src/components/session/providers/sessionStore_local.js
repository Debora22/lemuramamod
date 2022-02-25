'use strict';

module.exports = {
  register: (c) => {
    // no need for a store on local environment
    c.set('sessionStore', null);
  }
};
