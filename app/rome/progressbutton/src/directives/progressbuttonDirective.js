'use strict';

/**
 * @ngdoc directive
 * @name op.progressbutton.opProgressbutton
 * @restrict E
 *
 * @description
 * This directive binds a tag `<op-progress-button>` and remplace it for a template.
 *
 * @example
 * Here's an example of how you'd use ui-sref and how it would compile. If you have the following template:
 * <op-progress-button></op-progress-button>
 *
 */
angular
    .module('op.progressbutton')
    .directive('opProgressbutton', function() {
        var link = function link(scope, element, attrs) {
            var stopWatch = scope.$watch(function($scope) {
                return $scope[attrs.progressButton] || $scope.$parent[attrs.progressButton] ||
                $scope.progressButton || $scope.$parent.progressButton;
            }, function(progressbuttonService) {
                if (!angular.isUndefined(progressbuttonService)) {
                    stopWatch();

                    /*
                     * Decide if use the default themplate or a custom template.
                     * If use the default template, add a custom template path
                     */
                    if (angular.isString(progressbuttonService.templateUrl)) {
                        scope.templateUrl = progressbuttonService.templatePath + progressbuttonService.templateUrl;
                    } else {
                        scope.templateUrl = progressbuttonService.templatePath +
                            'src/statics/partials/progressbutton.html';
                    }

                    /**
                     * Sets the saved setting on the local scope.
                     */
                    scope.bind = {
                        progressButtonStatus: progressbuttonService.progressButtonStatus
                    };

                    /**
                     * @name onInputProgressChange
                     *
                     * @description
                     * Listen the change of the input
                     *
                     * @param  {Event} $event The input event
                     */
                    scope.onInputProgressChange = function() {
                        progressbuttonService.callbacks.onInputChange(scope, element);
                    };
                }
            });
        };
        return {
            scope: {},
            restrict: 'E',
            replace: true,
            template: '<div><ng-include src="templateUrl"/></div>',
            link: link
        };
    });
