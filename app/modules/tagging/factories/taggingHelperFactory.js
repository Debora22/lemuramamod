'use strict';

angular
.module('tagging')
.factory('TaggingHelperFactory', [
    '$q',
    '$rootScope',
    'API_MEDIA_STATUSES_ID',
    'INTERNAL_TRACKING_EVENTS',
    'EXTERNAL_TRACKING_EVENTS',
    'MasterMind',
    'adminAPIService',
    'authService',
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
        authService,
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
            return authService.isSessionReady()
            .then(function(session) {
                customer = session.customer;
                return customer;
            });
        };

        exports.nextApproveStatus = function() {
            if (customer && customer.settings.section_express_moderator) {
                return API_MEDIA_STATUSES_ID.PREMOD;
            }
            return API_MEDIA_STATUSES_ID.PENDING;
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

        exports.approveMediaBatch = function(media) {
            var mediaDictionary = {};

            /**
             * @description Add a dictionary with the mediaId as a key and as a value if the media has stream
             * associated or not. Then in the response we evaluate when increase the tagged counter.
             */
            media.forEach(function(media) {
                mediaDictionary[media.id] = !!media.streams.length;
            });

            var allPromises = [];
            allPromises.push(adminAPIService.linkStatusToMedia(media, exports.nextApproveStatus()));

            if (customer.settings.modsquad_moderation_qa_flow) {
                allPromises.push(adminAPIService.addApproveMetadata(media, false));
            }

            return $q.all(allPromises).then(function(allResponses) {
                var response = allResponses[0];
                var approvedMedia = 0;
                var taggedMedia = 0;
                // get filters metadata according the current applied filters
                var metadataValue = trackingService.getFilterMetadata(filtersValue);

                Object.keys(response.data.media).forEach(function (mediaId) {
                    if (response.data.media[mediaId].status === 200) {
                        trackingService.event(
                            'media.approved',
                            {
                                id: mediaId,
                                type: 'media'
                            },
                            undefined,
                            undefined,
                            metadataValue
                        );
                        approvedMedia += 1;

                        // Check with the dictionary if the media has streams associated.
                        if (mediaDictionary[mediaId]) {
                            taggedMedia += 1;
                        }
                    }
                });

                if (approvedMedia) {
                    trackingService.flush();
                    $rootScope.$emit(INTERNAL_TRACKING_EVENTS.media.approved, approvedMedia);
                }

                if (taggedMedia) {
                    $rootScope.$emit(INTERNAL_TRACKING_EVENTS.media.tagged, taggedMedia);
                }

                return response;
            });
        };

        /**
         * It sets the filters values handled by the tagging controller section in a local variable.
         *
         * @param {Object} filtersData current filter data of the tagging section
         */
        exports.setFiltersValue = function(filtersData) {
            filtersValue = filtersData;
        };

        exports.rejectMediaBatch = function(batch) {
            return adminAPIService.linkStatusToMedia(batch, API_MEDIA_STATUSES_ID.QA_TAGGING)
                .then(function(response) {
                    // Get filters metadata according the current applied filters
                    var metadataValue = trackingService.getFilterMetadata(filtersValue, 'reject');

                    Object.keys(response.data.media).map(function(mediaId) {
                        trackingService.event(
                            'media.rejected',
                            {
                                id: mediaId,
                                type: 'media'
                            },
                            undefined,
                            undefined,
                            metadataValue
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
