'use strict';

/**
 * @ngdoc service
 * @name op.autocomplete.autocompleteToolService
 * @description
 *
 * This service include a set of tools used by the Autocomplete service/directive.
 *
 */
angular
    .module('op.autocomplete')
    .service('autocompleteToolsService', function(){

        /**
         * extend
         * @param  {object} dst settings
         * @return {object} [description]
         */
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

        return function(){
            return {
                extend : extend
            };
        };

    });
