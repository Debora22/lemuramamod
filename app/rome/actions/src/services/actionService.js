'use strict';

/**
 * @ngdoc service
 * @name op.box.actionService
 * @param {object} custom settings
 * @return {object} a new instance of actionService
 * @description
 *
 * This service is used for create an instance of an action.
 * Extend the settings and return an new instance.
 *
 */

angular
    .module('op.actions')
    .service('actionService', function(){
        /**
         * Default settings
         *
         * The supported options are:
         *
         * title {string}
         * iconClass {string}
         * callback {function}
         * showIf {function}
         */
        var defaultSettings = {
            title : '',
            iconClass : '',
            callback: function(){},
            showIf: null
        };


        /*
         * Merge defaultSettings and custom settings
         * @return {object}
         */
        return function(settings){
            return angular.extend(angular.copy(defaultSettings), settings);
        };
    });
