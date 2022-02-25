'use strict';

const Submission = require(`../lib/submission`);

/**
 * Submission Provider; will expose the submission Class;
 */
module.exports =  {
  register: (c) => {

    c.set('submission', new Submission());
  }
};
