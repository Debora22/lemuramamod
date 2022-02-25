'use strict';

/**
 * @ngdoc directive
 * @name  base.directive:opAutofocus
 * @restrict 'A'
 * @element ANY
 *
 * @description
 * Triggers the "focus" event on a given element. This is a fix for
 * the native "autofocus" which cannot work with dynamic elements.
 *
 * @example
 *
 * <input type="text" op-autofocus />
 *
 */
angular
.module('base')
.directive('opAutofocus', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function($scope, $element, $attributes) {
            if ($scope.$eval($attributes.autoFocus) !== false) {
                var element = $element[0];

                $timeout(function() {
                    $scope.$emit('focus', element);
                    element.focus();
                });
            }
        }
    };
}]);
