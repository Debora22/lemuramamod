'use strict';

/**
 * @ngdoc object
 * @name common
 * @description
 *
 * Just a wrapper for Offline.js
 */
angular
    .module('common')
        .provider('Offline', function() {

            var Offline = window.Offline || {};

            /**
             * @name options
             *
             * @description
             * Public method for set the settings
             *
             * @param  {Object} data
             */
            var options = function(options) {
                Offline.options = options;
            };

            return {
                options: options,
                $get: function() {
                    return Offline;
                }
            };

        });
