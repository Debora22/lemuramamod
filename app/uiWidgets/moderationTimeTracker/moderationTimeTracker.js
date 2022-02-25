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

var componentController = ['$scope', '$timeout', '$interval', 'trackingAPIService',
    'moderationTimeTrackerService', 'EXTERNAL_TRACKING_EVENTS',
function($scope, $timeout, $interval, trackingAPIService,
        moderationTimeTrackerService, EXTERNAL_TRACKING_EVENTS) {
    var ctrl = this;

    var timerInterval;
    var REFRESH_TIMER_INTERVAL = 60000;
    var maxRetry = 6;

    /**
     * It sets the running status and time value
     * @param value
     */
    function setDisplayStatus(value) {
        if (value && value.status) {
            ctrl.timeValue = value.time;
            ctrl.timeRunning = value.status === 'start' ||
                value.status === 'resume' ||
                value.status === 'keepalive';
        }
    }

    /**
     * It gets the timer started and get the counter values as it could be the previous session was not
     * submitted so the counter keeps working
     */
    function initializeTimer(retry) {
        retry = retry ? retry + 1 : 1;
        return trackingAPIService.getTimeCurrentValue().then(function(value) {
            //When getting started we expect the last event to be a start
            if ((value && value.status === 'start') || retry > maxRetry) {
                setDisplayStatus(value);
                startTimeTrackerInterval();
                //We send a keepalive event so we consider the use case when
                //the browser crashes right after user signs in
                trackingAPIService.keepAliveTime();

                moderationTimeTrackerService.setPauseStatus(!ctrl.timeRunning);
            } else {
                //Sometimes the events take a while before are processed by backend.
                //During initialization, if there is no event we retry
                $timeout(function() {
                    initializeTimer(retry);
                }, 1000);
            }
        });
    }

    /**
     * gets the latest value for time tracking counter
     *
     */
    function getTimeTrackerValue() {
        return trackingAPIService.getTimeCurrentValue().then(function(value) {
            setDisplayStatus(value);
        });
    }

    /**
     * Creates an interval that periodically gets the latest value for time tracking counter
     */
    function startTimeTrackerInterval() {
        if (!angular.isDefined(timerInterval)) {
            timerInterval = $interval(getTimeTrackerValue, REFRESH_TIMER_INTERVAL);
        }
    }

    /**
     * Stops the interval that periodically gets the latest value for time tracking counter
     */
    function stopTimeTrackerInterval() {
        if (angular.isDefined(timerInterval)) {
            $interval.cancel(timerInterval);
            timerInterval = undefined;
        }
    }

    /**
     * Send the RESUME event to time tracker
     */
    function timeTrackingResume() {
        startTimeTrackerInterval();

        $scope.$emit(EXTERNAL_TRACKING_EVENTS.timeTracking.resume);

        //Make sure we refresh the value before the pause action so we display very last counter value
        return getTimeTrackerValue().then(function() {
            ctrl.timeRunning = true;
            return trackingAPIService.resumeTime();
        });
    }

    /**
     * Send PAUSE event to time tracker
     */
    function timeTrackingPause() {
        stopTimeTrackerInterval();
        //Make sure we refresh the value before the pause action so we display very last counter value

        $scope.$emit(EXTERNAL_TRACKING_EVENTS.timeTracking.pause);

        return getTimeTrackerValue().then(function() {
            ctrl.timeRunning = false;
            return trackingAPIService.pauseTime();
        });
    }

    /**
     * Stops time tracking and Reset the timer value and status
     */
    function timeTrackingStop() {
        return trackingAPIService.stopTime().then(function() {
            ctrl.timeValue = 0;
        });
    }

    /**
     * When the user clicks on pause, we use the service so we make sure we take into account
     * those mix scenarios where the user clisk on pause en then the time is also paused by a 'switch account' action
     */
    ctrl.onTimerPause = function() {
        return timeTrackingPause().then(function() {
            moderationTimeTrackerService.setPauseStatus(true);
        });
    };

    /**
     * Same situation than 'pause', it is being handled by the service so we have a centralized place
     */
    ctrl.onTimerResume = function() {
        return timeTrackingResume().then(function() {
            return moderationTimeTrackerService.setPauseStatus(false);
        });
    };

    // cancel the timer
    ctrl.$onDestroy = function() {
        if (!angular.isDefined(timerInterval)) {
            $interval.cancel(timerInterval);
        }
    };

    // set the timer with initial value
    ctrl.$onInit = function() {
        moderationTimeTrackerService.onTimerAction('init', initializeTimer);
        moderationTimeTrackerService.onTimerAction('pause', timeTrackingPause);
        moderationTimeTrackerService.onTimerAction('resume', timeTrackingResume);
        moderationTimeTrackerService.onTimerAction('stop', timeTrackingStop);

        //In case the user refresh the page, we make sure the last status is displayed
        initializeTimer();
    };
}];

angular
.module('uiWidgets')
.component('opModerationTimeTracker', {
    templateUrl: 'uiWidgets/moderationTimeTracker/moderationTimeTracker.html',
    controller: componentController
});
