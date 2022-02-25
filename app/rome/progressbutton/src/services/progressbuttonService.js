'use strict';

/**
 * @ngdoc service
 * @name op.progressbutton.progressbuttonService
 * @param {object} custom settings
 * @return {object} a new instance of Progressbutton
 * @description
 *
 * This service is used for create an instance of Progressbutton.
 * Extend the settings and return an new instance.
 *
 */
angular
    .module('op.progressbutton')
    .service('ProgressbuttonService', function() {
        /**
         * Default settings
         *
         * templatePath {string} default: `''`, *optional*. Directory in where the module is installed.
         * templateUrl {string} default: `false`, *optional*. Full path to an html where the item template is located
         * progressButtonStatus {boolean} default: `false`, Initial progress button status.
         * callbacks.onInputChange {function} Receives scope and element.
         *
         */
        var defaultSettings = {
            templatePath: '',
            templateUrl: false,
            progressButtonStatus: false,
            callbacks: {
                onInputChange: function() {}
            }
        };
        /*
         * Merge defaultSettings and custom settings
         * @return {object}
         */
        return function(settings) {
            return angular.extend(angular.copy(defaultSettings), settings);
        };
    });
