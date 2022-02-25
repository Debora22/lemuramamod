'use strict';

/**
 * @ngdoc directive
 * @name op.modal.opModal
 * @restrict E
 *
 * @description
 *
 * This directive binds a tag `<op-modal>` and remplace it for a template.
 *
 * @example
 * Here's an example of how you'd use ui-sref and how it would compile. If you have the
 * following template:
 * <op-modal></op-modal>
 */
angular
    .module('op.modal')
    .directive('opModal', ['$uibModal', 'ROME_MODAL_EVENTS', function($uibModal, ROME_MODAL_EVENTS) {

        var controller = function($scope, element, attrs) {
            var stopWatch = $scope.$watch(function($scope) {
                return $scope[attrs.modal] ||
                       $scope.$parent[attrs.modal] ||
                       $scope.modal ||
                       $scope.$parent.modal;
            }, function(modal) {
                if (!angular.isUndefined(modal)) {

                    stopWatch();
                    /**
                     * @description
                     * Saving the instance returned by $uibModal so we can manipulate
                     * information between here and the ModalController.js
                     */
                    var modalInstance = null;

                    /**
                     * Save reference
                     */
                    $scope.modal = modal;

                    /**
                     * Settings
                     */
                    var settings = $scope.modal;

                    /**
                     * The list of entities to do the navigation
                     */
                    settings.entities = [];

                    /**
                     * Current entity displayed, is an Array to support the bulk
                     */
                    settings.current = [];

                    /**
                     * Save reference when the modal is open
                     */
                    var opened = false;

                    /**
                     * @name open
                     *
                     * @description
                     * Open method to display the modal, this will trigger
                     * by the implementation using $scope.modal.open(data);
                     *
                     * @param  {Object} data Data to be passed to the modal template
                     */
                    $scope.open = function(data, options) {
                        options = options || {};
                        opened = true;
                        settings.current = data;
                        settings.activeTab = options.activeTab || 0;
                        modalInstance = $uibModal.open({
                            controller: 'ModalController',
                            backdrop: true,
                            modalFade: true,
                            scope: $scope,
                            templateUrl: discoverTemplate(),
                            windowClass: 'olapic-modal olapic-modal-size-' + discoverSize()
                        });
                        settings.callbacks.afterOpen();

                        $scope.$emit(ROME_MODAL_EVENTS.opened, {
                            entities: data
                        });
                    };

                    /**
                     * @name close
                     *
                     * @description
                     * Close the modal and trigger a afterClose callback
                     */
                    $scope.close = function() {
                        opened = false;
                        modalInstance.dismiss('cancel');
                        settings.callbacks.afterClose(settings.current);

                        $scope.$emit(ROME_MODAL_EVENTS.closed, {});
                    };

                    /**
                     * @name updateNavigation
                     *
                     * @description
                     * This should be consuming in the implementation each time
                     * the list of elements change, without this the modal will
                     * never generate the pagination.
                     *
                     * @param  {Array} list A list of entities
                     */
                    $scope.updateNavigation = function(list) {
                        settings.entities = list;
                    };

                    /**
                     * @name updateTitle
                     *
                     * @description
                     * Update the title of modal ondemand
                     *
                     * @param  {String} text The new title
                     */
                    $scope.updateTitle = function(text) {
                        settings.title = text;
                    };

                    /**
                     * @name checkIfIsOpen
                     *
                     * @description
                     * Check if the Modal is opened
                     *
                     * @return {Boolean}
                     */
                    $scope.checkIfIsOpen = function() {
                        return opened;
                    };

                    /**
                     * @name removeItem
                     *
                     * @description
                     * Remove a media from the entities Array
                     *
                     * @param  {object} media media to remove.
                     */
                    $scope.removeItem = function(index) {
                        settings.current.splice(index, 1);
                        settings.callbacks.afterRemovingItem();
                        if (settings.current.length === 0) {
                            $scope.close();
                        }
                    };

                    /**
                     * @name discoverTemplate
                     * @private
                     *
                     * @description
                     * Internal check to define the template path
                     *
                     * @return {String} The path of the template
                     */
                    var discoverTemplate = function() {
                        if (angular.isString(settings.templateUrl)) {
                            return settings.templateUrl;
                        }
                        return settings.templatePath + 'src/statics/partials/modal_' + settings.template + '.html';
                    };

                    /**
                     * @name discoverSize
                     * @private
                     *
                     * @description
                     * Internal check to define the size of the modal
                     * by default will be fullscreen.
                     *
                     * @return {String} The modal size
                     */
                    var discoverSize = function() {
                        var size = 'fullscreen';
                        if (!settings.fullscreen) {
                            size = settings.size;
                        }
                        return size;
                    };

                    var attachActions = function() {
                        settings.actions = {
                            open: $scope.open,
                            close: $scope.close,
                            navigation: $scope.updateNavigation,
                            setTitle: $scope.updateTitle,
                            isOpen: $scope.checkIfIsOpen
                        };
                    };

                    var init = function() {
                        attachActions();
                    };

                    init();
                }
            });
        };

        return {
            restrict: 'E',
            replace: true,
            scope: {},
            link: controller
        };

    }]);
