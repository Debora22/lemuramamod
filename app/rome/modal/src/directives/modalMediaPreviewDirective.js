'use strict';

/**
 * @ngdoc directive
 * @name op.modal.opModalMediaPreviewDirective
 * @restrict E
 *
 * @description
 *
 * This directive binds a tag `<op-modal-media-preview>` and replace it for a template.
 * This is used to display the large media as preview.
 *
 * @example
 * <op-modal-media-preview></op-modal-media-preview>
 */
angular
    .module('op.modal')
    .directive('opModalMediaPreview', [function(){

        var controller = function($scope){

            /**
             * Settings
             */
            var settings = $scope.$parent.modal;

            /**
             * Define the templateUrl using the path defined in the implementation
             */
            $scope.templateUrl = settings.templatePath + 'src/statics/partials/modal_media_preview.html';

            /**
             * @name afterLoadTemplate
             *
             * @description
             * Once the template got loaded in the directive check the return of the directive
             * we start doing stuff.
             */
            $scope.afterLoadTemplate = function(){
                $scope.show = false;

                $scope.image = null;

                var update = function(image){
                    $scope.image = image;
                };

                var show = function(){
                    $scope.fixed = (angular.element('.modal-media-container').hasClass('fixed_modal')) ? true : false;
                    $scope.$parent.hideDuringPreview = true;
                    $scope.show = true;
                };

                var hide = function(){
                    $scope.$parent.hideDuringPreview = false;
                    $scope.show = false;
                };

                /**
                 * Assigning the actions for the preview
                 */
                settings.preview = {
                    update: update,
                    show: show,
                    hide: hide
                };
            };
        };

        return {
            restrict: 'E',
            replace: true,
            link: controller,
            template: '<ng-include src="templateUrl" onLoad="afterLoadTemplate()">',
            scope: true
        };

    }]);
