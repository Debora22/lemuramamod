'use strict';

/**
 * @ngdoc directive
 * @name op.actions.opActions
 * @restrict E
 *
 * @description
 * Draw a set action based on the type attribute
 * Allowed types:
 * - radio -> radio buttons
 * - select -> select action
 * - actionlist -> list of two actions an a dropdown menu
 *
 * @example
 * Here's an example of how you'd use op-actinos and how it would compile. If you have the
 * following template:
 * <op-actions action-services="[action1, action2]" template-path="/"></op-actions>
 * action1, action2 sould be instances of actionService
 */
angular
    .module('op.actions')
    .constant('DEFAULT_LIST_LIMIT', 3)
    .directive('opActions', ['$filter', 'DEFAULT_LIST_LIMIT', function($filter, DEFAULT_LIST_LIMIT) {
        var controller = function($scope, element, attrs){

            var allowedTemplates = ['select', 'actionlist', 'radio', 'link', 'checkbox', 'button'];

            var stopWatch = $scope.$watch(function($scope){
                return $scope.actions;
            }, function(actions){
                if(angular.isDefined(actions) && angular.isArray(actions)){
                    stopWatch();

                    // templatePath should be set on the directive's html
                    // other wise we're going to use the default location.
                    $scope.templatePath = (attrs.templatePath || '') + 'src/statics/partials/';
                    $scope.templateUrl = attrs.templateUrl || '';

                    $scope.actions = actions;
                    $scope.type = attrs.type || null;
                    $scope.name = attrs.name || null;

                    var refreshLimit = function(newLimit) {
                        newLimit = Number(newLimit);
                        $scope.listLimit = 0 < newLimit ? newLimit : DEFAULT_LIST_LIMIT;
                        // determine if we'll show the dropdown
                        $scope.showDropDown = $scope.listLimit < $filter('filter')(actions, $scope.showIf).length;
                        if ($scope.showDropDown) {
                            // in case we show the dropdown, we have to clear 1 space for the '...' icon
                            $scope.listLimit--;
                        }
                    };
                    attrs.$observe('listLimit', refreshLimit);
                    refreshLimit(attrs.listLimit);

                    // we use the first action a default
                    $scope.selectedAction = $scope.actions[0];

                    $scope.applyAction = function(action){
                        if(angular.isObject(action) && angular.isFunction(action.callback)){
                            action.callback($scope.entity);
                        }
                    };

                    $scope.showIf = function(action) {
                        if (!angular.isFunction(action.showIf)) {
                            return true;
                        } else {
                            return action.showIf.apply(action, [$scope.entity]);
                        }
                    };

                    /*
                     * If it's present templateUrl we're going to use it as template
                     * other wise; let's check if the type is allowed
                     */
                    if ($scope.templateUrl === ''){
                        // use the type attr as template name or 'actionlist' as default
                        if (($scope.type !== null) && (allowedTemplates.indexOf($scope.type) > -1)) {
                            $scope.templateUrl = $scope.templatePath + $scope.type+'.html';
                        } else {
                            $scope.templateUrl = $scope.templatePath + 'actionlist.html';
                        }
                    }
                }
            });
        };

        return {
            scope: {
                actions: '=',
                entity: '='
            },
            restrict: 'E',
            replace: true,
            link: controller,
            template: '<div><ng-include src="templateUrl"/></div>'
        };
    }])
    .filter('dropdownList', ['DEFAULT_LIST_LIMIT', function(DEFAULT_LIST_LIMIT) {
        return function(actions, limit) {
            return actions.slice(angular.isDefined(limit) && 0 <= limit ? limit : DEFAULT_LIST_LIMIT);
        };
    }]);
