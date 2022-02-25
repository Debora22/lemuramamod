'use strict';

/**
 * @ngdoc Service
 * @name taggingSuggestionService
 *
 * @description In charge of the cache of the suggested streams provided. The purpose is avoid
 * the second request after open the modal who had opened before.
 *
 */

angular
    .module('op.tagging')
    .service('taggingSuggestionService', ['$q', 'adminAPIService', function($q, adminAPIService) {
        var suggestedStreamCache = [];
        var suggestionChangeSubscribers = {};
        var suggestionRequestSubscriber = {};
        var suggestionResult;
        var currentMediaId;
        var lastestSuggestions = [];
        var isAllSuggestionAvailable;
        var tagSuggestionFromCrop = false;

        /**
         * @name handleCacheSize
         *
         * @description We dont want a cache larger than 20 elements.
         */
        function handleCacheSize() {
            //When we reach to 20 stream cached start deleting the oldest stream suggested
            if (suggestedStreamCache.length > 20) {
                suggestedStreamCache.splice(0);
            }
        }

        /**
        * @name suggestionsChangeEvent
        *
        * @description call all callbacks subscribed to the suggestion change event
        */
        var suggestionsChangeEvent = function(error) {
            Object.keys(suggestionChangeSubscribers).forEach(function(id) {
                suggestionChangeSubscribers[id](suggestionResult, error);
            });
        };

        /**
        * @name suggestionsRequestEvent
        *
        * @description call all callbacks subscribed to the suggestion request event
        */
        var suggestionsRequestEvent = function() {
            Object.keys(suggestionRequestSubscriber).forEach(function(id) {
                suggestionRequestSubscriber[id]();
            });
        };

        /**
        * @name getSuggestedStreams
        *
        * @description return the object of suggested streams for the specified media id.
        *
        * @return {Object} Object of suggested streams
        */
        this.getSuggestedStreams = function(mediaId) {
            var result;
            currentMediaId = mediaId;

            suggestedStreamCache.forEach(function(item) {
                if (item.mediaId === mediaId) {
                    result = item.data;
                }
            });

            if (result) {
                lastestSuggestions = result;
                return $q.when(result);
            } else {
                var deferred = $q.defer();
                adminAPIService.getSuggestedStream(mediaId).then(function(data) {
                    lastestSuggestions = data;
                    suggestedStreamCache.push({
                        mediaId: mediaId,
                        data: data
                    });
                    handleCacheSize();
                    deferred.resolve(data);
                }, function() {
                    deferred.reject();
                });

                return deferred.promise;
            }
        };

        /**
        * @name getLastestSuggestions
        *
        * @description Returns the latest list of suggestion
        */
        this.getLastestSuggestions = function() {
            return lastestSuggestions;
        };

        /**
        * @name onGetSuggestionRequest
        *
        * @description Receives a callback to be called every time the getCropSuggestions request is called
        * @param {String} id callback identifier
        * @param {Function} callback callback function
        */
        this.onGetSuggestionRequest = function(id, callback) {
            suggestionRequestSubscriber[id] = callback;
        };

        /**
        * @name onSuggestionDataChange
        *
        * @description Receives a callback to be called every time the suggestion data change
        * @param {String} id callback identifier
        * @param {Function} callback callback function
        */
        this.onSuggestionDataChange = function(id, callback) {
            suggestionChangeSubscribers[id] = callback;
        };

        this.isTagSuggestionFromCrop = function() {
            return tagSuggestionFromCrop;
        };

        /**
        * @name getAllSuggestions
        *
        * @description get all suggestions and emit the suggestionsChangeEvent in order to update the subscriber
        */
        this.getAllSuggestions = function() {
            tagSuggestionFromCrop = false;

            //If all suggestion toggle is defined retrieve all suggestion and emit changes
            if (isAllSuggestionAvailable) {
                this.getSuggestedStreams(currentMediaId).then(function(suggestions) {
                    suggestionResult = suggestions;
                    suggestionsChangeEvent();
                }, function() {
                    // If there is an error, let the subscriber know about it
                    suggestionsChangeEvent(true);
                });
            } else {
                suggestionsChangeEvent(true);
            }
        };

        /**
        * @name getCropSuggestions
        *
        * @description get crop suggestions from backend service and emit the suggestionsChangeEvent with new results
        * @param {Number} mediaId
        * @param {String} base64CropImage
        */
        this.getCropSuggestions = function(mediaId, base64CropImage) {
            tagSuggestionFromCrop = true;
            // Emit to the subscriber that a new suggestion request started
            suggestionsRequestEvent();

            adminAPIService.getSuggestionsFromCrop(mediaId, base64CropImage).then(function(suggestions) {
                lastestSuggestions = suggestions;
                suggestionResult = suggestions;
                suggestionsChangeEvent();
            }, function() {
                // If there is an error, let the subscriber know about it
                suggestionsChangeEvent(true);
            });
        };

        /**
        * @name setIsAllSuggestionAvailable
        *
        * @description Set local variable in order to handle the get all suggestion availability
        * @param {Boolean} isAvailable
        */
        this.setIsAllSuggestionAvailable = function(isAvailable) {
            isAllSuggestionAvailable = isAvailable;
        };
    }]);
