'use strict';

const TimeTracking = require(`../lib/timeTracking`);

/**
 * This is the time tracking provider. It handles time tracking related events
 * and provides time tracking counter values
 */
module.exports =  {
  register: (c) => {

    const timeTracking = new TimeTracking(c.get('env') || 'live');

    c.set('timeTracking', timeTracking);
  }
};
