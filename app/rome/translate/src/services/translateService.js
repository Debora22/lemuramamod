'use strict';

/**
 * @ngdoc service
 * @name op.translate.translateService
 * @param {object} custom settings
 * @return {object} a new instance of translateService
 * @description
 *
 * This service is used for create an instance of translateService.
 * Extend the settings and return an new instance.
 *
 */
angular
    .module('op.translate')
    .service('translateService', [
        'translateAPIService',
        function(translateAPIService) {
        /**
         * Default settings
         *
         * templatePath {string} default: `''`, *optional*.
         *  Directory in where the module is installed.
         * templateUrl {string} default: `false`, *optional*.
         *  Full path to an html where the item template is located
         * translateOnload {boolean} default: `false`, *optional*.
         *  Whether to translate on load or at request
         * showIcon {boolean} default: `false`, *optional*.
         *  Whether to show the icon or not
         * showTransitionEffect {boolean} default: `false`, *optional*.
         *  Whether to show the transition effect or not
         * showIconWhenTranslated {boolean} default: `false`, *optional*.
         *  Whether to show the icon or not when the translatedtext is present
         * translateService {object} default: `translateAPIService`, *optional*.
         *  Translate Service.
         * actions.translate {funcion} Perform the translation
         * callbacks.afterTranslate {function} Called when translation is done.
         * callbacks.translationError {function} Called when the translation throws an error.
         *
         */
        var defaultSettings = {
            templatePath: '',
            templateUrl: false,
            translateOnload: false,
            showIcon: false,
            showTransitionEffect: false,
            showIconWhenTranslated: false,
            translateService: translateAPIService,
            actions: {
                translate: function() {}
            },
            callbacks: {
                afterTranslate: function() {},
                translationError: function() {}
            }
        };
        /*
         * Merge defaultSettings and custom settings
         * @return {object}
         */
        return function(settings) {
            return angular.extend(angular.copy(defaultSettings), settings);
        };
    }]);
