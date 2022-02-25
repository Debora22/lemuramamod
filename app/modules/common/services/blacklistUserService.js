'use strict';

/**
 * @ngdoc service
 * @name blaclistUserService
 * @description
 * This service is used to blacklist users and emit blacklist events.
 */

angular
    .module('common')
    .service('blacklistUserService', [
        '$rootScope',
        'EXTERNAL_TRACKING_EVENTS',
        'adminAPIService',
        'trackingService',
        function(
            $rootScope,
            EXTERNAL_TRACKING_EVENTS,
            adminAPIService,
            trackingService
        ) {

            /**
             * @name blacklistUser
             * @description blacklist user with adminAPIService and emit external and trackv2 events
             *
             * @param {Array} selectedMedia Array of media selected in order to blacklist user
             */
            this.blacklistUser = function(selectedMedia) {
                return adminAPIService.blacklistUser(selectedMedia)
                    .then(function(blackListResponse) {
                    // Send blacklist information to GA
                    $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.user.blacklist, selectedMedia.length);

                    // Send trackv2 information about blacklisted users
                    blackListResponse.data.user_blacklist.forEach(function(userBlackListed) {
                        if (userBlackListed.status === 200) {
                            trackingService.event('users.blacklisted',
                                {id: userBlackListed.user_id, type: 'user'});
                        }
                    });
                    trackingService.flush();

                    return blackListResponse;
                });
            };
        }]);
