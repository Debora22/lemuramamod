'use strict';

angular
.module('moderation')
.factory('ModerationBackend', [
    '$q',
    '$rootScope',
    'API_MEDIA_STATUSES_ID',
    'INTERNAL_TRACKING_EVENTS',
    'EXTERNAL_TRACKING_EVENTS',
    'MasterMind',
    'adminAPIService',
    'modalMediaAnnotationService',
    'authService',
    'trackingService',
    function(
        $q,
        $rootScope,
        API_MEDIA_STATUSES_ID,
        INTERNAL_TRACKING_EVENTS,
        EXTERNAL_TRACKING_EVENTS,
        MasterMind,
        adminAPIService,
        modalMediaAnnotationService,
        authService,
        trackingService
    ) {
        var customer;
        var genericBackend;
        var exports = {};
        // Object that reference to the section filters value.
        var filtersValue;

        exports.masterMind = new MasterMind();
        genericBackend = exports.masterMind.backend;

        exports.resetCustomer = function() {
            return authService.isSessionReady()
            .then(function(session) {
                customer = session.customer;
                return customer;
            });
        };
        exports.resetCustomer();

        /**
         * It sets the filters values handled by the moderation controller section in a local variable.
         *
         * @param {Object} filtersData current filter data of the moderation section
         */
        exports.setFiltersValue = function(filtersData) {
            filtersValue = filtersData;
        };

        // Rejected
        exports.reject = function(batch) {
            return adminAPIService.linkStatusToMedia(batch, API_MEDIA_STATUSES_ID.QA_REJECTED)
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

        // SFL
        exports.putOnSFL = function(batch) {
            return adminAPIService.linkStatusToMedia(batch, API_MEDIA_STATUSES_ID.SFL)
                .then(function(response) {
                    Object.keys(response.data.media).map(function(mediaId) {
                        trackingService.event('media.saved-for-later', {id: mediaId, type: 'media'});
                    });
                    trackingService.flush();
                    $rootScope.$emit(INTERNAL_TRACKING_EVENTS.media.approved, Object.keys(response.data.media).length);
                    return response;
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

        // Spam
        exports.flagMediaAsSpam = function(batch) {
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

        // Pending
        exports.putOnPending = function(batch) {
            return adminAPIService.linkStatusToMedia(batch, API_MEDIA_STATUSES_ID.PENDING)
                .then(function(response) {
                    Object.keys(response.data.media).map(function(mediaId) {
                        trackingService.event('media.sent-to-pending', {id: mediaId, type: 'media'});
                    });
                    trackingService.flush();
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

        return exports;
    }
]);
