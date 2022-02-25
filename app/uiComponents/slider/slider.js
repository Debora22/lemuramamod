'use strict';

var componentController = function() {
    var ctrl = this;
    var maxValue = 95;

    /**
     * Bind object contain the value of the slider
     */
    ctrl.sliderModel = {
        value: 0
    };

    /**
     * @name onSliderChange
     * @description This method is called when the slider model changes, it pass the slider model value
     * to the parent component via bindings.
     */
    ctrl.onSliderChange = function() {
        var valueToSend = ctrl.sliderModel.value > maxValue ? maxValue : ctrl.sliderModel.value;
        ctrl.onChange({value: ( valueToSend / 100) });
    };

    ctrl.$onChanges = function(changesData) {
        if (changesData.value &&
            !changesData.value.currentValue) {
            ctrl.sliderModel.value = 0;
        }
    };

    ctrl.$onInit = function() {
        //default values setter
        ctrl.minText = ctrl.minText || 'min';
        ctrl.maxText = ctrl.maxText || 'max';
    };
};

/**
 * @ngdoc component
 * @name uicSlider
 *
 * @description This component provide a base slider component for our lemurama platform
 * @param {String} minText minText displayed in the top left side of the slider
 * @param {String} maxText maxText displayed in the top right side of the slider
 * @param {Number} value The slider value, between 0 and 1. ie: 0.87
 * @param {onChange} onAnnotationDataUpdate callback to be called when the slider model changes
 */
angular.module('uiComponents')
.component('uicSlider', {
    templateUrl: 'uiComponents/slider/slider.html',
    controller: componentController,
    bindings: {
        minText: '@',
        maxText: '@',
        value: '<',
        onChange: '&'
    }
});
