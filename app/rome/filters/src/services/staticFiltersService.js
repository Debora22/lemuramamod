'use strict';
angular
    .module('op.filters')
    .service('StaticFiltersService', function() {

        var extend = function(dst) {
            angular.forEach(arguments, function(obj) {
                if (obj !== dst) {
                    angular.forEach(obj, function(value, key) {
                        if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                            extend(dst[key], value);
                        } else {
                            dst[key] = value;
                        }
                    });
                }
            });
            return dst;
        };

        var defaultSettings = {
            templatePath: '',
            templateUrl: '',
            label: '',
            data: null,
            position: 1,
            initialValue: undefined,
            actions: {
                clear: function() {},
                addFilter: function() {},
                getSelectedItem: function() {},
                setDisabled: function() {}
            },
            callbacks: {
                onChange: function() {}
            }
        };

        /*
         * Merge defaultSettings and custom settings
         * @return {object}
         */
        return function(settings) {
            return extend(angular.copy(defaultSettings), settings);
        };

    });
