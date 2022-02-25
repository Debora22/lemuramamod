'use strict';

const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);
const RedisClient = require('ioredis');

module.exports = {
  register: (c) => {
    const settings = c.get('settings');
    const redisClient = new RedisClient(settings.services.redis.sessionStorage);

    redisClient.on('error', (err) => {
      throw err;
    });

    c.set('sessionStore', () => {
      return new RedisStore({
        client: redisClient
      });
    });
  }
};
