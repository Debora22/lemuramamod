'use strict';

/**
 * @ngdoc directive
 * @name op.overlay
 * @restrict E
 *
 * @description
 *
 * This directive depends of the Offline service, when the status of Offline change this directive
 * shuold show or hide
 */
angular
    .module('common')
    .directive('opOverlay', ['Offline', function(Offline) {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="overlay" ng-class="{true: \'active\'}[show]"></div>',
            link: function(scope) {
                Offline.on('down', function() {
                    scope.show = true;
                    scope.$apply();
                });
                Offline.on('up', function() {
                    scope.show = false;
                    scope.$apply();
                });
            }
        };
    }]);
