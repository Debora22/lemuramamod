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
        .provider('track', function() {

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
                url: '',
                enabled: true
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

            return {
                setSettings: setSettings,
                $get: ['$http', function($http) {

                    var exports = {};

                    /**
                     * @name request
                     *
                     * @description
                     * Send the request if is enabled
                     *
                     * @param  {Object} Object to send
                     * @return {Promise}
                     */
                    var request = function(data) {
                        if (defaultSettings.enabled) {
                            return $http.post(defaultSettings.url, data);
                        }
                    };

                    /**
                     * @name event
                     *
                     * @description
                     * Public method for track an event
                     *
                     * @param  {Object} event
                     * @return {Promise}
                     */
                    exports.event = function(data) {
                        return request(data);
                    };

                    return exports;
                }]
            };

        });
