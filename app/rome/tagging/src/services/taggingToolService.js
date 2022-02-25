'use strict';

/**
 * @ngdoc service
 * @name op.tagging.taggingToolService
 * @description
 *
 * This service include a set of tools used by the Tagging service/directive.
 *
 */
angular
    .module('op.tagging')
    .service('taggingToolService', function(){

        /**
         * @name extend
         * @private
         *
         * @description
         * Internal extend function
         *
         * @param  {Object} dst Settings
         * @return {Object}     Merged settings
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
                extend: extend
            };
        };

    });
