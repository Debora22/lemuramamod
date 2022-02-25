'use strict';

/**
 * Subscribers for tagging suggestions (Cosimo implementation)
 */

angular
.module('eventSubscribers.taggingSuggestionTracker', [])
.run([
    '$rootScope',
    'externalTrackingFactory',
    'sectionService',
    'ROME_MODAL_EVENTS',
    'ROME_TAGGING_EVENTS',
    'EXTERNAL_TRACKING_CUSTOM_DIMENSIONS',
    function(
        $rootScope,
        tracking,
        section,
        ROME_MODAL_EVENTS,
        ROME_TAGGING_EVENTS,
        EXTERNAL_TRACKING_CUSTOM_DIMENSIONS
    ) {

        var isValidSection = function() {
            var currentSection = section.current();
            return (currentSection === 'tagging' || currentSection === 'moderation' || currentSection === 'qa');
        };

        $rootScope.$on(ROME_MODAL_EVENTS.opened, function() {
            if (isValidSection()) {
                tracking.startTimer('untilFirstTag');
            }
        });

        $rootScope.$on(ROME_MODAL_EVENTS.closed, function() {
            if (isValidSection()) {
                tracking.dismissTimer('untilFirstTag');
            }
        });

        $rootScope.$on(ROME_MODAL_EVENTS.move, function() {
            if (isValidSection()) {
                tracking.restartTimer('untilFirstTag');
            }
        });

        $rootScope.$on(ROME_TAGGING_EVENTS.suggestions.available, function() {
            if (isValidSection()) {
                tracking.trackEvent({
                    category: '_tagging_productivity_suggestions-available-or-not',
                    action: '_tagging_modal_tagging_available-suggestions'
                });
            }
        });

        $rootScope.$on(ROME_TAGGING_EVENTS.suggestions.unavailable, function() {
            if (isValidSection()) {
                tracking.trackEvent({
                    category: '_tagging_productivity_suggestions-available-or-not',
                    action: '_tagging_modal_tagging_unavailable-suggestions'
                });
            }
        });

        $rootScope.$on(ROME_TAGGING_EVENTS.stream.addAfterSuggestion, function(event, data, hasHotspot) {
            if (isValidSection()) {
                tracking.setField(EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.hasHotspot,
                    hasHotspot ? 'With hotspot' : 'Without hotspot');

                tracking.trackTimeWithTimer('untilFirstTag', {
                    category: '_tagging_productivity_tagging-speed',
                    action: '_tagging_modal_add-first-product-tag_from-' + data.from
                });

                tracking.setField(EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.hasHotspot, null);

                // if streamHasBeenSuggested is defined means we set the custom dimension for the event.
                if (data.streamHasBeenSuggested) {
                    tracking.setField(EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.streamHasBeenSuggested,
                        data.streamHasBeenSuggested);
                }

                tracking.trackEvent({
                    category: '_tagging_productivity_suggestions-used-or-not',
                    action: '_tagging_modal_add-product-tag_from-' + data.from
                });

                // We unset the custom dimension
                tracking.setField(EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.streamHasBeenSuggested, null);
            }
        });

        $rootScope.$on(ROME_TAGGING_EVENTS.stream.add, function(event, customDimensionData) {
            if (isValidSection()) {
                //Set custom dimensions
                tracking.setField(
                    EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.streamId,
                    customDimensionData.streamId
                );
                tracking.setField(
                    EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.hasHotspot,
                    customDimensionData.hasHotspot ? 'With hotspot' : 'Without hotspot'
                );
                tracking.setField(
                    EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.taggingFrom,
                    customDimensionData.taggingFrom
                );
                tracking.setField(
                    EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.suggestionsActive,
                    customDimensionData.suggestionsActive
                );
                tracking.setField(
                    EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.mediaId,
                    customDimensionData.mediaId
                );

                tracking.trackEvent({
                    category: '_tagging_productivity',
                    action: '_tagging_modal_add_product_tag'
                });

                //Reset custom dimension
                tracking.setField(EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.streamId, null);
                tracking.setField(EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.hasHotspot, null);
                tracking.setField(EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.taggingFrom, null);
                tracking.setField(EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.suggestionsActive, null);
                tracking.setField(EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.mediaId, null);
            }
        });

        $rootScope.$on(ROME_TAGGING_EVENTS.stream.position, function(event, streamPosition) {
            if (isValidSection()) {
                tracking.trackEvent({
                    category: 'EXPERIMENT_TaggingFromSuggestionsOrder',
                    action: 'EXPERIMENT_TaggedFromSuggestion' + streamPosition,
                    value: 1
                });
            }
        });
    }]);
