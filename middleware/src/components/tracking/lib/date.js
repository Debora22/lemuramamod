'use strict';

/**
 * Simple module to return the current Time
 */
module.exports = {
  get: () => {
    return new Date().getTime();
  }
}
