'use strict';

/**
 * @ngdoc function
 * @name theme.controller:switchAccountController
 * @description
 * # switchAccountController
 * Controller for switch account/logout popup
 */
angular.module('base')
.controller('switchAccountController', [
    '$scope',
    '$q',
    '$timeout',
    '$uibModalInstance',
    'moment',
    'appConstant',
    'trackingAPIService',
    'notifications',
    'internalTrackingService',
    'EXTERNAL_TRACKING_EVENTS',
    'actionType',
    function(
        $scope,
        $q,
        $timeout,
        $uibModalInstance,
        moment,
        appConstant,
        trackingAPIService,
        growl,
        internalTrackingService,
        EXTERNAL_TRACKING_EVENTS,
        actionType
    ) {
        var promises = [];
        var retryTimes;

        /**
         * @name trackActionCounterDifference
         * @description track with GA the current difference between the backend actions values and the
         * frontend values.
         *
         * @param {String} action Posible values are 'approved', 'rejected', 'tagged'
         * @param {int} differenceValue Counter difference
         */
        function trackActionCounterDifference(action, differenceValue) {
            $scope.$emit(EXTERNAL_TRACKING_EVENTS.syncActions[action], differenceValue);
        }

        $scope.stats = {
            loading: true
        };

        $scope.error = {
            isError: false,
            message: ''
        };

        $scope.confirmText = actionType === 'switchAccount' ? 'SUBMIT & SWITCH ACCOUNTS' : 'SUBMIT & LOGOUT';

        /**
         * @name updateSuggestedValues
         * @desc It updates the suggested values so they can be compared with edited values
         */
        function updateSuggestedValues() {
            $scope.suggestedValues = {
                approved: $scope.stats.approved,
                rejected: $scope.stats.rejected,
                tagged: $scope.stats.tagged,
                hours: $scope.stats.hours,
                minutes: $scope.stats.minutes
            };
        }

        /**
         * @name setActionCounters
         * @description It sets the counter values in the scope and validate if there are
         * differences to it can be tracked.
         *
         * @param {String} values to be displayed
         * @param {object} differences between frontend counters and backend counters
         */
        function setActionCounters(values, differences) {
            $scope.stats.approved = parseInt(values.APPROVED) || 0;
            $scope.stats.rejected = parseInt(values.REJECTED) || 0;
            $scope.stats.tagged = parseInt(values.TAGGED) || 0;

            if (Array.isArray(differences) && differences.length > 0) {
                differences.forEach(function(difference) {
                    trackActionCounterDifference(difference.counter, difference.difference);
                });
            }

            $scope.stats.loading = false;
        }

        /**
         * @name waitAndGetActionCountersRetry
         * @description It waits for the configured period of time and then it gets
         * the counter values from backend again.
         *
         * @param {object} internalTrackingValues being tracked at frontend side
         */
        function waitAndGetActionCountersRetry(internalTrackingValues) {
            $timeout(function() {
                trackingAPIService.getActionCounters().then(function(values) {
                    compareActionCounters(internalTrackingValues, values);
                });
            }, appConstant.actionCountersWaitingTime);
        }

        /**
         * @name compareActionCounters
         * @description It backend counters against frontend counters to determine if a retry action must be taken.
         *
         * @param {object} internalTrackingValues being tracked at frontend side
         * @param {object} values being tracked at backend side
         */
        function compareActionCounters(internalTrackingValues, values) {
            var differences = [];

            if (internalTrackingValues && values) {
                if (values.APPROVED && internalTrackingValues.approved !== parseInt(values.APPROVED)) {
                    differences.push({
                        counter: 'approved',
                        difference: internalTrackingValues.approved - parseInt(values.APPROVED)
                    });
                }
                if (values.REJECTED && internalTrackingValues.rejected !== parseInt(values.REJECTED)) {
                    differences.push({
                        counter: 'rejected',
                        difference: internalTrackingValues.rejected - parseInt(values.REJECTED)
                    });
                }
                if (values.TAGGED && internalTrackingValues.tagged !== parseInt(values.TAGGED)) {
                    differences.push({
                        counter: 'tagged',
                        difference: internalTrackingValues.tagged - parseInt(values.TAGGED)
                    });
                }
            }

            if (differences.length === 0 || retryTimes >= appConstant.actionCountersRetryTimes) {
                setActionCounters(values, differences);
                updateSuggestedValues();
            } else {
                retryTimes += 1;
                waitAndGetActionCountersRetry(internalTrackingValues);
            }
        }

        /**
         * @name validateSubmitionData
         * @description Validate data from the UX;
         *
         * @param {object} stats data type by the user on the submission form.
         */
        function validateSubmitionData(stats) {
            var result = {
                error: false,
                message: ''
            };

            if (parseInt(stats.hours) > 23) {
                result.error = true;
                result.message = 'You can\'t send more than 23 hours.';
                return $q.reject(result);
            } else if (parseInt(stats.minutes) > 59) {
                result.error = true;
                result.message = 'You can\'t send more than 59 minutes.';
                return $q.reject(result);
            }
            return $q.when(result);
        }

        promises.push(trackingAPIService.getTimeCurrentValue());

        promises.push(trackingAPIService.getActionCounters());

        $q.all(promises).then(function(results) {
            var timeTracked = moment.duration(results[0].time, 'milliseconds');
            $scope.stats.hours = Math.floor(timeTracked.asMinutes() / 60);
            $scope.stats.minutes = Math.floor(timeTracked.asMinutes() % 60);

            retryTimes = 0;
            compareActionCounters(internalTrackingService.getCountersData(), results[1]);
        });

        /**
         * @name checkEditions
         * @desc It compared current values against suggested values and return true if there are differences
         */
        $scope.checkEditions = function() {
            $scope.hasEdited = $scope.stats && $scope.suggestedValues &&
                ($scope.stats.approved !== $scope.suggestedValues.approved ||
                $scope.stats.rejected !== $scope.suggestedValues.rejected ||
                $scope.stats.tagged !== $scope.suggestedValues.tagged ||
                $scope.stats.hours !== $scope.suggestedValues.hours ||
                $scope.stats.minutes !== $scope.suggestedValues.minutes);
        };

        /**
         * @name isFieldEdited
         * @desc This method compare the stastField value passed by param against the current values in order
         * to show the edit square icon when apply.
         * @param {String} startField, posible values are 'approved', 'rejected', 'tagged', 'hours', 'minutes'.
         */
        $scope.isFieldEdited = function(statField) {
            return $scope.suggestedValues && $scope.suggestedValues[statField] !== $scope.stats[statField];
        };

        /**
         * @name submitActivity
         * @desc Call submitUserReport trackingAPIService method with the values submitted.
         */
        $scope.submitActivity = function() {
            $scope.error.isError = false;
            $scope.stats.loading = true;

            validateSubmitionData($scope.stats).then(function() {
                return trackingAPIService.submitUserReport(
                parseInt($scope.stats.approved),
                parseInt($scope.stats.rejected),
                parseInt($scope.stats.tagged),
                (parseInt($scope.stats.hours) * 60) + parseInt($scope.stats.minutes),
                $scope.stats.reason);
            }).then(function(result) {
                $scope.stats.loading = false;
                //If there is an error show an error message in the template
                if (result.data.message) { //This is a temp workaround. This must be removed once we have finish this issue: LEM-248
                    $scope.error.isError = true;
                    $scope.error.message = result.data.message;
                } else {
                    $uibModalInstance.close();
                    growl.addSuccessMessage('All your work was submitted properly');
                }
            }).catch(function(errorData) {
                $scope.error.isError = true;
                $scope.stats.loading = false;
                if (errorData.message) {
                    $scope.error.message = errorData.message;
                } else {
                    // when we finish LEM-248 we should be able to have an unique format.
                    $scope.error.message =
                        errorData.data.metadata ? errorData.data.metadata.error : errorData.data.data.message;
                }
            });
        };

        /**
         * @name proceedWithoutSubmitting
         * @desc Close the modal as a success action. Meaning, it will process with the switching account or loggin out
         */
        $scope.proceedWithoutSubmitting = function() {
            $uibModalInstance.close();
        };

        /**
         * @name closeModal
         * @desc Dismiss the modal instance.
         */
        $scope.closeModal = function() {
            $uibModalInstance.dismiss();
        };

        /**
         * @name validateDigits
         * @desc Validate that the user is typing only numbers
         */
        $scope.validateDigits = function($event) {
            if (isNaN(String.fromCharCode($event.keyCode))) {
                $event.preventDefault();
            }
        };
    }
]);
