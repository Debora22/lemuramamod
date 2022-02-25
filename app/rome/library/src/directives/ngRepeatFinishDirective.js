'use strict';

angular
    .module('op.library')
    /*
        Library directive
    */
    .directive('ngRepeatOnFinishRender',['$rootScope', '$timeout', function($rootScope){
        return function($scope){
            if ($scope.$last){
                $rootScope.$broadcast('ng-repeat-on-finish-render');
            }
        };
    }]);
