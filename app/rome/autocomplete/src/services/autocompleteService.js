'use strict';

/**
 * @ngdoc service
 * @name op.autocomplete.autocompleteService
 * @param {object} custom settings
 * @return {object} a new instance of autocomplete
 * @description
 *
 * This service is used for create a new instance of autocomplete
 */
angular
    .module('op.autocomplete')
    .service('autocompleteService', ['autocompleteToolsService', function(AutocompleteToolsService){

        var tools = new AutocompleteToolsService();

        /**
         * Default settings
         *
         * templatePath {string} default: `/autocomplete/`, *optional*. Directory in where the module is installed.
         * templateUrl {string} default: `undefined`, *optional*. Full path to an html where the item template is located
         * minimumTermLength {Integer} default: `3`, *optional*. Minimum length where the search is triggered
         * callbacks.getData {function} Receives a term, must return a promise that returs data to be formatted
         * callbacks.formatData {function} Receives a data and a push. Data must be iterated accordingly and push(type, title, id) must be fired for each item.
         * callbacks.onSelect {function} Is fired any time an item is selected. Receives the item selected
         *
         */
        var defaultSettings = {
            templatePath: '/autocomplete/',
            tempalteUrl: undefined,
            minumumTermLength: 3,
            callbacks: {
                getData: function(){},
                onSelect: function(){},
                formatData: function(){}
            }
        };

        /*
         * Merge defaultSettings and custom settings
         * @return {object}
         */
        return function(settings){
            return tools.extend(angular.copy(defaultSettings), settings);
        };

    }]);
