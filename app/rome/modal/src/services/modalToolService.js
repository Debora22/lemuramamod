'use strict';

/**
 * @ngdoc service
 * @name op.box.modalToolService
 * @description
 *
 * This service include a set of tools used by the Modal service/directive.
 *
 */
angular
    .module('op.modal')
    .filter('trusted', ['$sce', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    }])
    .filter('youTubeIframe', ['$sce', function ($sce) {
        return function(video_url) {
            if( typeof video_url !== "string") {
                return $sce.trustAsResourceUrl("");
            }
            var pu = video_url.split("/").pop();
            return $sce.trustAsResourceUrl("//www.youtube.com/embed/" + pu.replace("watch?v=", "") );
        };

    }])
    .service('modalToolService', function(){

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
