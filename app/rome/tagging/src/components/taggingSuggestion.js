'use strict';

/**
 * @ngdoc component
 * @name op.taggingSuggestion
 *
 * @description
 * This component displays suggested streams to be used to tag media element.
 * It is intended to be reused in any place where the tagging process takes place.
 *
 * @param
 *  - media: Media entity opened in modal.
 *  - showSuggestion: True to show suggestions while the user is searching or not for a stream.
 *  - onStreamClick: Callback function to be called when user clicks on a suggested stream.
 *  - hover: Callback function to be called when the user hover on a suggested stream.
 *  - remove: Callback to be called when the user remove a tagged stream from the suggested item.
 *  - checkIfExists: Callback to be called in order to check if the item is already in the entities array.
 */

var componentController = [
    'ROME_TAGGING_EVENTS',
    'taggingSuggestionService',
    '$scope',
    function(
        ROME_TAGGING_EVENTS,
        taggingSuggestionService,
        $scope
    ) {
    var ctrl = this;

    ctrl.suggestions = [];
    ctrl.showLoadingSuggestion = false;
    ctrl.displayCategory = false;

    /**
     * @name emitUnavailableSuggestionsEvent
     *
     * @description Emit unavailable event for the taggingSubscriber.
     */
    var emitUnavailableSuggestionsEvent = function() {
        $scope.$emit(ROME_TAGGING_EVENTS.suggestions.unavailable, {
            suggestions: []
        });
    };

    var displayCategory = function(streams) {
        return Object.keys(streams).some(function(category) {
            return category !== 'uncategorized';
        });
    };

    /**
     * @name getSuggestedStream
     *
     * @description Get suggested stream for a media using the suggested cache when it's available
     */
    var getSuggestedStreams = function() {
        ctrl.showLoadingSuggestion = true;
        taggingSuggestionService.getSuggestedStreams(ctrl.media[0].id)
            .then(function(streams) {
                ctrl.suggestions = streams;
                ctrl.displayCategory = displayCategory(streams);

                if (Object.keys(streams).length > 0) {
                    $scope.$emit(ROME_TAGGING_EVENTS.suggestions.available, {
                        suggestions: streams
                    });
                } else {
                    emitUnavailableSuggestionsEvent();
                }
            }, function() {
                ctrl.suggestions = null;
                emitUnavailableSuggestionsEvent();
            })
            .finally(function() {
                ctrl.showLoadingSuggestion = false;
            });
    };

    $scope.checkIfExists = function(itemId) {
        return ctrl.checkIfExists({id: itemId});
    };

    $scope.hover = function(action, item) {
        return ctrl.hover({action: action, item: item});
    };

    $scope.add = function(item, suggestion, suggestedStreamIndex) {
        //emit the position of the suggested stream with the following format:
        //given suggestedStreamIndex as 0, the position to send will be '01'.
        $scope.$emit(ROME_TAGGING_EVENTS.stream.position, '0' + (suggestedStreamIndex + 1));

        ctrl.add({
            item: item,
            section: suggestion,
            position: (suggestedStreamIndex + 1).toString()
        });
    };

    $scope.remove = function(item, index, byId) {
        ctrl.remove({item: item, $index: index, byId: byId});
    };

    /**
     * @name $onInit
     *
     * @description Called when the user open the modal and also move to the next/prev media from
     * the modal since $onInit is called everytime the controller is initialized.
     */
    ctrl.$onInit = function() {
        taggingSuggestionService.setIsAllSuggestionAvailable(ctrl.isSuggestionAvailable);

        if (ctrl.isSuggestionAvailable) {
            getSuggestedStreams();
        } else {
            // All suggestion unavailable show empty suggestion
            ctrl.suggestions = null;
        }

        // Subscribing to the suggestion data change
        taggingSuggestionService.onSuggestionDataChange('taggingDirective', function(suggestions, error) {
            // Hide loading indicator when the request finish
            ctrl.showLoadingSuggestion = false;

            // If there is some error in the new suggestion data
            if (error) {
                ctrl.suggestions = null;
            } else {
                ctrl.suggestions = suggestions;
                ctrl.displayCategory = displayCategory(suggestions);
            }
        });

        // Subscribing to the suggestion request
        taggingSuggestionService.onGetSuggestionRequest('taggingDirective', function() {
            ctrl.suggestions = null;
            // Show loading indicator while the request is in process
            ctrl.showLoadingSuggestion = true;
        });
    };
}];

angular
    .module('op.tagging')
    .component('opTaggingSuggestion', {
        templateUrl: ['rome', function(rome) {
            return rome.getTemplatesPath('tagging') + 'taggingSuggestion.html';
        }],
        controller: componentController,
        bindings: {
            media: '<',
            showSuggestion: '<',
            isSuggestionAvailable: '<',
            add: '&',
            hover: '&',
            remove: '&',
            checkIfExists: '&'
        }
    });
