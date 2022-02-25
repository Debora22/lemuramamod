'use strict';

/**
 * @ngdoc component
 * @name opModerationTimeTracker
 *
 * @description
 *
 * This component displays the moderator working time, it requires to be started and stopped with
 * moderationTimeTrackingService 'start' and 'stop' methods
 *
 */

var componentController = ['$timeout', 'internalTrackingService', 'angularPopupBoxes', 'loadingService',
    function($timeout, internalTrackingService, angularPopupBoxes, loadingService) {
        var ctrl = this;

        /**
         * After selecting an account, we validate if previous session was closed without submitting the activity form.
         * If so, we display a popup warning the user about this situation.
         */
        function checkUncommittedWork(value) {
            if (value.approved > 0 || value.rejected > 0 || value.tagged > 0) {

                angularPopupBoxes.confirm('<h1>Something went wrong</h1>' +
                    '<p>Some actions were not submitted and the counter was not reset.</p>' +
                    '<p>You can continue working from the last automatically saved state.</p>',
                    { cancelText: false }
                );
            }
        }

        /**
         * Update the displayed values
         */
        function updateValues(data) {
            ctrl.tagged = data.tagged || '0';
            ctrl.approved = data.approved || '0';
            ctrl.rejected = data.rejected || '0';
        }

        // set the tracker with initial value
        ctrl.$onInit = function() {
            ctrl.tagged = 0;
            ctrl.approved = 0;
            ctrl.rejected = 0;

            internalTrackingService.onInit(function(data) {
                updateValues(data);

                //For user experience purpose, we display a popup only when the loading icon disappears
                if (loadingService.loading) {
                    var unsubscribe = loadingService.onLoadingOff(function() {
                        checkUncommittedWork(data);
                        unsubscribe();
                    });
                } else {
                    checkUncommittedWork(data);
                }
            });

            internalTrackingService.onCounterChange(function(data) {
                updateValues(data);
            });

            //In case the user refresh the page, we make sure the last status is displayed
            //We make it within a timeout since there is an issue when making the rest request
            //to the action tracking api right after the page is loaded from history (Ctrl+Shift+T), it
            //returns a cached response.
            $timeout(function() {
                internalTrackingService.refresh();
            }, 1000);
        };
    }];

angular
.module('uiWidgets')
.component('opModerationActionTracker', {
    templateUrl: 'uiWidgets/moderationActionTracker/moderationActionTracker.html',
    controller: componentController
});
