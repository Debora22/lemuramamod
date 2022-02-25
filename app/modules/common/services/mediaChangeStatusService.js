'use strict';

/**
 * @ngdoc service
 * @name mediaChangeStatusService
 * @description
 * this service change the status of a media and emit the events to track it
 */

angular
    .module('common')
    .service('mediaChangeStatusService', [
        '$q',
        '$rootScope',
        'trackingService',
        'adminAPIService',
        'INTERNAL_TRACKING_EVENTS',
        'API_MEDIA_STATUSES_ID',
        function(
            $q,
            $rootScope,
            trackingService,
            adminAPIService,
            INTERNAL_TRACKING_EVENTS,
            API_MEDIA_STATUSES_ID
        ) {
            /**
             * @name statusMatching
             * @description This dictionary is intended to provide the next media status based on
             * the current status and the applied action. In further versions it should include
             * all other possible actions, for now it includes only "reject".
             *
             */
            var statusMatching = {};
            statusMatching[API_MEDIA_STATUSES_ID.PREMOD] = {
                reject: API_MEDIA_STATUSES_ID.QA_PREMOD
            };
            statusMatching[API_MEDIA_STATUSES_ID.TAGGING] = {
                reject: API_MEDIA_STATUSES_ID.QA_TAGGING
            };
            statusMatching[API_MEDIA_STATUSES_ID.PENDING] = {
                reject: API_MEDIA_STATUSES_ID.QA_REJECTED
            };
            statusMatching[API_MEDIA_STATUSES_ID.SFL] = {
                reject: API_MEDIA_STATUSES_ID.QA_REJECTED
            };

            /**
             * @name validateAllSelectedMediaHasSameStatusId
             * @description Validate that all the media selected has the same status id, if
             * not return false.
             *
             * @param {Array} media Array of selectedMedia
             */
            function validateAllSelectedMediaHasSameStatusId(media) {
                var mediaStatusId = media[0].status_id;
                var validMedia = true;

                media.forEach(function(media) {
                    if (mediaStatusId !== media.status_id) {
                        validMedia = false;
                    }
                });

                return validMedia;
            }

            /**
             * @name rejectMedia
             * @description Reject the media and emit external and trackingService events
             *
             * @param {Array} media Array of media to reject
             */
            this.rejectMedia = function(media) {
                var deferred = $q.defer();

                if (validateAllSelectedMediaHasSameStatusId(media)) {
                    adminAPIService.linkStatusToMedia(media, statusMatching[media[0].status_id].reject)
                        .then(function(response) {
                            Object.keys(response.data.media).map(function(mediaId) {
                                trackingService.event('media.rejected', {id: mediaId, type: 'media'});
                            });
                            trackingService.flush();

                            $rootScope.$emit(INTERNAL_TRACKING_EVENTS.media.rejected,
                                Object.keys(response.data.media).length);

                            deferred.resolve(response);
                        });
                } else {
                    deferred.reject();
                }

                return deferred.promise;
            };
        }]);
