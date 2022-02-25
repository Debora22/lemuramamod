'use strict';

/**
 * Subscribers for the user tracking events.
 */

angular
    .module('eventSubscribers.userActionTracker', [])
    .run(['$rootScope', 'externalTrackingFactory', 'sectionService', 'moment', 'EXTERNAL_TRACKING_EVENTS',
        function($rootScope, tracking, section, moment, EXTERNAL_TRACKING_EVENTS) {

        $rootScope.$on(EXTERNAL_TRACKING_EVENTS.user.blacklist, function(event, mediaSelectedLength) {
            tracking.trackEvent({
                category: 'blacklisting_user',
                action: 'userblacklisted_from_' + section.current(),
                value: mediaSelectedLength
            });
        });
    }]);
