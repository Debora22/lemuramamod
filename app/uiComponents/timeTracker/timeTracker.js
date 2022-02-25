'use strict';

/**
 * @ngdoc component
 * @name op.timeTracker
 *
 * @description
 *
 * This component displays a time tracker. It supports Pause and Resume
 *
 * @param
 *  - title: String to be displayed as title
 *  - value: time to be displayed in milliseconds. i.e: 1477576470854
 *  - running: set component running status: true/false
 *  - onPause: Callback function to be called when user clicks on 'Pause'
 *  - onResume: Callback function to be called when the user clicks on 'Resume'
 */

var componentController = ['moment', function(moment) {

    var ctrl = this;

    ctrl.displayValue = 0;

    // update the timeSpent with the proper message
    function updateTime(value) {
        ctrl.displayValue = moment.duration(value, 'milliseconds').format('h[hs:]m[min]', { trim: false });
    }

    /**
     * Toggle timer and save the event.
     */
    ctrl.toggle = function() {
        ctrl.running = !ctrl.running;

        if (ctrl.running) {
            ctrl.onResume();
        } else {
            ctrl.onPause();
        }
    };

    // update the timer
    ctrl.$onChanges = function onChangesHandler(modifiedBindings) {
        if (modifiedBindings.value) {
            updateTime(modifiedBindings.value.currentValue);
        }
    };

    // set the timer with initial value
    ctrl.$onInit = function() {
        updateTime(ctrl.value);
        ctrl.running = ctrl.running || true;
    };
}];

angular
    .module('uiComponents')
    .component('opTimeTracker', {
        templateUrl: 'uiComponents/timeTracker/timeTracker.html',
        controller: componentController,
        bindings: {
            title: '@',
            value: '<',
            running: '<',
            onPause: '&',
            onResume: '&'
        }
    });
