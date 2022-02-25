'use strict';

/**
 * @ngdoc service
 * @name asyncSettingsService
 * @description
 *
 * This service is used to fetch and cache the customer settings for section controllers.
 * This service will save the settings until an account change is detected.
 */

angular
    .module('common')
    .service('asyncSettingsService', [
        '$q',
        '$rootScope',
        'authService',
        'adminAPIService',
        'AUTH_EVENTS',
        function(
            $q,
            $rootScope,
            authService,
            adminAPIService,
            AUTH_EVENTS
        ) {
            var cache = {};

            $rootScope.$on(AUTH_EVENTS.accountChange, function clearCache() {
                cache = {};
            });

            var getFromCache = function(request, key) {
                if (cache[key]) {
                    return cache[key];
                }
                cache[key] = request().then(function(data) {
                    cache[key] = $q.when(data);
                    return cache[key];
                });

                return cache[key];
            };

            /**
             * @name getCustomer
             * @description Public method in order to get the customer from the cache or calling the customer endpoint.
             */
            this.getCustomer = function() {
                var request = function() {
                    return authService.isSessionReady()
                    .then(function(session) {
                        return {
                            data: session.customer,
                        };
                    });
                };
                return getFromCache(request, 'customer');
            };

            /**
             * @name isSuggestionEnabled
             * @description Public method that expose the tagging suggestion flag.
             */
            this.isSuggestionEnabled = function() {
                return this.getCustomer().then(function(customer) {
                    return !!customer.data.settings.modsquad_cosimo_suggestions;
                });
            };

            /**
             * @name isNSFWEnabled
             * @description Public method that expose the NSFW detection setting.
             */
            this.isNSFWEnabled = function() {
                return this.getCustomer().then(function(customer) {
                    return customer.data.settings.programmatic_keywords_nsfw;
                });
            };

            /**
             * @name isSuggestionFromCropEnabled
             * @description Public method that expose the suggestion from crop setting.
             */
            this.isSuggestionFromCropEnabled = function() {
                return this.getCustomer().then(function(customer) {
                    return !!customer.data.settings.modsquad_cosimo_suggestions_based_on_crop;
                });
            };

            /**
             * @name isPhotoFiltersEnabled
             * @description Public method that expose the Photo Filters setting stats.
             */
            this.isPhotoFiltersEnabled = function() {
                return this.getCustomer().then(function(customer) {
                    var computer_vision_capabilities = customer.data.settings.computer_vision_capabilities || {};
                    return computer_vision_capabilities.photo_filters_enabled || false;
                });
            };

            /**
             * @name isLanguageDetectionEnabled
             * @description Public method that expose the Photo Filters setting stats.
             */
            this.isLanguageDetectionEnabled = function() {
                return this.getCustomer().then(function(customer) {
                    return customer.data.settings.language_detection || false;
                });
            };
        }]);
