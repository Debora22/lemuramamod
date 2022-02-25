'use strict';

/**
 * @ngdoc directive
 * @name op.modal.opModalMedia
 * @restrict E
 *
 * @description
 *
 * This directive binds a tag `<op-modal-media>` and replace it for a template.
 * This is used to display the media detail, depend of is single or bulk.
 *
 * @example
 * <op-modal-media></op-modal-media>
 */
angular
.module('op.modal')
.directive('opModalMedia',[
    '$compile',
    '$timeout',
    'asyncSettingsService',
    'taggingSuggestionService',
    'modalMediaAnnotationService',
    function(
        $compile,
        $timeout,
        asyncSettingsService,
        taggingSuggestionService,
        modalMediaAnnotationService
    ) {
        var controller = function($scope) {

            /**
             * Settings
             */
            var settings = $scope.$parent.modal;

            /**
             * Define the templateName depend if is bulk or not
             */
            var templateName = ($scope.isBulk) ? 'bulk' : 'single_' + settings.size;

            /**
             * Define the templateUrl using the path defined in the implementation
             */
            $scope.templateUrl = settings.templatePath + 'src/statics/partials/modal_media_' + templateName + '.html';

            /**
             * Define if we must enable or not the annotation feature
             */
            $scope.enableAnnotations = settings.enableAnnotations;

            /**
             * Define if we must show the zoom button
             */
            $scope.showZoomButton = settings.enableAnnotations.status;

            /**
             * Define baseMediaUrl for the annotable component
             */
            $scope.baseMediaUrl = modalMediaAnnotationService.getBaseMediaUrl();

            /**
             * Define containerSize of the canvas
             */
            $scope.containerSize = modalMediaAnnotationService.getImageContainerDimension();

            /**
             * @name attachScrollEvent
             *
             * @description
             * This method fixed the media container when scroll inside the modal only when the
             * the window height is bigger or equal than the media container height.
             */
            var attachScrollEvent = function () {

                var modalContainer,
                    modal,
                    modalContainerH,
                    windowH,
                    header,
                    mediaListHeader;

                var setVars = function() {
                    modalContainer = angular.element('.modal-media-container');
                    modal = angular.element('.olapic-modal');
                    var modalDialog = angular.element('.modal-dialog'),
                        modalDialogMarginBottom = parseInt(modalDialog.css('margin-bottom')),
                        modalDialogMarginTop = parseInt(modalDialog.css('margin-top'));
                    modalContainerH = modalContainer.height() + modalDialogMarginBottom;
                    windowH = angular.element(window).height();
                    header = angular.element('.modal-header').outerHeight() + modalDialogMarginTop;
                    mediaListHeader = angular.element('.modal-media-header').height();
                };

                // When resize, recalculate all vars
                angular.element(window).on('resize', function() {
                    setVars();
                });

                setVars();

                modal.bind("scroll", function() {
                    var scroll = modal.scrollTop();
                    // fix the modal only if it's smaller than window
                    if (windowH >= modalContainerH && scroll > header) {
                        modalContainer.addClass('fixed_modal');
                    } else {
                        modalContainer.removeClass('fixed_modal');
                    }
                });
            };

            /**
             * @name afterLoadTemplate
             *
             * @description
             * Once the template got loaded in the directive check the return of the directive
             * we start doing stuff.
             */
            $scope.afterLoadTemplate = function(){
                /**
                 * The custom directives set in the implementation
                 */
                var directives = settings.directives;
                $scope.$watch(function(){
                    return $scope.data;
                }, function() {

                    // Update modalMediaAnnotationService with the new modal image src
                    if(!$scope.isBulk) {
                        modalMediaAnnotationService.setMediaUrl($scope.data.images.normal);
                    }

                    directives.forEach(function(value){
                        var content = angular.element(value.selector);
                        content.empty();
                        if(angular.isFunction(value.scope)){
                            content.append($compile(value.directive)(value.scope(settings)));
                        } else {
                            content.append($compile(value.directive)(value.scope));
                        }
                    });
                });
                // There's a millisecond were we can't get the
                // total modal Height (we only get the modal header's Height);
                // so we need to delay the event's attach; this delay is
                // this delay is almost imperceptible due the CSS animation
                $timeout(attachScrollEvent, 100);
            };

            /**
             * Once the pending annotation is used, it finishes the create annotation flow
             */
            var cancelAnnotationUsedListener =
                modalMediaAnnotationService.onPendingAnnotationUsed(function(annotation, linkedEntity) {
                if (linkedEntity) {
                    annotation.editable = false;

                    annotation.externalId = linkedEntity.id;
                    annotation.tooltip = {
                        text: linkedEntity.name
                    };
                    modalMediaAnnotationService.addUpdateAnnotation(annotation);
                }

                $scope.enableNewAnnotation = true;
            });

            $scope.$on('$destroy', function() {
                cancelAnnotationUsedListener();
            });

            var getSuggestionFromCropImage = function(base64CropImage) {
                taggingSuggestionService.getCropSuggestions($scope.data.id, base64CropImage);
            };

            /**
             * Triggered by the drag and drop creation and edition.
             */
            $scope.onAnnotationDataUpdate = function(annotation) {
                annotation.displayRemoveButton = true;
                annotation.displayConfirmButton = false;
                annotation.editable = true;

                modalMediaAnnotationService.setPendingAnnotation(annotation);
                modalMediaAnnotationService.addUpdateAnnotation(annotation);

                // If the customer allows suggestions based on crops, get the base64 from
                // the selected area and search for them.
                asyncSettingsService.isSuggestionFromCropEnabled().then(function(suggestionFromCrop) {
                    if (suggestionFromCrop) {
                        getSuggestionFromCropImage(annotation.getBase64Crop(annotation.geometry));
                    }
                });

                $scope.enableNewAnnotation = false;
            };

            $scope.enableNewAnnotation = true;

            $scope.annotationSearchTooltip = function(text) {
                modalMediaAnnotationService.annotationInputChange(text);
            };

            $scope.getAnnotationData = modalMediaAnnotationService.getAnnotationList;

            $scope.translate = settings.translate;
        };

        return {
            restrict: 'E',
            replace: true,
            link: controller,
            template: '<ng-include src="templateUrl" onLoad="afterLoadTemplate()">'
        };

}])
.directive('ngImageZoom', function(){
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

            attrs.$observe('originalImage', function(){
                if(attrs.ngImageZoom === 'true'){
                    linkImageZoom();
                }
            });

            function linkImageZoom() {
                var component = angular.element(element),
                    zoomType = (angular.isDefined(attrs.zoomType)) ? attrs.zoomType : 'IMAGE',
                    zoomMagnify = (angular.isDefined(attrs.zoomMagnify)) ? attrs.zoomMagnify : 1.75,
                    zoomFade = (angular.isDefined(attrs.zoomFadeDuration)) ? attrs.zoomFadeDuration : 300;

                component.trigger('zoom.destroy');

                if (!attrs.originalImage || zoomType !== 'IMAGE') {
                    return;
                }

                component.zoom({
                    url: attrs.originalImage,
                    magnify: zoomMagnify,
                    duration: zoomFade
                });
            }

        }
    };
});
