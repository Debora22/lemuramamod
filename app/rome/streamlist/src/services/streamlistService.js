'use strict';

/**
 * @ngdoc service
 * @name op.streamlist.streamlistService
 * @param {object} custom settings
 * @return {object} a new instance of streamlistService
 * @description
 *
 * This service is used for create an instance of streamlistService.
 * Extend the settings and return an new instance.
 *
 */
angular
    .module('op.streamlist')
    .service('streamlistService', function() {
        /**
         * Default settings
         *
         * templatePath {string} default: `''`, *optional*.
         *   Directory in where the module is installed.
         * templateUrl {string} default: `false`, *optional*.
         *   Full path to an html where the item template is located
         * streamActions.selector {string} default: `null`, *optional*.
         *  Element where the directive should be appended.
         * streamActions.directive {string} default: `null`, *optional*. Directive to be appended.
         * streamActions.actions {array} default: `[]`, *optional*. List of actions.
         * actions:clear {funcion} Clear the contents in the streamlist.
         * actions:fill {funcion}(Stream|Array) Fill the streamlist with these data.
         */
        var defaultSettings = {
            templatePath: '',
            templateUrl: false,
            streamActions: {
                selector: null,
                directive: null,
                actions: []
            },
            actions: {
                clear: function() {},
                fill: function() {}
            },
        };
        /*
         * Merge defaultSettings and custom settings
         * @return {object}
         */
        return function(settings) {
            return angular.extend(angular.copy(defaultSettings), settings);
        };
    });
