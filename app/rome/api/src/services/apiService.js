'use strict';

/**
 * @ngdoc service
 * @name  op.api.apiService
 */
angular
    .module('op.api')
    .service('apiService', ['$http', '$q', function($http, $q) {

        var exports = {};

        /**
         * @name get
         *
         * @description
         * Method to do the GET requests.
         *
         * @param  {String} endpoint The URL to make the requests
         * @param  {Object} params   The object to be sended as query string
         * @return {Promise}
         */
        exports.get = function(endpoint, params, header) {
            header = header || {};
            return request(endpoint, 'GET', params, {}, header);

        };

        /**
         * @name post
         *
         * @description
         * Method to do the POST requests
         *
         * @param  {String} endpoint The URL to make the request
         * @param  {Object} data     The object to be sended as data
         * @return {Promise}
         */
        exports.post = function(endpoint, data, headers) {
            return request(endpoint, 'POST', {}, data, headers);
        };

        /**
         * @name postUrlencoded
         *
         * @description
         * Method to do the POST requests with data URL_ENCODED
         * This must be reviewed by @maxigimenez to check if it
         * would be supported by the legacy post method.
         *
         * @param  {String} endpoint The URL to make the request
         * @param  {Object} data     The object to be sended as data
         * @return {Promise}
         */
        exports.postUrlencoded = function(endpoint, data) {
            return $http({
                url: endpoint,
                method: 'POST',
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                },
                data: angular.element.param(data),
                withCredentials: true
            });
        };

        /**
         * @name put
         *
         * @description
         * Method to do the PUT requests
         *
         * @param  {String} endpoint The URL to make the request
         * @param  {Object} params   The object to be sended as query string
         * @param  {Object} data     The object to be sended as body
         * @param  {Object} header   The object to set more headers
         * @return {Promise}
         */
        exports.put = function(endpoint, params, data, header) {
            return request(endpoint, 'PUT', params, data, header);
        };

        /**
         * @name link
         *
         * @description
         * Method to do the LINK requests
         *
         * @param  {String} endpoint The URL to make the request
         * @param  {Object} params   The object to be sended as query string
         * @param  {Object} header   The object to set more headers
         * @return {Promise}
         */
        exports.link = function(endpoint, params, header) {
            return request(endpoint, 'LINK', params, {}, header);
        };

        /**
         * @name delete
         *
         * @description
         * Method to do the DELETE requests
         *
         * @param  {String} endpoint The URL to make the request
         * @param  {Object} params   The object to be sended as query string
         * @param  {Object} data     The object to be sended as body
         * @param  {Object} header   The object to set more headers
         * @return {Promise}
         */
        exports.delete = function(endpoint, params, data, header) {
            return request(endpoint, 'DELETE', params, data, header);
        };

        /**
         * @name unlink
         *
         * @description
         * Method to do the UNLINK requests
         *
         * @param  {String} endpoint The URL to make the request
         * @param  {Object} params   The object to be sended as query string
         * @param  {Object} header   The object to set more headers
         * @return {Promise}
         */
        exports.unlink = function(endpoint, params, header) {
            return request(endpoint, 'UNLINK', params, {}, header);
        };

        /**
         * @name request
         *
         * @description
         * Internal method to manage GET, POST, LINK, UNLINK methods to
         * made the requests. Here we are doing all the internal checks before the request.
         *
         * @param  {String} url     The URL to make the request
         * @param  {String} method  [POST, GET, LINK, UNLINK]
         * @param  {Object} params  The object to be sended as query string
         * @param  {Object} data    The object to be sended as body
         * @param  {Object} headers The object to set more headers
         * @return {Promise}
         */
        var request = function(url, method, params, data, headers) {
            var deferred = $q.defer();

            var options = getRequestOptions(url, method, params, data, headers);

            $http(options)
                .then(function(data, status, headers, config, statusText) {
                    deferred.resolve(data.data, status, headers, config, statusText);
                }, function(data, status, headers, config, statusText) {
                    deferred.reject(data, status, headers, config, statusText);
                });

            return deferred.promise;
        };

        /**
         * @name getRequestOptions
         *
         * @description
         * Internal method to generate the options for the $http object of angular
         *
         * @param  {String} url     The URL to make the request
         * @param  {String} method  [POST, GET, LINK, UNLINK]
         * @param  {Object} params  The object to be sended as query string
         * @param  {Object} data    The object to be sended as body
         * @param  {Object} headers The object to set more headers
         */
        var getRequestOptions = function(url, method, params, data, headers) {
            data = (angular.isDefined(data) && angular.isObject(data)) ? data : {};
            var defaultHeaders = {
                Accept: 'application/json'
            };
            return {
                url: url,
                method: method,
                headers: angular.extend(defaultHeaders, headers),
                data: data,
                params: params,
                withCredentials: true
            };
        };

        return exports;

    }]);
