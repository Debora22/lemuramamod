'use strict';

/**
 * @ngdoc controller
 * @name op.modal.ModalController
 * @description
 *
 * This controller will manage the instance of the bootstrap modal.
 * Here we can control everything related to the bootrstrap modal scope.
 *
 */
angular
.module('op.modal')
.controller('ModalController', [
    '$scope',
    '$uibModalInstance',
    '$rootScope',
    'ROME_MODAL_EVENTS',
    function(
        $scope,
        $uibModalInstance,
        $rootScope,
        ROME_MODAL_EVENTS
    ) {

        var settings = $scope.modal;

        $scope.isBulk = (settings.current.length > 1) ? true : false;

        /**
         * Zoom enabled/disabled set on the $scope, to be readed in the directive
         */
        $scope.zoom = settings.zoom;

        /**
         * Settings the title of the modal
         */
        $scope.title = settings.title || 'Preview';

        /**
         * Passing the data of the .open to the modal, most of the cases
         * this should be the media entity.
         */
        $scope.data = ($scope.isBulk) ? settings.current : settings.current[0];

        /**
         * The next entity data
         */
        $scope.next = null;

        /**
         * The previous entity data
         */
        $scope.prev = null;

        /**
         * @name have
         *
         * @description
         * This will check if the modal will have pagination, on the implementation
         * we should always refresh the list of entities from the $parent, so the modal
         * can have the latest information.
         * Plus this will set the $scope.next and $scope.prev with the entities.
         *
         * @param  {String} direction [next/prev]
         * @return {Boolean}
         */
        $scope.have = function(direction) {
            if ($scope.isBulk) {
                return false;
            }

            if (!angular.isUndefined(settings.entities) && settings.entities.length > 0) {
                var index = settings.entities.indexOf($scope.data);
                if (direction === 'next') {
                    index++;
                    if (angular.isUndefined(settings.entities[index])) {
                        index = 0;
                    }
                } else if (direction === 'prev') {
                    index--;
                    if (angular.isUndefined(settings.entities[index])) {
                        index = settings.entities.length;
                        index--;
                    }
                }
                $scope[direction] = settings.entities[index];
                return true;
            }
            return false;
        };

        /**
         * @name move
         *
         * @description
         * Change the $scope.data for the new information
         *
         * @param  {String} direction [next/prev]
         */
        $scope.move = function(direction) {
            delete $scope.data.annotationData;
            $scope.enableNewAnnotation = true;

            $scope.data = $scope[direction];
            settings.current = [$scope.data];
            settings.callbacks.afterMove(direction, $scope.data);

            $scope.$emit(ROME_MODAL_EVENTS.move, {
                direction: direction,
                entity: $scope.data
            });
        };

        /**
         * @name haveExtras
         *
         * @description
         * Check if the modal will have a second column
         *
         * @return {Boolean}
         */
        $scope.haveExtras = function() {
            return (settings.extras.length > 0) ? true : false;
        };

        /**
         * Keyboard navigation options
         */
        var navigation = {
            turnOff: function() {
                angular.element(document).off('keydown');
            },
            turnOn: function() {
                angular.element(document).on('keydown', function(event) {
                    var target = angular.element(event.target).prop('tagName').toLowerCase();
                    if (target !== 'input' && target !== 'textarea') {
                        if (event.keyCode === 39 && !$scope.isBulk) {
                            $scope.move('next');
                        } else if (event.keyCode === 37 && !$scope.isBulk) {
                            $scope.move('prev');
                        } else if (event.keyCode === 27) {
                            $scope.close();
                        }
                    }
                    $scope.$apply();
                });
            }
        };

        /**
         * Enabling the navigation
         */
        var keyNavigation = function() {
            navigation.turnOff();
            navigation.turnOn();
        };

        /**
         * Attach navigation actions
         */
        var attachNavigationActions = function() {
            var actions = {
                next: function() {
                    $scope.move('next');
                },
                prev: function() {
                    $scope.move('prev');
                }
            };
            angular.extend(settings.actions, actions);
        };

        if (settings.navigation) {
            keyNavigation();
            attachNavigationActions();
        }

        $scope.enableNewAnnotation = true;
        $uibModalInstance.result.then(function() {
            navigation.turnOff();
        }, function() {
            navigation.turnOff();
        });

        $rootScope.$broadcast('opModalInstantiated', {target: settings});
    }
]);
