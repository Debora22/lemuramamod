'use strict';

angular
.module('expressModeration')
.factory('ExpressModerationHelperFactory', [
    '$rootScope',
    'MasterMind',
    'trackingService',
    'adminAPIService',
    'authService',
    'API_MEDIA_STATUSES_ID',
    'INTERNAL_TRACKING_EVENTS',
    'EXTERNAL_TRACKING_EVENTS',
    function(
        $rootScope,
        MasterMind,
        trackingService,
        adminAPIService,
        authService,
        API_MEDIA_STATUSES_ID,
        INTERNAL_TRACKING_EVENTS,
        EXTERNAL_TRACKING_EVENTS
    ) {
        var customer;
        // Object that reference to the section filters value.
        var filtersValue;
        var exports = {};

        exports.masterMind = new MasterMind({
            preloadContent: true
        });

        exports.resetCustomer = function() {
            return authService.isSessionReady()
            .then(function(session) {
                customer = session.customer;
            });
        };

        exports.nextApproveStatus = function(media) {
            var nextStatus = 0;
            var hasExpressModeration = customer.settings.section_express_moderator;
            var hasPremoderation = customer.settings.premoderation;
            var hasTagging = customer.settings.tagging;
            var isCollectedFromMention = media.source.name === 'instagram' && media.rights_source !== 'follow_collector';
            var isVideo = !!media.video_url;

            if (isVideo && isCollectedFromMention) {
                nextStatus = hasExpressModeration ?
                    API_MEDIA_STATUSES_ID.CUSTOMER_PREMOD :
                    API_MEDIA_STATUSES_ID.PENDING;
                
                if (hasTagging) { 
                    nextStatus = API_MEDIA_STATUSES_ID.TAGGING;
                }
                    
                if (!hasTagging && !hasPremoderation) {
                    nextStatus = API_MEDIA_STATUSES_ID.TAGGING;
                }
            } else {
                nextStatus = hasExpressModeration ?
                    API_MEDIA_STATUSES_ID.CUSTOMER_PREMOD :
                    API_MEDIA_STATUSES_ID.PENDING;

                if (hasTagging) { 
                    nextStatus = API_MEDIA_STATUSES_ID.TAGGING;
                }                
            }

            return nextStatus;
        };

        /**
         * It sets the filters values handled by the tagging controller section in a local variable.
         *
         * @param {Object} filtersData current filter data of the tagging section
         */
        exports.setFiltersValue = function(filtersData) {
            filtersValue = filtersData;
        };

        exports.bulkMedia = function(media) {
            angular.forEach(media, function(entity) {
                var status = exports.nextApproveStatus(entity);
                entity.newStatus = entity.newStatus ? entity.newStatus :
                    (entity.checked ? status : API_MEDIA_STATUSES_ID.QA_PREMOD);
            });
            return adminAPIService.linkStatusToMedia(media).then(function(result) {
                var metadataValue;

                result.stats = {approved: 0, rejected: 0, error: 0};
                media.forEach(function(m) {
                    if (result.data.media[m.id].status === 200) {
                        if (m.newStatus === status) {
                            // Get filters metadata according the current applied filters
                            metadataValue = trackingService.getFilterMetadata(filtersValue);

                            trackingService.event(
                                'media.approved',
                                {
                                    id: m.id,
                                    type: 'media'
                                },
                                undefined,
                                undefined,
                                metadataValue
                            );
                            result.stats.approved++;
                        } else {
                            // Get filters metadata according the current applied filters
                            metadataValue = trackingService.getFilterMetadata(filtersValue, 'reject');

                            trackingService.event(
                                'media.rejected',
                                {
                                    id: m.id,
                                    type: 'media'
                                },
                                undefined,
                                undefined,
                                metadataValue
                            );
                            result.stats.rejected++;
                        }
                    } else {
                        result.stats.error++;
                    }
                });
                trackingService.flush();
                if (result.stats.rejected) {
                    $rootScope.$emit(INTERNAL_TRACKING_EVENTS.media.rejected, result.stats.rejected);
                }
                if (result.stats.approved) {
                    $rootScope.$emit(INTERNAL_TRACKING_EVENTS.media.approved, result.stats.approved);
                }
                return result;

            }).catch(function(e) {
                // force the error to be logged by trackJs by re-throwing it
                var err = (e.data && e.data.data && e.data.data.error_long_message) ?
                    e.data.data.error_long_message : e;
                throw err;
            });
        };

        exports.approveMedia = function(entity) {
            entity[0].newStatus = exports.nextApproveStatus(entity[0]);
            return exports.bulkMedia(entity);
        };

        exports.rejectMedia = function(entity) {
            return exports.bulkMedia(entity);
        };

        /**
         * @name flagMediaAsSpam
         *
         * @description Flag the media selected as spam and track internal events just for the
         * media with a valid response status.
         *
         * @param {array} array of media selected in the library
         *
         * @returns {object} object with the response from the endpoint.
         */
        exports.flagMediaAsSpam = function(entity) {
            return adminAPIService.linkStatusToMedia(entity, API_MEDIA_STATUSES_ID.MOD_SPAM)
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

        return exports;

    }
]);
