'use strict';

/**
 * @ngdoc service
 * @name  op.api.photorankAPIService
 */
angular
.module('op.api')
.service('trackingAPIService', ['apiService', 'apiConfig', 'appConstant',
    function(APIService, apiConfig, appConstant) {
        var endpoints = apiConfig.trackingAPI.endpoints;
        var middlewareURL = appConstant.adminAPI2.url;

        /**
         * @name Pause
         *
         * @description
         * Pause time tracker
         *
         * @return {Promise}
         */
        this.pauseTime = function() {
            return APIService.post(middlewareURL + endpoints.timeTracking.pause);
        };

        /**
         * @name Resume
         *
         * @description
         * Resume time tracker
         *
         * @return {Promise}
         */
        this.resumeTime = function() {
            return APIService.post(middlewareURL + endpoints.timeTracking.resume);
        };

        /**
         * @name Stop
         *
         * @description
         * Stop time tracker
         *
         * @return {Promise}
         */
        this.stopTime = function() {
            return APIService.post(middlewareURL + endpoints.timeTracking.stop);
        };

        /**
         * @name keepAlive
         *
         * @description
         * send a keep alive event to time tracker
         *
         * @return {Promise}
         */
        this.keepAliveTime = function() {
            return APIService.post(middlewareURL + endpoints.timeTracking.keepalive);
        };

        /**
         * @name getTimeCurrentValue
         *
         * @description
         * Get time tracker current value
         *
         * @return {Promise}
         */
        this.getTimeCurrentValue = function() {
            return APIService.get(middlewareURL + endpoints.timeTracking.time);
        };

        /**
         * @name getActionCounters
         *
         * @description
         * Get action counter values
         *
         * @return {Promise}
         */
        this.getActionCounters = function() {
            return APIService.get(middlewareURL + endpoints.actionTracking.counters);
        };

        /**
         * @name resetActionCounters
         *
         * @description
         * Reset action counter values
         *
         * @return {Promise}
         */
        this.resetActionCounters = function() {
            return APIService.put(middlewareURL + endpoints.actionTracking.reset);
        };

        /**
         * @name submitUserReport
         *
         * @description
         * Submit action tracking and time tracking edited values.
         *
         * @param {String} approved edited value.
         * @param {String} rejected edited value.
         * @param {String} tagged edited value.
         * @param {String} time edited value.
         * @param {String} comment explaining the edition.
         *
         * @return {Promise}
         */
        this.submitUserReport = function(approved, rejected, tagged, time, comment) {
            var payload = {
                approved: approved,
                rejected: rejected,
                tagged: tagged,
                time: time,
                comment: comment
            };

            return APIService.post(middlewareURL + endpoints.submission, payload);
        };
    }]);
