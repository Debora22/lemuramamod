'use strict';

/**
 * @ngdoc directive
 * @name op.box.opBox
 * @restrict E
 *
 * @description
 *
 * This directive binds a tag `<op-box>` and remplace it for a template.
 * This directive needs two params for work ok, box and entity.
 * Box is an instance of {@link op.box.Box} and entity is an object.
 *
 * @example
 * Here's an example of how you'd use op-box and how it would compile. If you have the
 * following template:
 * <op-box box="box" entity="entity"></box>
 */
angular
    .module('op.box')
    .directive('opBox', function($compile) {
        var controller = function(scope, element, attrs) {

            var stopWatch = scope.$watch(function(scope) {
                return scope.$parent[attrs.box] || scope.$parent.box;
            }, function(settings) {

                if (!angular.isUndefined(settings) && !angular.isUndefined(settings.callbacks)) {

                    stopWatch();

                    scope.box = settings;
                    scope.entity = scope.$parent[attrs.entity] || scope.$parent.entity;

                    /*
                     * Decide if use the default themplate or a custom template.
                     * If use the default template, add a custom template path
                     */
                    if (angular.isString(scope.box.type)) {
                        scope.templateUrl = scope.box.templatePath + 'src/statics/partials/box_' +
                            scope.box.type + '.html';
                    } else {
                        if (angular.isString(scope.box.templateUrl)) {
                            scope.templateUrl = scope.box.templateUrl;
                        } else {
                            scope.templateUrl = scope.box.templatePath + 'src/statics/partials/box.html';
                        }
                    }

                    /**
                     * @name photoClick
                     *
                     * @description
                     * Let you add a custom callback when the user click over the photo box
                     *
                     * @param {object} entity Entity object.
                     * @param {int} index Index of the box clicked.
                     *
                     * @returns {fn} default or custom callback.
                     */
                    scope.photoClick = function(entity, index) {
                        return scope.box.callbacks.afterPhotoClick(entity, index);
                    };

                    /**
                     * @name carouselPhotoClick
                     *
                     * @description
                     * It detects a click on a carousel item and sends the item
                     * and its index to the afterCarouselPhotoClick callback.
                     *
                     * @param {object} entity The box main entity.
                     * @param {object} item The item that was clicked.
                     * @param {int} index The array index of carousel item.
                     *
                     * @returns {function} default or custom callback.
                     */
                    scope.carouselPhotoClick = function(entity, item, index) {
                        return scope.box.callbacks.afterCarouselPhotoClick(entity, item, index);
                    };

                    /**
                     * @name checkboxChange
                     *
                     * @description
                     * Let you add a custom callback when the user change the checkbox status
                     *
                     * @param {object} entity Entity object.
                     *
                     * @returns {fn} default or custom callback.
                     */
                    scope.checkboxChange = function(entity) {
                        scope.box.callbacks.afterCheckboxChange(entity);
                    };

                    /*
                     * scope.box.carousel can be array or function or false.
                     *     if it's an array, apply this to the scope.carousel,
                     *     if it's a function, send entity like a attr and wait for promisse,
                     * then apply reponse to the scope.carousel.
                     *     if it's false we should hide the box-tags section on the template

                     * @example
                     *
                     * scope.carousel should be an array with objects
                     * [{title: "title", image: "image.jpg"}]
                     */
                    scope.carousel = [];
                    scope.loadingStreams = false;
                    if (!scope.box.carousel) {
                        scope.carousel = false;
                    } else if (angular.isArray(scope.box.carousel)) {
                        scope.carousel = scope.box.carousel;
                    }else if (angular.isFunction(scope.box.carousel)) {
                        scope.loadingStreams = true;
                        scope.box.carousel(scope.entity).then(function(data) {
                            scope.loadingStreams = false;
                            scope.carousel = data;
                        });
                    }

                    /**
                     * @name afterLoadTemplate
                     *
                     * @description
                     * when all inludes was loaded, call this method
                     */
                    scope.afterLoadTemplate = function() {
                        var headerActions = scope.box.headerActions;
                        if (!angular.isUndefined(headerActions.scope)) {
                            var content = angular.element('.content_actions', element[0]);
                            if (angular.isFunction(headerActions.scope)) {
                                content.append($compile(headerActions.directive)(headerActions.scope(scope)));
                            } else {
                                content.append($compile(headerActions.directive)(headerActions.scope));
                            }
                            scope.box.callbacks.afterRender(scope.entity, element[0]);
                        } else {
                            scope.box.callbacks.afterRender(scope.entity, element[0]);
                        }
                    };

                    /**
                     * Check the status of scope.entity.checked
                     * to update the box-container layout.
                     * @return {string} the new box-container class list
                     */
                    scope.getBoxClass = function() {
                        var theClasses = 'box-container';

                        theClasses += (scope.entity.checked) ? ' box-media-checked' : '';
                        return theClasses;
                    };

                    scope.showCheckbox = settings.showCheckbox;
                    scope.translate = settings.translate;
                }
            });
        };

        return {
            restrict: 'E',
            replace: true,
            scope: {},
            link: controller,
            template: '<div class="box-container" ng-class="getBoxClass()">' +
            '<ng-include onload="afterLoadTemplate()" src="templateUrl"></div>'
        };
    });
