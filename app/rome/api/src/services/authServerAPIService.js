'use strict';

/**
 * @ngdoc service
 * @name  op.api.authServerAPIService
 */
angular
    .module('op.api')
    .service('authServerAPIService', ['$http', 'apiConfig', 'appConstant', function($http, apiConfig, appConstant) {

        var exports = {},
            endpoints = apiConfig.authServer.endpoints;

        /**
         * @name login
         *
         * @description
         * Login method that consume the auth server to get the
         * credentials.
         *
         * @param  {String} user The user object (id, name, email)
         * @param  {String} token The access token
         * @return {Promise}
         */
        exports.login = function(sessionMetadata, token) {
            sessionMetadata.token = token;
            return $http.post(appConstant.authServer.url + endpoints.login, angular.toJson(sessionMetadata), {withCredentials: true});
        };

        /**
         * @name logout
         * @desc Logout method
         * @return {Promise}
         */
        exports.logout = function() {
            return $http.post(appConstant.authServer.url + endpoints.logout, {}, {withCredentials: true});
        };

        /**
         * @name getCurrentSession
         * @desc Get oauth access token info stored in session
         * @returns {Promise}
         */
        exports.getCurrentSession = function() {
            return $http.get(appConstant.authServer.url + endpoints.session, {}, {withCredentials: true});
        };

        exports.getLoginCallbackPath = function(baseUrl) {
            return baseUrl + appConstant.authServer.url + endpoints.loginCallback;
        };

        return exports;

    }]);
