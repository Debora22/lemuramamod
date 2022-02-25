'use strict';

const IoRedis = require('ioredis');
const ElastiCache = require(`../lib/elastiCache`);

/**
 * This provider handles ElastiCache client connection.
 * Since ElastiCache is compatible with Redis protocol it uses ioredis library.
 */
module.exports =  {
  register: (c) => {
    const settings = c.get('settings');
    const redisClient = new IoRedis(settings.services.redis.cacheStorage);
    const elastiCache = new ElastiCache(redisClient);

    c.set('elastiCache', elastiCache);
  }
};
