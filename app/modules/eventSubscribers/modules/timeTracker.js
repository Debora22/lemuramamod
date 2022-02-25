'use strict';

/**
 * Subscribers for the user time tracking events.
 */

angular
    .module('eventSubscribers.timeTracker', [])
    .run(['$rootScope', 'externalTrackingFactory', 'EXTERNAL_TRACKING_EVENTS',
        function($rootScope, tracking, EXTERNAL_TRACKING_EVENTS) {

            $rootScope.$on(EXTERNAL_TRACKING_EVENTS.timeTracking.resume, function() {
                tracking.trackEvent({
                    category: 'tracking_time',
                    action: 'timer_resume_button_pressed'
                });
            });

            $rootScope.$on(EXTERNAL_TRACKING_EVENTS.timeTracking.pause, function() {
                tracking.trackEvent({
                    category: 'tracking_time',
                    action: 'timer_pause_button_pressed'
                });
            });
        }]);
