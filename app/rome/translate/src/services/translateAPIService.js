'use strict';

/**
 * @ngdoc factory
 * @name  op.translate.translateAPIService
 */
angular.module('op.translate')
    .factory('translateAPIService', [
        '$http',
        'appConstant',
        '$localStorage',
        function($http, appConstant, $localStorage) {
            var exports = {};
            var baseUrl = appConstant.translate.url;

            $localStorage.translateTargetLanguage = $localStorage.translateTargetLanguage || 'en';

            /**
             * @name translate
             *
             * @description
             * Perform a translation
             *
             * @param  {String} q. Text to translate
             * @return {Promise} http promise. once resolved, it would return the translation
             */
            exports.translate = function(q) {
                return $http.post(baseUrl, {
                    params: {
                        target: $localStorage.translateTargetLanguage,
                        q: q
                    }
                }).then(function(response) {
                    // response translation if it's available.
                    return response.data.data && response.data.data.translations ? response.data.data.translations : '';
                });
            };

            /**
             * @name prepTranslation
             *
             * @description
             * Prepare a text for the translation
             *
             * @param  {String} q. Text to prepare
             * @return {String} Text prepared for translation
             */
            exports.prepTranslation = function(q) {
                return q.replace(/([#|@]\S*)/g, '<span class="notranslate">$1</span>');
            };

            return exports;
        }]);
