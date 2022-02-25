'use strict';

angular
    .module('op.externalTracking')
    .factory('externalTrackingFactory', function() {
        var exports = {};
        var timeTrakers = [];
        var configStore = {};

        /**
         * Triggers GA event
         * @param  {object} eventConfig Object containing the event to track
         */
        var triggerEvent = function(eventConfig) {
            window.ga('send', eventConfig);
        };

        /**
         * Set GA Field
         * @param  {String} field The field to be set
         * @param  {String} value The value to be set
         */
        exports.setField = function(field, value) {
            window.ga('set', field, value);
        };

        /**
         * Method to check availability of time tracker
         * @return {Boolean}
         */
        var isTrackerAvailable = function(trackerId) {
            return !!timeTrakers[trackerId];
        };

        /**
         * Method that returns current time
         * @return {integer} Current time in milliseconds
         */
        var now = function() {
            return Date.now();
        };

        /**
         * Public method to set a config setting
         * @param {string} variable
         * @param {string} value
         */
        exports.setConfig = function(variable, value) {
            configStore[variable] = value;
        };

        /**
         * Public method to get a config setting
         * @param {string} variable
         * @param {string} value
         * @return {string} Value of setting
         */
        exports.getConfig = function(variable) {
            return configStore[variable];
        };

        /**
         * Method to track a single event
         * @param  {object} config Object containing event config. See conventions above.
         */
        exports.trackEvent = function(config) {
            triggerEvent({
                hitType: 'event',
                eventCategory: config.category || 'Undefined Category',
                eventAction: config.action || 'Undefined Action',
                eventLabel: config.label || this.getConfig('customer'),
                eventValue: config.value || undefined
            });
        };

        /**
         * @param {string} page the page path i.e: #/tagging
         * @param {string} title the page title
         * @param {boolean} includeCategory true to send category information
         * @param {string} searchTerm the search term if any
         */
        exports.trackPageView = function(page, title, includeCategory, searchTerm) {
            var params = [];

            var customer = this.getConfig('customer');

            if (includeCategory && customer) {
                params.push('customer=' + customer);
            }

            if (searchTerm) {
                params.push('query=' + searchTerm);
            }

            if (params.length > 0) {
                page += '?' + params.join('&');
            }

            if (title) {
                this.setField('title', title);
            }

            triggerEvent({
                hitType: 'pageview',
                page: page
            });
        };

        /**
         * Method to start a time tracker
         * @param  {string} trackerId
         */
        exports.startTimer = function(trackerId) {
            timeTrakers[trackerId] = now();
        };

        /**
         * Method to restart a time tracker previously started
         * @param  {string} trackerId
         */
        exports.restartTimer = function(trackerId) {
            this.startTimer(trackerId);
        };

        /**
         * Method to dismiss a time tracker previously started
         * @param  {string} trackerId
         */
        exports.dismissTimer = function(trackerId) {
            if (isTrackerAvailable(trackerId)) {
                delete timeTrakers[trackerId];
            }
        };

        /**
         * Method that apply the time tracker and triggers the event
         * @param  {string} trackerId The tracker ID
         * @param  {object} config Object containing event config. See conventions above.
         */
        exports.trackTimeWithTimer = function(trackerId, config) {
            if (isTrackerAvailable(trackerId)) {
                var elapsedTime = (now() - timeTrakers[trackerId]);

                delete timeTrakers[trackerId];

                this.trackTime(config, elapsedTime);
            }
        };

        exports.trackTime = function(config, elapsedTime) {
            triggerEvent({
                hitType: 'timing',
                timingCategory: config.category || 'Undefined Category',
                timingVar: config.action || 'Undefined Action',
                timingValue: elapsedTime,
                timingLabel: this.getConfig('customer')
            });
        };

        return exports;
    });
