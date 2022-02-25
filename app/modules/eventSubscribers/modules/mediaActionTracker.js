'use strict';

/**
 * Subscribers for the media tracking events.
 */

angular
.module('eventSubscribers.mediaActionTracker', [])
.run([
    '$rootScope',
    'sectionService',
    'externalTrackingFactory',
    'internalTrackingService',
    'filterTrackingHelper',
    'INTERNAL_TRACKING_EVENTS',
    'EXTERNAL_TRACKING_EVENTS',
    function(
        $rootScope,
        section,
        externalTracking,
        internalTracking,
        filterTrackingHelper,
        INTERNAL_TRACKING_EVENTS,
        EXTERNAL_TRACKING_EVENTS
    ) {
        $rootScope.$on(INTERNAL_TRACKING_EVENTS.media.approved, function(event, mediaLength) {
            internalTracking.trackAction('approved', mediaLength);
            filterTrackingHelper.mediaActionExecuted('approved', mediaLength);
        });

        $rootScope.$on(INTERNAL_TRACKING_EVENTS.media.rejected, function(event, mediaLength) {
            internalTracking.trackAction('rejected', mediaLength);
            filterTrackingHelper.mediaActionExecuted('rejected', mediaLength);
        });

        $rootScope.$on(INTERNAL_TRACKING_EVENTS.media.tagged, function(event, taggedMedia) {
            internalTracking.trackAction('tagged', taggedMedia);
            filterTrackingHelper.mediaActionExecuted('tagged', taggedMedia);
        });

        $rootScope.$on(EXTERNAL_TRACKING_EVENTS.media.flagAsSpam, function(event, mediaAsSpam) {
            externalTracking.trackEvent({
                category: 'flagged_as_spam',
                action: 'media_flagged_as_spam_from_' + section.current(),
                value: mediaAsSpam
            });
            filterTrackingHelper.mediaActionExecuted('flagged_as_spam', mediaAsSpam);
        });
    }]);
