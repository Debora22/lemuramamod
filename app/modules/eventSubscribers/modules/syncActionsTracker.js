'use strict';

/**
 * Subscribers for the sync tracking events currently used in the switch account modal.
 */

angular
.module('eventSubscribers.syncActionsTracker', [])
.run([
    '$rootScope',
    'externalTrackingFactory',
    'EXTERNAL_TRACKING_EVENTS',
    function(
        $rootScope,
        externalTracking,
        EXTERNAL_TRACKING_EVENTS
    ) {
        $rootScope.$on(EXTERNAL_TRACKING_EVENTS.syncActions.approved, function(event, differenceValue) {
            externalTracking.trackEvent({
                category: 'sync_issue',
                action: 'sync_issue_approved',
                value: differenceValue
            });
        });

        $rootScope.$on(EXTERNAL_TRACKING_EVENTS.syncActions.rejected, function(event, differenceValue) {
            externalTracking.trackEvent({
                category: 'sync_issue',
                action: 'sync_issue_rejected',
                value: differenceValue
            });
        });

        $rootScope.$on(EXTERNAL_TRACKING_EVENTS.syncActions.tagged, function(event, differenceValue) {
            externalTracking.trackEvent({
                category: 'sync_issue',
                action: 'sync_issue_tagged',
                value: differenceValue
            });
        });
    }]);
