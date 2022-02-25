'use strict';

/**
 * @ngdoc service
 * @name moderationTimeTrackerService
 * @description
 *
 * This service exposes the Time tracking component actions.
 *
 */
angular
.module('uiWidgets')
.service('moderationTimeTrackerService', function() {
    var callbacks = {
        init: [],
        pause: [],
        resume: [],
        stop: []
    };
    var paused = false;

    /**
     * Execute all callback for an specific action
     */
    function executeCallback(callbacksToRun) {
        callbacksToRun.forEach(function(callback) {
            callback();
        });
    }

    /**
     * Init the time counter
     */
    this.init = function() {
        executeCallback(callbacks.init);
    };

    /**
     * Stop time counter
     */
    this.stop = function() {
        executeCallback(callbacks.stop);
    };

    /**
     * Pause the time counter
     * @returns Function 'resume' function so it can be called when the pause status finishes.
     * It is useful on those cases when we want to pause the clock and the go back to the previous status,
     * before the pause
     */
    this.pause = function() {
        if (paused) {
            //If the timer was already in pause, the returned 'resume' function should not do anything
            return function() {};
        } else {
            setPauseStatus(true);
            executeCallback(callbacks.pause);

            return this.resume;
        }
    };

    /**
     * Resume time counter
     */
    function resume() {
        setPauseStatus(false);
        executeCallback(callbacks.resume);
    }
    this.resume = resume;

    /**
     * Set the pause value
     */
    function setPauseStatus(value) {
        paused = value;
    }
    this.setPauseStatus = setPauseStatus;

    /**
     * Save a callback to be called when some action takes place
     */
    this.onTimerAction = function(action, callback) {
        callbacks[action].push(callback);
    };
});
