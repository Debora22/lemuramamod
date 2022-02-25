'use strict';

/**
 * @ngdoc service
 * @name op.loading.loadingService
 * @description
 *
 * This service allow turn on/off the loading
 */
angular
    .module('op.loading')
    .service('loadingService', function() {
        var subscribers = [];
        this.loading = false;

        //Call all subscribers to Loading Off event
        function onLoadingOffEvent(value) {
            subscribers.forEach(function(callback) {
                callback(value);
            });
        }

        // Set the loading on
        this.on = function() {
            this.loading = true;
        };

        // Set the loading off
        this.off = function() {
            this.loading = false;
            onLoadingOffEvent(false);
        };

        //Subscribe to the Loading Off event
        this.onLoadingOff = function(callback) {
            var index = subscribers.push(callback) - 1;

            return function() {
                subscribers.splice(index);
            };
        };
    });
