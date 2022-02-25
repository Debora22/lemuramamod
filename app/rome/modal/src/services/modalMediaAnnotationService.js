'use strict';

/**
 * @ngdoc service
 * @name op.modal.modalMediaAnnotationService
 * @description
 *
 * This service manages the list of annotations during the tagging process
 *
 */
angular
.module('op.modal')
.service('modalMediaAnnotationService', [
    '$timeout',
    'taggingSuggestionService',
    function(
        $timeout,
        taggingSuggestionService
    ) {
        // TODO this should be a Class with a proper method to expose px or %
        // this "template" also appear on the annotation component
        var annotationTemplate = {
            externalId: '',
            persitedEntityID: '',
            displayConfirmButton: false,
            onConfirm: function() {},
            displayRemoveButton: true,
            onRemove: function() {},
            editable: false,
            tooltip: {
                text: '',
                thumbnail: ''
            },
            geometry: {
                type: "rectangle",
                coordinates: [{
                    x: 0,
                    y: 0
                }],
                size: [{
                    h: 0,
                    w: 0
                }]
            }
        };
        var exposedAnnotationList;
        var annotationList = [];
        var pendingAnnotation;
        var pendingAnnotationCallbacks = [];
        var annotationRemovedCallbacks = [];
        var annotationInputChangeCallbacks = [];
        var mediaUrl;
        var baseMediaUrl = '/media/image?mediaUrl=';
        var imageContainerDimension = {
            width: 450,
            height: 450
        };

        /**
         * It updates the list of annotations that is visible externally
         * It is being done on the next Digest loop to avoid multiples modifications in the same digest loop.
         * It returns a copy of the internally managed list of annotations, to avoid it being modified without
         * using the exposed methods.
         */
        var refreshExposedAnnotationList = function() {
            $timeout(function() {
                exposedAnnotationList = angular.copy(annotationList);
            });
        };

        /**
         * It removes the Pending annotation and executes all the callbacks that are listening to this event.
         *
         * @param {Object} linkedEntity A business entity that might be related with
         * this specific annotations. (i.e. a product)
         */
        var markPendingAnnotationAsUsed = function(linkedEntity) {
            pendingAnnotationCallbacks.forEach(function(callback) {
                callback(pendingAnnotation, linkedEntity);
            });
            pendingAnnotation = null;
        };

        this.markPendingAnnotationAsUsed = markPendingAnnotationAsUsed;

        /**
         * It check if the annotation exists and returns its index in the list of annotations
         * If the annotation does not exists it returns -1
         * @param annotation The annotation to be found. It could be an integer value. Is such case, it will look
         * that id annotation ids and external ids
         * @returns {boolean}
         */
        function getIndexOf(annotation) {
            var result = -1;
            var idToFind;
            if (angular.isNumber(annotation) || angular.isString(annotation)) {
                idToFind = annotation;
            }

            annotationList.some(function(item, index) {
                if ((idToFind && item.id === idToFind) ||
                    (idToFind && item.externalId === idToFind) ||
                    (annotation.id && item.id === annotation.id) ||
                    (annotation.externalId && item.externalId === annotation.externalId)) {
                    result = index;
                    return true;
                }
            });
            return result;
        }

        /**
         * Update the persitedEntityID of an annotation if it's present on the
         * current working annotations
        */
        this.setAnnotationID = function(annotation, newID){
            var annotationIndex = getIndexOf(annotation);
            if (annotationIndex >= 0) {
                annotationList[annotationIndex].persitedEntityID = newID;
            }
        };

        /**
         * Each annotation that belongs to the annotation list has its own remove handler.
         * When the annotation remove handler is triggered, it remove the linked annotation from the list.
         * Then it refreshes the exposed list of annotations and executes all the callbacks that are listening to
         * the 'remove' event.
         * This handlers also removes the pending annotation if it is the same than the removed one.
         *
         * @param {Object} annotation the annotation that is being deleted
         */
        var removeAnnotationHandler = function(annotation) {
            if (annotation) {
                var indexToDelete = getIndexOf(annotation);

                if (indexToDelete >= 0) {
                    var itemToDeleted = angular.copy(annotationList[indexToDelete]);
                    annotationList.splice(indexToDelete, 1);

                    annotationRemovedCallbacks.forEach(function(callback) {
                        callback(itemToDeleted);
                    });

                    refreshExposedAnnotationList();
                    if (pendingAnnotation &&
                        (annotation.id === pendingAnnotation.id)) {
                        // After remove hotspot get all suggestions and remove crop suggestions
                        taggingSuggestionService.getAllSuggestions();
                        markPendingAnnotationAsUsed();
                    }
                }
            }
        };

        /**
         * It returns the base media url to get the image source through a middleware.
         */
        this.getBaseMediaUrl = function() {
            return baseMediaUrl;
        };

        /**
         * It returns the size of the modal image container
         */
        this.getImageContainerDimension = function() {
            return imageContainerDimension;
        };

        /**
         * The following function will be overwrite by the tagging component
         * to allow search streams from the tooltip.
         * In the future we can change to allow an Array of callbacks
        */
        this.searchFromAnnotationHandler = function() {};

        /**
         * Set a listener for the 'remove' event
         *
         * @param {Function} callback function to be executed
         * @returns {Function} it returns a canceler for the listener
         */
        this.onRemoveAnnotation = function(callback) {
            annotationRemovedCallbacks.push(callback);

            var index = annotationRemovedCallbacks.length - 1;

            return function() {
                annotationRemovedCallbacks.splice(index, 1);
            };
        };

        /**
         * Return the list of Annotations
         */
        this.getAnnotationList = function() {
            return exposedAnnotationList;
        };

        /**
         * This service has the ability to manage one single pending annotation.
         * The pending annotation could or could not be part of the list of annotations.
         * This pending annotation might be used externally for those annotations that are still in progress to be created.
         *
         * @param  {Object} annotation The annotation to be set as pending
         */
        this.setPendingAnnotation = function(annotation) {
            pendingAnnotation = annotation;
        };

        /**
         * Return the pending annotation.
         *
         */
        this.getPendingAnnotation = function() {
            return pendingAnnotation;
        };

        /**
         * Set a listener for the 'Mark pending annotation as used' event
         *
         * @param {Function} callback function to be executed
         * @returns {Function} it returns a canceler for the listener
         */
        this.onPendingAnnotationUsed = function(callback) {
            pendingAnnotationCallbacks.push(callback);

            var index = pendingAnnotationCallbacks.length - 1;

            return function() {
                pendingAnnotationCallbacks.splice(index, 1);
            };
        };

        /**
         * Set a listener for the 'Annotation input change' event
         *
         * @param {Function} callback function to be executed
         * @returns {Function} it returns a canceler for the listener
         */
        this.onAnnotationInputChange = function(callback) {
            annotationInputChangeCallbacks.push(callback);

            var index = annotationInputChangeCallbacks.length - 1;

            return function() {
                annotationInputChangeCallbacks.splice(index, 1);
            };
        };

        /**
         * It adds a new annotation to the annotation list.
         * If the annotation already exists then it updates it.
         * It validates if the annotation already exists whether by using its id or external id.
         * For each added annotation, it sets the remove handler for that annotations
         *
         * @param  {Object} annotation The annotation to be added or updated
         */
        this.addUpdateAnnotation = function(annotation) {
            var itemToEditIndex = getIndexOf(annotation);

            if (itemToEditIndex >= 0) {
                annotationList[itemToEditIndex] = annotation;
            } else {
                annotation.onRemove = removeAnnotationHandler;

                annotationList.push(annotation);
            }

            refreshExposedAnnotationList();
        };

        /**
         * Remove Annotation based on its id.
         *
         * @param  {Integer} id Annotation ID
         */
        this.removeAnnotation = function(id) {
            var itemToDelete = getIndexOf(id);

            if (itemToDelete >= 0) {
                annotationList.splice(itemToDelete, 1);
                refreshExposedAnnotationList();
            }
        };

        /**
         * Remove all the Annotations and remove the pending annotation
         */
        this.cleanAnnotationList = function() {
            annotationList = [];
            pendingAnnotation = null;

            refreshExposedAnnotationList();
        };

        /**
         * It triggers the annotation input change event which executes this event callbacks
         *
         * @param {String} newText the text of the annotation input
         */
        this.annotationInputChange = function(newText) {
            annotationInputChangeCallbacks.forEach(function(callback) {
                callback(newText);
            });
        };

        /**
         * It sets the current media url that the component is displaying
         *
         * @param {String} url current media url
         */
        this.setMediaUrl = function(url) {
            mediaUrl = url;
        };

        /**
         * @name translateAndSetNewAnnotations
         *
         * @description This method converts an array of annotations to make it compatible with the 'annotable' component.
         * It also adds the translated annotations to the list of annotations managed by the service that manages
         * the annotations in the current media.
         *
         * @param {Array} annotationsToBeTranslated List of annotation from our BE service, in a different format needed.
         * @param {Array} streamsList list of stream that the current media has linked
         */
        this.translateAndSetNewAnnotations = function(annotationsToBeTranslated, streamsList) {
            var annotableImage = new Image();

            // Load from browser cache the modal image to get its scaled size
            annotableImage.src = baseMediaUrl + mediaUrl;
            annotableImage.onload = function() {
                //get scale taking into account the defined moderation image working area. i.e 450px
                var scale = Math.min(
                    imageContainerDimension.width / annotableImage.width,
                    imageContainerDimension.height / annotableImage.height
                );

                // get canvas dimensions
                var scaledWidth = annotableImage.width * scale;
                var scaledHeight = annotableImage.height * scale;

                annotationsToBeTranslated.data.forEach(function(annotation) {
                    var streamData = streamsList.find(function(stream) {
                        return stream.id === parseInt(annotation.target.id);
                    }) || {};

                    //save new annotation
                    this.addUpdateAnnotation(angular.extend({}, annotationTemplate, {
                        externalId: parseInt(annotation.target.id),
                        persitedEntityID: annotation.id,
                        tooltip: {
                            text: streamData.name,
                            thumbnail: ''
                        },
                        geometry: {
                            type: "rectangle",
                            coordinates: [{
                                x: annotation.geometry.coordinates[0].x * scaledWidth,
                                y: annotation.geometry.coordinates[0].y * scaledHeight
                            }],
                            size: [{
                                h: annotation.geometry.size[0].h * scaledHeight,
                                w: annotation.geometry.size[0].w * scaledWidth
                            }]
                        }
                    }));
                }, this);
            }.bind(this);
        };
}]);
