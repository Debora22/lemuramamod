'use strict';

const uuid = require('node-uuid');
const extend = require('extend');
const theDate = require('./date');

/**
 * ActionTracking Class
 */
class TimeTracking {
  /**
   * constructor,
   * @param {String} env Node ENV
   */
  constructor(env) {
    this.messageTemplate = {
      id: null,
      env: env,
      timestamp: null,
      data: {
        event_type: null
      }
    };
  }

  /**
   * It creates the message payload to be sent to AdminAPI /tracking/time/event endpoint"
   * @param eventType Start/Stop/Pause/Resume
   */
  createMessage(eventType) {
    const timestamp = theDate.get();
    const message = extend({}, this.messageTemplate, {
      timestamp: timestamp,
      data: {
        event_type: eventType
      }
    });

    return JSON.stringify(message);
  }

}

module.exports = TimeTracking;
