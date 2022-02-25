'use strict';

/**
 * @ngdoc service
 * @name op.filters.filtersService
 * @param {object} custom settings
 * @return {object} a new instance of filters
 * @description
 *
 * This service is used for create a new instance of filters
 */
angular
    .module('op.filters')
    .service('filtersService', function() {

        /**
         * extend
         * @param  {object} dst settings
         * @return {object} [description]
         */
        var extend = function(dst) {
            angular.forEach(arguments, function(obj) {
                if (obj !== dst) {
                    angular.forEach(obj, function(value, key) {
                        if (dst[key] && dst[key].constructor && dst[key].constructor === Object && value.constructor === Object) {
                            extend(dst[key], value);
                        } else {
                            dst[key] = value;
                        }
                    });
                }
            });
            return dst;
        };

        /**
         * Default settings
         *
         * The supported options are:
         *
         * showTotal {boolean}
         * templatePath {string}
         * templateUrl {string}
         * itemsOrder {array} array with keys for order the filters
         * tooltip {object} {
         *         limit : {int} limit chars to show a tool tip; use -1 to show it always,
         *         position : {string} top|bottom|left|right
         * }
         * searchPlaceholder {string}
         * autocompleteService {Object} *optional*. an autocomplete service
         * actions.fill {function} fill with content the filters
         * actions.fillTotal {function} fill total label from oustide the directive
         * actions.clear {function} clear all data on the filters
         * actions.injectFilterCondition {function} inject a filter condition from outside of the filter directive
         * callbacks.afterApplyFilter {function} apply filter callback
         * callbacks.afterSearchPress {function} after search text is go CAUTION:
         *     this callback reset all search how to init
         * callbacks.afterClearAll {function} after clear all button is pressed
         * callbacks.onChange {function} after any filter value changed
         *
         */
        var defaultSettings = {
            showTotal: false,
            templatePath: '',
            templateUrl: '',
            itemsOrder: [],
            tooltip: {
                limit: 24,
                position: 'right'
            },
            searchPlaceholder: 'Search photos',
            autocompleteService: undefined,
            actions: {
                fill: function() {},
                fillTotal: function() {},
                clear: function() {},
                injectFilterCondition: function() {}
            },
            callbacks: {
                afterApplyFilter: function() {},
                afterSearchPress: function() {},
                afterClearAll: [],
                onChange: function() {}
            },
            isLoading: true
        };

        /*
         * Merge defaultSettings and custom settings
         * @return {object}
         */
        return function(settings) {
            return extend(angular.copy(defaultSettings), settings);
        };

    });
