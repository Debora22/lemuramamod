'use strict';

/**
 * @ngdoc directive
 * @name op.modal.opModalExtras
 * @restrict E
 *
 * @description
 *
 * This directive binds a tag `<op-modal-extras>` and replace it for a template.
 * This is used to display the right side of the modal with custom directives.
 *
 * @example
 * <op-modal-extras></op-modal-extras>
 */
angular
    .module('op.modal')
    .directive('opModalExtras', ['$compile', function($compile){

        var controller = function($scope){

            /**
             * Settings
             */
            var settings = $scope.$parent.modal;

            $scope.activeTab = settings.activeTab;
            $scope.showTabs = settings.showTabs;

            var findTabByRole = function (role) {
                var found;
                $scope.extras.forEach(function(value, index){
                    if (value.role === role) {
                        found = index;
                        return;
                    }
                });
                return found;
            };

            /**
             * Define the templateUrl using the path defined in the implementation
             */
            $scope.templateUrl = settings.templatePath + 'src/statics/partials/modal_media_extras.html';

            /**
             * @name afterLoadTemplate
             *
             * @description
             * Once the template got loaded in the directive check the return of the directive
             * we start doing stuff.
             */
            $scope.afterLoadTemplate = function(){
                var content = angular.element('.tab-content'),
                    element,
                    elementContent,
                    actived = '';

                $scope.extras = settings.extras;

                $scope.showIf = function(value) {
                    return (
                        angular.isUndefined(value.showIf) ||
                        !angular.isFunction(value.showIf) ||
                        value.showIf.apply(value, [value.scope.modal.current])
                    );
                };

                /**
                 * Detect when the navigation is used, we update the dynamic directives
                 */
                $scope.$watch(function(){
                    return $scope.$parent.data;
                }, function(current){
                    content.empty();
                    $scope.extras.forEach(function(value, index){
                        if (!$scope.showIf(value)) {
                            return;
                        }
                        actived = (index === $scope.activeTab) ? 'in active' : '';

                        if ($scope.showTabs) {
                            element = '<div role="tabpanel" class="tab-pane fade ' + actived +
                            '" id="' + value.role + '"></div>';
                        } else {
                            element = '<div class="onetab-pane"><h3>' + value.title + '</h3></div>';
                        }
                        elementContent = angular.element(element);
                        elementContent.append($compile(value.directive)(value.scope));

                        if(!angular.isUndefined(value.before) && angular.isFunction(value.before)) {
                            value.before();
                        }
                        content.append(elementContent);
                        if(!angular.isUndefined(value.before) && angular.isFunction(value.before)) {
                            value.after(current);
                        }
                    });
                });
            };

            $scope.classForActiveTab = function(index){
                return (index === $scope.activeTab) ? 'active' : '';
            };

            $scope.tab = function(role){
                $scope.activeTab = findTabByRole(role);
                angular.element('.tab-pane').removeClass('active in');
                angular.element('#'+role).addClass('active in');
                angular.element('.nav-tabs li').removeClass('active');
                angular.element('.nav-tabs li.'+role).addClass('active');
            };
        };

        return {
            restrict: 'E',
            replace: true,
            link: controller,
            template: '<ng-include src="templateUrl" onLoad="afterLoadTemplate()">'
        };

    }]);
