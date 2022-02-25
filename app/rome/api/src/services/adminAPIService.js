'use strict';

/**
 * @ngdoc service
 * @name  op.api.adminAPIService
 */
angular
    .module('op.api')
    .service('adminAPIService', ['$http', '$q', 'apiConfig', 'appConstant', 'apiService',
    function($http, $q, apiConfig, appConstant, APIService) {

        var exports = {};
        var endpoints = apiConfig.adminAPI.endpoints;
        var middlewareURL = appConstant.adminAPI2.url;
        var oldBaseURL = appConstant.adminAPI.url; // TODO deprecate

        var getBaseUrl = function(key) {
            return appConstant
                .base_image
                .url + key[0] + '/' + key[1] + '/' + key[2] + '/' + key + '/normal.jpg';
        };

        var getBase = function(n, base) {
            base = base || 33;
            n = parseInt(n);
            var codeset = '23456789abcdefghijkmnopqrstuvwxyz',
                key = '';
            while (n > 0) {
                key += codeset[n % base];
                n = Math.floor(n / base);
            }
            return key;
        };

        var streamNormalizer = function(stream) {
            var key = getBase(stream.base_media.id);
            if (key.length) {
                stream.image = getBaseUrl(key);
                stream.base_image = stream.image;
            }
            stream.title = stream.name;
            return stream;
        };

        /**
         * @name _assign
         *
         * @description
         * Replace a string with the value of the a given Object
         * @param {String} str  The base string.
         * @param {Object} replaceWith  Object key, value with the data to replace.
         * @return {String} The result string.
         */
        var _assign = function(str, replaceWith) {
            angular.forEach(replaceWith, function(value, key) {
                str = str.replace('{' + key + '}', value);
            });

            return str;
        };

        exports.streamNormalizer = streamNormalizer;

        /**
         * @name getMediaWithGivenRights
         *
         * @description
         * Get a list of media which rights have been given by their authors.
         *
         * @param {Integer} page  Optional.The results page number.
         * @param {Integer} limit Optional. How many results per page.
         * @param {String} direction Optional. Could be 'asc' or 'desc'. Default 'asc'
         * @return {Promise}
         */
        exports.getMediaWithGivenRights = function(page, limit, direction) {
            return APIService.get(oldBaseURL + endpoints.rights.given, {
                page: page || 1,
                limit: limit || 20,
                direction: direction || 'asc',
                sort: 'given_date'
            });
        };

        /**
         * @name getMediaWithRequestedRights
         *
         * @description
         * Get a list of media which rights have been requested but not approved
         * or rejected yet.
         *
         * @param {Integer} page  Optional.The results page number.
         * @param {Integer} limit Optional. How many results per page.
         * @param {String} direction Optional. Could be 'asc' or 'desc'. Default 'asc'
         * @return {Promise}
         */
        exports.getMediaWithRequestedRights = function(page, limit, direction) {
            return APIService.get(oldBaseURL + endpoints.rights.requested, {
                page: page || 1,
                limit: limit || 20,
                direction: direction || 'asc',
                sort: 'request_date'
            });
        };

        /**
         * @name sendCommentInBulk
         *
         * @description
         * Sends a comment for a batch of media entities
         *
         * @param  {Array}   mediaList  An array of media entities
         * @param  {Integer} customerId
         * @param  {String}  message    The comment text
         * @return {Promise}
         */
        exports.sendCommentInBulk = function(mediaList, customerId, message) {
            var assigments = {
                message: message,
                customer_id: customerId
            };
            if (mediaList.length === 1) {
                assigments.media_id = mediaList[0].id;
            } else {
                assigments.media_ids = mediaList.map(function(media) {
                    return media.id;
                });
            }
            return APIService.post(oldBaseURL + endpoints.comments, assigments);
        };

        /**
         * @name blacklistUser
         *
         * @description
         * Blacklists users from a given group of medias
         *
         * @param {Array} medias An array of media entities
         *
         * @return {Promise}
         */
        exports.blacklistUser = function(media) {
            var usersList = [];

            angular.forEach(media, function(medium) {
                usersList.push({
                    user_id: medium.user.id,
                    source_name: medium.source.name
                });
            });

            return APIService.post(middlewareURL + endpoints.blacklist, {
                users_list: usersList
            });
        };

        /**
         * @name getSuggestionsFromCrop
         * @description
         * get stream suggestions given a mediaId and a crop base64 image
         *
         * @param {Number} mediaId
         * @param {String} base64CropImage
         * @return {Promise}
         */
        exports.getSuggestionsFromCrop = function(mediaId, base64CropImage) {
            var endpoint = _assign(middlewareURL + endpoints.media.postCropSuggestions, {
                mediaId: mediaId
            });

            return APIService.post(endpoint, {
                image: base64CropImage
            }).then(function(response) {
                Object.keys(response.data.streams).forEach(function(category) {
                    response.data.streams[category] = response.data.streams[category].map(streamNormalizer);
                });

                return response.data.streams;
            });
        };

        /**
         * @name getMediaPositions
         * @desc Get the entire media positions map by a give stream id
         * @param {Integer} streamId
         * @return {Promise}
         */
        exports.getMediaPositions = function(streamId, itemsPerPage) {
            return APIService.get(
                middlewareURL + _assign(endpoints.stream.mediaPositions, {
                    streamId: streamId
                }), { count: itemsPerPage }
            );
        };

        /**
         * @name hydrateMedia
         * @desc Get media by id or id's
         * @param {Int|Array} media
         * @return {Promise}
         */
        exports.hydrateMedia = function(media) {
            if (Array.isArray(media) && media.length > 1) {
                return APIService.get(middlewareURL + endpoints.media.bulk, {
                    media_ids: media.join(',')
                });
            } else {
                return APIService.get(middlewareURL + _assign(endpoints.media.single, {
                    mediaId: Array.isArray(media) ? media[0] : media
                }));
            }
        };

        /**
         * @name postMediaPositions
         * @desc Post the entire media positions map for a give stream id
         * @param {Integer} streamId
         * @return {Promise}
         */
        exports.postMediaPositions = function(streamId, data) {
            return APIService.post(
                middlewareURL + _assign(endpoints.stream.mediaPositions, {
                    streamId: streamId
                }
            ), data);
        };

        /**
         * @name getSuggestedStream
         * @desc Get suggested stream for tagging a media
         * @param {string} mediaId
         * @return {Promise}
         */
        exports.getSuggestedStream = function(mediaId) {
            return APIService.get(middlewareURL + _assign(endpoints.media.getSuggestedStream, {
                mediaId: mediaId
            })).then(function(response) {
                Object.keys(response.data.streams).forEach(function(category) {
                    response.data.streams[category] = response.data.streams[category].map(streamNormalizer);
                });
                return response.data.streams;
            });
        };

        /**
         * @name getStreamsPositions
         * @desc Get streams positions for a given media
         * @param {Array} mediaId
         * @return {Promise}
         */
        exports.getStreamsPositions = function(mediaId) {
            return APIService.get(middlewareURL + endpoints.media.getStreamPositions, {
                media_ids: mediaId.toString()
            }).then(function(response) {
                var result = {};
                mediaId.forEach(function(id) {
                    result[id] = response.data.stream_positions[id].streams
                    .map(function(streamId) {
                        return angular.copy(response.data.streams[streamId]);
                    });
                }, function(err) {
                    return (err.status === 404) ? $q.when({}) : $q.reject(err);
                });
                return result;
            });
        };

        /**
         * @name postStreamsPositions
         * @desc Set streams positions for a given medium ID
         * @param {Integer} mediaId
         * @param {Object} positions. Must contain propertires `link`, `unlink`, and `positions`.
         *                            Check AdminAPI docs for more info
         * @return {Promise}
         */
        exports.postStreamsPositions = function(mediaId, data) {
            var endpoint = middlewareURL + (angular.isArray(mediaId) ?
                    endpoints.media.postStreamPositionsBulk : endpoints.media.postStreamPositions
                );
            endpoint = _assign(endpoint, {mediaId: mediaId});
            return APIService.post(endpoint, data).then(function(response) {
                var result = {};
                (angular.isArray(mediaId) ? mediaId : [mediaId]).forEach(function(mId) {
                    result[mId] = response.data.stream_positions[mId].streams.map(function(streamId) {
                        return angular.copy(response.data.streams[streamId]);
                    });
                });
                return result;
            });
        };

        /**
         * @name addApproveMetadata
         * @desc Set approve metadata to the following media batch
         *
         * @param {Array} media array of valid medias id
         * @param {boolean} value that specify the media has been QA approved or not
         *
         * @return {Promise}
         */
        exports.addApproveMetadata = function(media, value) {
            var data = {
                media: [],
                value: value,
            };
            media.forEach(function(item) {
                data.media.push(item.id);
            });

            return APIService.put(middlewareURL + endpoints.media.metadataApprove, null, data);
        };

        /**
         * @name linkStatusToMedia
         * @desc Link a batch of medias to a new status
         * @param {Array} media array of valid medias id
         * @param {Integrer} newStatus valid status id
         * @return {Promise}
         */
        exports.linkStatusToMedia = function(media, newStatus) {
            var data = {
                media: {}
            };
            media.forEach(function(item) {
                data.media[item.id] = {status_id: angular.isDefined(item.newStatus) ? item.newStatus : newStatus};
            });
            return APIService.put(middlewareURL + endpoints.media.status, null, data);
        };

        /**
         * @name getCustomer
         * @desc Get the actual customer info
         * @return {Promise}
         */
        exports.getCustomer =  function() {
            return APIService.get(appConstant.adminAPI2.url + endpoints.customer.getCustomer, {});
        };

        /**
         * @name extractStreamPositions
         * @desc
         * @return
         */
        exports.extractStreamPositions = function(response, id, normalize) {
            return response.data.stream_positions[id].streams.map(function(streamId) {
                return angular.copy(normalize ?
                    streamNormalizer(response.data.streams[streamId]) :
                    response.data.streams[streamId]
                );
            });
        };

        /**
         * @name getAnnotations
         * @desc Get annotation information for the given media id
         * @param {int} mediaId
         * @return {Promise}
         */
        exports.getAnnotations =  function(mediaId) {
            return APIService.get(middlewareURL + _assign(endpoints.media.getAnnotations, {
                mediaId: mediaId
            })).then(function(response) {
                return response;
            });
        };

        return exports;
    }]);
