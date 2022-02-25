'use strict';

/**
 * @ngdoc object
 * @name op.track
 * @description
 *
 * This is the main script for the module and will contain the
 * enabled endpoints to be consumed.
 */
angular
    .module('op.track')
    .constant('endpoint', '{base}/internal/track/app/{appName}/context/{context}/event/{type}')
    .provider('trackv2', function(endpoint) {

        /**
         * extend
         * @param  {object} dst settings
         * @return {object} [description]
         */
        var extend = function(dst) {
            angular.forEach(arguments, function(obj) {
                if (obj !== dst) {
                    angular.forEach(obj, function(value, key) {
                        if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                            extend(dst[key], value);
                        } else {
                            dst[key] = value;
                        }
                    });
                }
            });
            return dst;
        };

        /**
         * Default settings
         *
         * The supported options are:
         *
         * url {string} Destination url for track events
         * enabled {bool} Turn on/off the module
         */
        var defaultSettings = {
            url: null,
            appName: null,
            enabled: true,
            bulkLimit: 10
        };

        /**
         * @name setSettings
         *
         * @description
         * Public method for set the settings
         *
         * @param  {Object} data
         */
        var setSettings = function(settings) {
            defaultSettings = extend(angular.copy(defaultSettings), settings);
        };

        /**
         * @name _assign
         *
         * @description
         * Replace a string with the value of the a given Object
         * @param {String} str  The base string.
         * @param {Object} replaceWith  Object key, value with the data to replace.
         * @return {String} The result string.
         */
        var _assign = function(str, replaceWith) {
            angular.forEach(replaceWith, function(value, key) {
                str = str.replace('{' + key + '}', value);
            });

            return str;
        };

        return {
            setSettings: setSettings,
            $get: ['$http', '$q', function($http, $q) {

                var exports = {};

                var queue = [];
                /**
                 * @name addEvent
                 *
                 * @description
                 * Public method to add an event to the queue
                 *
                 * @param  {String} Context, e.g. "premod"
                 * @param  {String} Event type, e.g. "deleted-on-premod"
                 * @param  {Object} Event entity. Must be prototyped as {type: (string), id: (string)
                 * @param  {Object} Event related entity (optional). Must be prototyped as the same as entity
                 * @return {void}
                 */
                exports.addEvent = function(context, type, entity, relatedEntity, metadata) {
                    queue.push({
                        context: context,
                        type: type,
                        event: {
                            entity: entity,
                            related_entity: relatedEntity,
                            metadata: metadata
                        }
                    });
                };

                /**
                 * @name buildOptions
                 *
                 * @description
                 * Receives an item queue and build the http options for its context and type
                 *
                 * @param  {Object} item containing context and type
                 * @return {array}
                 */
                var buildOptions = function(item) {
                    return {
                        method: 'POST',
                        url: _assign(endpoint, {
                            base: defaultSettings.url,
                            appName: defaultSettings.appName,
                            context: item.context,
                            type: item.type
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            events: []
                        }
                    };
                };

                /**
                 * @name flush
                 *
                 * @description
                 * Public method to send events
                 *
                 * @return {Promise}
                 */
                exports.flush = function() {

                    var eventBatches = {};

                    // swap queue variable atomically: http://goo.gl/viblMA
                    var currentQueue = [];
                    queue = [currentQueue, currentQueue = queue][0];

                    // loops the current event queue and build the batches for every context + type
                    currentQueue.forEach(function(item) {
                        var key = item.context + '.' + item.type;
                        if (angular.isUndefined(eventBatches[key])) {
                            // if this context+type wasn't never enqueued, initialize the array
                            // and push a new batch
                            eventBatches[key] = [];
                            eventBatches[key].push(buildOptions(item));
                        }

                        // get the last batch for this context/type of event
                        var batch = eventBatches[key].slice().pop();

                        if (batch.data.events.length >= defaultSettings.bulkLimit) {
                            // if the batch size reached the bulk limit of events
                            // creates a new batch and push it to the key array
                            batch = buildOptions(item);
                            eventBatches[key].push(batch);
                        }
                        // push the event to the data of the current batch
                        batch.data.events.push(item.event);
                    });

                    // concat all the batches for every context+type into a single array
                    var httpOptions = [];
                    Object.keys(eventBatches).map(function(key) {
                        httpOptions = httpOptions.concat(eventBatches[key]);
                    });

                    if (defaultSettings.enabled) {
                        // if enabled, send the http request for every batch
                        // and returns a single promise;
                        return $q.all(httpOptions.map($http));
                    }
                };

                return exports;
            }]
        };

    });
