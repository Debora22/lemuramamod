'use strict';

/**
 * ElastiCache Class
 */
class ElastiCache {

  /**
   * constructor,
   * @param {Object} client a redis client
   */
  constructor(client) {
    this.client = client;
    this.clientIsReady = () => {};

    /** Start for redis client events handling **/
    this.client.on('connect', () => {
      console.log('elastiCache client connecting');
    });

    this.client.on('reconnecting', () => {
      console.log('elastiCache client reconnecting');
    });

    this.client.on('ready', () => {
      this.clientIsReady(this.client);
      console.log('elastiCache client ready');
    });

    this.client.on('error', (err) => {
      console.error('Elasticache client error: ' + err);
    });
    /** End for redis client events handling **/
  }

  /**
   * The client will connect once the package is initialized.
   * This function will return the client only when client connection is completed.
   * Also it supports those scenarios where the client is disconnected for some reason.
   * In those exceptional cases the client will automatically try to reconnect using the
   * default ioredis strategy.
   * This way to return the client only when it is connected prevents using the client when
   * it is in the middle of the reconnecting process
   */
  returnClientWhenConnected() {
    return new Promise((resolve) => {
      if (this.client.status === 'ready') {
        resolve(this.client);
      } else {
        this.clientIsReady = resolve;
      }
    });
  }

  /**
   * Returns the client
   */
  getClient() {
    return this.returnClientWhenConnected();
  }
}
module.exports = ElastiCache;
