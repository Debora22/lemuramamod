'use strict';

angular
.module('qa')
.factory('qaFactory', [
    '$q',
    '$rootScope',
    'API_MEDIA_STATUSES_ID',
    'INTERNAL_TRACKING_EVENTS',
    'EXTERNAL_TRACKING_EVENTS',
    'MasterMind',
    'adminAPIService',
    'trackingService',
    'modalMediaAnnotationService',
    'loadingService',
    function(
        $q,
        $rootScope,
        API_MEDIA_STATUSES_ID,
        INTERNAL_TRACKING_EVENTS,
        EXTERNAL_TRACKING_EVENTS,
        MasterMind,
        adminAPIService,
        trackingService,
        modalMediaAnnotationService,
        loading
    ) {
        loading.on();
        var customer;
        var genericBackend;
        // Object that reference to the section filters value.
        var filtersValue;
        var exports = {};

        exports.masterMind = new MasterMind({
            cleanLibraryOnLoad: true
        });
        genericBackend = exports.masterMind.backend;

        exports.resetCustomer = function() {
            return adminAPIService.getCustomer().then(function(response) {
                customer = response.data;
                return customer;
            });
        };

        exports.trackAssing = function(entities, data, metadataValue) {
            entities = angular.isArray(entities) ? entities : [entities];
            angular.forEach(entities, function(media) {
                angular.forEach(data.streamsToLink, function(stream) {
                    trackingService.event(
                        'media.tagged',
                        {
                            id: media.id,
                            type: 'media'
                        },
                        undefined,
                        {
                            id: stream.id,
                            type: 'stream'
                        },
                        metadataValue
                    );
                });
                angular.forEach(data.streamsToUnlink, function(stream) {
                    trackingService.event('media.untagged', {id: media.id, type: 'media'}, undefined,
                        {id: stream.id, type: 'stream'});
                });
            });
            if (data.streamsToLink.length === 0 && data.streamsToUnlink.length === 0 && entities.length === 1) {
                trackingService.event(
                    'media.reorder',
                    {
                        id: entities[0].id,
                        type: 'media'
                    }
                );
            }
            trackingService.flush();
        };

        exports.passQAMediaBatch = function(media) {
            var mediaDictionary = {};

            /**
             * @description Add a dictionary with the mediaId as a key and as a value if the media has stream
             * associated or not. Then in the response we evaluate when increase the tagged counter.
             */
            media.forEach(function(media) {
                mediaDictionary[media.id] = !!media.streams.length;
            });

            return adminAPIService.addApproveMetadata(media, true).then(function(response) {
                var approvedMedia = 0;

                Object.keys(response.data.media).forEach(function(mediaId) {
                    if (response.data.media[mediaId].status === 200) {
                        trackingService.event('media.approved', {id: mediaId, type: 'media'});
                        approvedMedia += 1;
                    }
                });

                if (approvedMedia) {
                    $rootScope.$emit(INTERNAL_TRACKING_EVENTS.media.approved, approvedMedia);
                    trackingService.flush();
                }

                return response;
            });
        };

        /**
         * It sets the filters values handled by the qa controller section in a local variable.
         *
         * @param {Object} filtersData current filter data of the qa section
         */
        exports.setFiltersValue = function(filtersData) {
            filtersValue = filtersData;
        };

        exports.rejectMediaBatch = function(batch) {
            return adminAPIService.linkStatusToMedia(batch, API_MEDIA_STATUSES_ID.QA_REJECTED)
                .then(function(response) {
                    var nsfwFilterValue;

                    // If nsfw filter is defined set a new metadata with its value
                    if (filtersValue.query.filters.nsfw) {
                        nsfwFilterValue = [{
                            key: 'nsfwSliderFilterValue',
                            value: filtersValue.query.filters.nsfw.values.range.min.toString()
                        }];
                    }

                    Object.keys(response.data.media).map(function(mediaId) {
                        trackingService.event(
                            'media.rejected',
                            {
                                id: mediaId,
                                type: 'media'
                            },
                            undefined,
                            undefined,
                            nsfwFilterValue
                        );
                    });
                    trackingService.flush();
                    $rootScope.$emit(INTERNAL_TRACKING_EVENTS.media.rejected, Object.keys(response.data.media).length);
                    return response;
                });
        };

        exports.flagMediaAsSpamBatch = function(batch) {
            return adminAPIService.linkStatusToMedia(batch, API_MEDIA_STATUSES_ID.MOD_SPAM)
                .then(function(response) {
                    var mediaAsSpam = 0;

                    Object.keys(response.data.media).map(function(mediaId) {
                        if (response.data.media[mediaId].status === 200) {
                            trackingService.event('media.flagged-as-spam', {id: mediaId, type: 'media'});
                            mediaAsSpam += 1;
                        }
                    });

                    if (mediaAsSpam) {
                        trackingService.flush();
                        $rootScope.$emit(INTERNAL_TRACKING_EVENTS.media.rejected, mediaAsSpam);
                        $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.media.flagAsSpam, mediaAsSpam);
                    }

                    return response;
                });
        };

        /**
         * @name getAnnotations
         *
         * @description
         * get annotations from adminApiService and set annotation to modalMediaAnnotationService
         *
         * @param {Number} mediaId current mediaId
         * @param {Object} streams list of stream linked to media
         */
        exports.getAnnotations = function(mediaId, streams) {
            //Clean previous annotation list saved
            modalMediaAnnotationService.cleanAnnotationList();

            adminAPIService.getAnnotations(mediaId).then(function(annotationResponse) {
                modalMediaAnnotationService.translateAndSetNewAnnotations(annotationResponse, streams);
            });
        };

        // Find a media based on its id attribute
        exports.findMedia = function(entities, entity) {
            return this.findMediaById(entities, entity.id);
        };

        // Find a media based on its id
        exports.findMediaById = function(entities, theId) {
            var entityIndex = -1;
            theId = parseInt(theId);
            angular.forEach(entities, function(media, i) {
                if (theId === media.id) {
                    entityIndex = i;
                }
            });
            return entityIndex;
        };

        return exports;
    }
]);
