'use strict';

/**
 * @ngdoc directive
 * @name op.loading.loadingBox
 * @restrict E
 *
 * @description
 *
 * This directive binds a tag `<op-loading>` and remplace it for a template.
 */
angular
    .module('op.loading')
    .directive('opLoading',['loadingService', function(loadingService){
        return {
            restrict: 'E',
            replace: true,
            template: '<div> <div class="loading" ng-class="{true: \'active\'}[loading]"></div><div class="spinner-loading" ng-class="{true: \'active\'}[loading]"><div class="olapic-spinner olapic-spinner-bounce"><div class="olapic-bounce1"></div><div class="olapic-bounce2"></div></div></div></div>',
            /**
             * Watch the `loadingService.loading` var
             */
            link: function (scope) {
                scope.$watch(function () {
                   return loadingService.loading;
                },
                  function(newVal) {
                    scope.loading = newVal;
                }, true);
            }
        };
    }]);
