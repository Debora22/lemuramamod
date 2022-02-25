'use strict';

/**
 * Subscribers for the filter tracking events.
 */

angular
    .module('eventSubscribers.filterTracker', [])
    .run(['$rootScope', 'externalTrackingFactory', 'EXTERNAL_TRACKING_EVENTS',
        function($rootScope, tracking, EXTERNAL_TRACKING_EVENTS) {

        $rootScope.$on(EXTERNAL_TRACKING_EVENTS.filters.hit, function(event, filterName) {
            tracking.trackEvent({
                category: 'filters_hit',
                action: filterName,
                label: JSON.stringify(
                    {
                        customer_id: tracking.getConfig('customer_id')
                    }
                ),
                value: 1
            });
        });

        $rootScope.$on(EXTERNAL_TRACKING_EVENTS.filters.mediaAction, function(event, mediaAction) {
            tracking.trackEvent({
                category: 'filters_hit',
                action: mediaAction.name,
                label: JSON.stringify(
                    {
                        customer_id: tracking.getConfig('customer_id'),
                        filters: mediaAction.filters
                    }
                ),
                value: mediaAction.value || 1
            });
        });
    }]);
