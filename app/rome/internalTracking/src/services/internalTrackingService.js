'use strict';

angular
    .module('op.internalTracking')
    .service('internalTrackingService', ['trackingAPIService', function(trackingAPIService) {
        /**
         * @name trackingData
         * @desc Save tracking data.
         */
        var trackingData = {};
        var countersChangeSubscribers = [];
        var initSubscribers = [];

        /**
         * Call all callbacks subscribed to counter change event
         */
        var counterChangeEvent = function() {
            countersChangeSubscribers.forEach(function(callback) {
                callback(trackingData);
            });
        };

        /**
         * Call all callbacks subscribed to init event
         */
        var initEvent = function() {
            initSubscribers.forEach(function(callback) {
                callback(trackingData);
            });
        };

        /**
         * @name onCounterChange
         *
         * @description
         * Receives a callback to be called every time any counters changes
         *
         */
        this.onCounterChange = function(callback) {
            countersChangeSubscribers.push(callback);
        };

        /**
         * @name onInit
         *
         * @description
         * Receives a callback to be called every time the tracker is initialized
         *
         */
        this.onInit = function(callback) {
            initSubscribers.push(callback);
        };

        /**
         * @name getCountersData
         *
         * @description
         * Return the valid tracking data for the header
         *
         * @returns {Object} with the tracking data.
         */
        this.getCountersData = function() {
            return trackingData;
        };

        /**
         * @name trackAction
         *
         * @description Public method called after a subscriber receive an event. In charge of increase
         * headerTrackingData object and the localStorage.
         *
         * @param {string} action to track
         * @param {string} quantity of medias to increase.
         */
        this.trackAction = function(action, quantity) {
            if (trackingData[action] && trackingData[action] >= 0) {
                trackingData[action] += quantity;
            } else {
                trackingData[action] = quantity;
            }
            counterChangeEvent();
        };

        /**
         * It gets the values from adminAPI
         */
        function getPersistedValues() {
            return trackingAPIService.getActionCounters().then(function(values) {
                trackingData = {
                    tagged: values.TAGGED ? parseInt(values.TAGGED) : 0,
                    approved: values.APPROVED ? parseInt(values.APPROVED) : 0,
                    rejected: values.REJECTED ? parseInt(values.REJECTED) : 0
                };
            });
        }

        /**
         * @name resetCounters
         *
         * @description Public method in charge of empty the header headerTrackingData object and the localStorage.
         */
        this.init = function() {
            getPersistedValues().then(function() {
                initEvent();
            });
        };

        /**
         * Get the values from adminAPI and call counter change subscribers
         */
        this.refresh = function() {
            getPersistedValues().then(function() {
                counterChangeEvent();
            });
        };
    }]);
