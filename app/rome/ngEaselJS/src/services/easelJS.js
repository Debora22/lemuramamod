'use strict';

/**
 * @ngdoc service
 * @name ngEaseljs.easeljs
 * @description
 *
 * This service wraps EaselJS third party library
 */
angular
    .module('ngEaseljs')
    .service('easeljs', ['$window', function($window) {
        return $window.createjs;
    }]);
