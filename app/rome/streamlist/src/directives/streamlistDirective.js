'use strict';

/**
 * @ngdoc directive
 * @name op.streamlist.opStreamlist
 * @restrict E
 *
 * @description
 * This directive binds a tag '<op-streamlist settings="settings" streams="streams"
 * loaded="loaded"/>'
 */
angular
    .module('op.streamlist')
    .directive('opStreamlist', function() {
        var controller = function($scope) {
            if ($scope.settings) {
                /*
                 * Decide if use the default themplate or a custom template.
                 * If use the default template, add a custom template path
                 */
                if (angular.isString($scope.settings.templateUrl)) {
                    $scope.templateUrl = $scope.settings.templatePath + $scope.settings.templateUrl;
                } else {
                    $scope.templateUrl = $scope.settings.templatePath +
                        'src/statics/partials/streamlist.html';
                }
                $scope.streams = $scope.streams || [];
                $scope.streamActions = $scope.settings.streamActions;
                $scope.loaded = $scope.loaded || false;

                $scope.settings.actions = {
                    clear: function() {
                        $scope.streams = [];
                    },
                    fill: function(streams) {
                        $scope.streams = $scope.streams.concat(streams);
                    }
                };
            }
        };
        return {
            restrict: 'E',
            link: controller,
            scope: {
                settings: '=',
                streams: '=',
                loaded: '='
            },
            template: '<ng-include src="templateUrl">'
        };
    })
    .directive('opStreamlistRepeat', function($compile) {
        return {
            restrict: 'A',
            link: function(scope, element) {
                element.find(scope.streamActions.selector)
                    .append($compile(scope.streamActions.directive)(scope));
            }
        };
    });
