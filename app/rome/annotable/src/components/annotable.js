'use strict';

var componentController = [
    '$q',
    '$timeout',
    '$document',
    'uuid4',
    'easeljs',
    'rome',
    function(
        $q,
        $timeout,
        $document,
        uuid4,
        easeljs,
        rome
    ) {
        var ctrl = this;
        var annotationMinWidth = 80;
        var annotationMinHeight = 80;
        var strokerStyle = 3;
        var strokeColor = '#FFFFFF';
        var fillColor = 'rgba(255, 255, 255, 0.1)';
        var tooltipColor = '#6C6F74';
        var tooltipFont = '11px sans-serif';
        // we'll need this element to hide/show it while the annotation is resized/moved
        // we tried to make this by a scope var but we couldn't handle the mouse events with
        // canvas propertly so we're going to save a reference of the element (tooltip wrapper)
        // and the search input.
        var searchTooltip = {
            element: null,
            width: 198, // fixed Width of the tooltip component;
            inputElement: null
        };
        var tooltipFollowedListener;
        var cropImage;
        var componentHeight;
        var componentWidth;

        ctrl.searchTooltipPosition = {
            x:0,
            y:0
        };
        // Default value of the tooltip Search input
        ctrl.searchTooltipText = '';

        //The destination indicator is a box that is displayed where the hotspot would be created on mouseover event
        ctrl.destinationIndicatorVisible = true;

        /**
         * Fire the Search from tooltip callback when the user press Enter.
         */
        ctrl.tooltipSearch = function($event) {
            if ($event.which === 13) {
                ctrl.onInputSearchChange();
            }
        };

        ctrl.onInputSearchChange = function() {
            ctrl.onAnnotationInputSearchChange(ctrl.searchTooltipText);
        };

        function updateSearchTooltipDisplay(newStatus) {
            if (newStatus) {
                searchTooltip.element.style.display = 'block';
                searchTooltip.inputElement.value = '';
                searchTooltip.inputElement.focus();
            } else {
                searchTooltip.element.style.display = 'none';
            }
        }

        /**
         * @name createAnnotationShapes
         * @description It creates the annotation rectangle and point used to resize the annotation
         *
         * @param {Object} rect rectangle instance
         * @param {Object} point point instance
         */
        function createAnnotationShapes(rect, point) {
            rect.graphics.setStrokeStyle(strokerStyle).beginStroke(strokeColor).beginFill(fillColor)
                .drawRect(0, 0, rect.width, rect.height);

            rect.cursor = 'move';

            // setBounds and getBounds are used because this is the only way to save and get
            // the annotation width and height since these properties are not provided for a
            // rect instance
            rect.setBounds(rect.x, rect.y, rect.width, rect.height);


            point.graphics.beginFill(strokeColor).drawRect(-1, -1, 7, 7);
            point.cursor = 'se-resize';
            point.name = 'resizePoint';
        }

        /**
         * @name resizeAnnotation
         * @description It changes the annotation size
         *
         * @param {Object} rect rectangle instance
         * @param {Object} point point instance
         * @param {number} destinationX the point the new size should reach to in the x axis
         * @param {number} destinationY the point the new size should reach to in the y axis
         */
        function resizeAnnotation(rect, point, destinationX, destinationY) {
            rect.graphics.clear();

            //New width and height can't be negatives
            var newWidth = destinationX - rect.x < 0 ? 0 : destinationX - rect.x;
            var newHeight = destinationY - rect.y < 0 ? 0 : destinationY - rect.y;

            //New width and height can't be greater than their minimum value
            newWidth = newWidth < annotationMinWidth && !rect.inProgress ? annotationMinWidth : newWidth;
            newHeight = newHeight < annotationMinHeight && !rect.inProgress ? annotationMinHeight : newHeight;

            rect.graphics.setStrokeStyle(strokerStyle).beginStroke(strokeColor).beginFill(fillColor)
                .drawRect(0, 0, newWidth, newHeight);

            rect.setBounds(rect.x, rect.y, newWidth, newHeight);

            point.x = rect.x + newWidth;
            point.y = rect.y + newHeight;

            ctrl.stage.update();
        }

        /**
         * @name checkSingleClickPosition
         * @description It validates if the hotspot was created by a single click gesture.
         * If so, it positioned the hotspot in the center of the clicked point
         *
         * @param {Object} rect rectangle instance
         * @param {Object} point point instance
         */
        function checkSingleClickPosition(rect, point) {
            var bounds = rect.getBounds();
            if (bounds.width === 1 && bounds.height === 1) {
                rect.graphics.clear();

                var newX = rect.x - (annotationMinWidth / 2);
                var newY = rect.y - (annotationMinHeight / 2);

                //Annotation must be inside the working area
                if (newX + annotationMinWidth > ctrl.width) {
                    newX = ctrl.width - annotationMinWidth;
                } else if (newX < 0) {
                    newX = 0;
                }

                if (newY + annotationMinHeight > ctrl.height) {
                    newY = ctrl.height - annotationMinHeight;
                } else if (newY < 0) {
                    newY = 0;
                }

                rect.x = newX;
                rect.y = newY;

                rect.setBounds(rect.x, rect.y, bounds.width, bounds.height);

                point.x = rect.x;
                point.y = rect.y;

                ctrl.stage.update();
            }
        }

        /**
        * @name checkAnnotationSize
        * @description It validates the annotation min width and height and resize it if necessary
        *
        * @param {Object} rect rectangle instance
        * @param {Object} point point instance
        */
        function checkAnnotationSize(rect, point) {
            var bounds = rect.getBounds();
            if (bounds.width < annotationMinWidth) {
                resizeAnnotation(rect, point, bounds.x + annotationMinWidth, bounds.y + bounds.height);

                bounds = rect.getBounds();
            }

            if (bounds.height < annotationMinHeight) {
                resizeAnnotation(rect, point, bounds.x + bounds.width, bounds.y + annotationMinHeight);
            }
        }

        /**
        * @name getBaseImageSize
        * @description get scaled image size
        */
        function getBaseImageSize() {
            return {
                height: ctrl.height,
                width: ctrl.width
            };
        }

        /**
        * @name getBase64Crop
        * @description generate a base64 image from the annotation geometry data
        *
        * @param {Object} annotationGeometry annotation geometry data
        */
        function getBase64Crop(annotationGeometry) {
            var annotationX = annotationGeometry.coordinates[0].x;
            var annotationY = annotationGeometry.coordinates[0].y;
            var annotationWidth = annotationGeometry.size[0].w;
            var annotationHeight = annotationGeometry.size[0].h;

            // Cache method cache a specfic area of the image allowing us to crop and get
            // the base64 data in the next line
            cropImage.cache(annotationX / ctrl.scale, annotationY / ctrl.scale,
                annotationWidth / ctrl.scale, annotationHeight / ctrl.scale);

            var base64CropImage = cropImage.getCacheDataURL();

            // Cut the first part of the generated String
            // IE. data:image/jpeg;base64,R0lGODlhPQBEAPeoAJosM//AwO... returns: 'R0lGODlhPQBEAPeoAJosM//AwO...'
            return base64CropImage.substr(base64CropImage.indexOf('base64,') + 7);
        }

        /**
         * @name addToAnnotationData
         * @description it adds a new item to annotationData from a rect instance.
         *
         * @param {Object} rect rectangle instance
         */
        function addToAnnotationData(rect) {
            var bounds = rect.getBounds();
            var newAnnotationData = angular.copy(ctrl.annotationData);

            newAnnotationData.push({
                id: rect.id,
                externalId: null,
                displayConfirmButton: false,
                onConfirm: null,
                displayRemoveButton: false,
                onRemove: null,
                tooltip: null,
                geometry: {
                    type: 'rectangle',
                    coordinates: [{
                        x: bounds.x,
                        y: bounds.y
                    }],
                    size: [{
                        h: bounds.height,
                        w: bounds.width
                    }]
                },
                getBase64Crop: getBase64Crop,
                getBaseImageSize: getBaseImageSize
            });

            ctrl.annotationData = newAnnotationData;
        }

        /**
         * @name updateAnnotationGeometry
         * @description Set the rectangle bounds to the annotationData binding array.
         *
         * @param {Object} rect rectangle instance
         */
        function updateAnnotationGeometry(rect) {
            //Search in the array the annotation instance in order to update it
            var exists = ctrl.annotationData.some(function(annotation) {
                if (annotation.id === rect.id) {
                    var bounds = rect.getBounds();

                    annotation.geometry = {
                        type: 'rectangle',
                        coordinates: [{
                            x: bounds.x,
                            y: bounds.y
                        }],
                        size: [{
                            h: bounds.height,
                            w: bounds.width
                        }]
                    };
                    return true;
                }
            });
            if (!exists) {
                //The item does not exits in annotation data, so we create a new object
                addToAnnotationData(rect);
            }
        }

        /**
         * @name notifyAnnotationEdited
         * @description Calls the callback for when the annotation data has changed.
         *
         * @param {number} id of the edited annotation object
         * */
        function notifyAnnotationEdited(id) {
            var editedAnnotation = ctrl.annotationData.find(function(annotation) {
                return annotation.id === id;
            });

            ctrl.onAnnotationDataUpdate({annotation: editedAnnotation});
        }

        /**
         * @name handleShapeEvents
         * @description it handles rectangle and point events for annotation manipulation
         *
         * @param {Object} rect rectangle instance
         * @param {Object} point point instance
         */
        function handleShapeEvents(rect, point) {
            var actionInitialX;
            var actionInitialY;
            var rectInitialX;
            var rectInitialY;
            var pointInitialX;
            var pointInitialY;

            rect.on('mousedown', function(evt) {
                // save rect and point initial position on mouse down
                actionInitialX = evt.stageX;
                actionInitialY = evt.stageY;
                rectInitialX = evt.target.x;
                rectInitialY = evt.target.y;
                pointInitialX = point.x;
                pointInitialY = point.y;
            });

            rect.on('pressmove', function(evt) {
                // Set new rectangle and point position when it is moved.
                if (!rect.editable) {
                    return true;
                }

                var currentX = evt.stageX;
                var currentY = evt.stageY;
                var currentBounds = rect.getBounds();

                var newX = rectInitialX + currentX - actionInitialX;
                var newY = rectInitialY + currentY - actionInitialY;

                //New position must be inside the working are. If not, the annotation won't move
                if (newX + currentBounds.width > ctrl.width) {
                    newX = ctrl.width - currentBounds.width;
                } else if (newX < 0) {
                    newX = 0;
                }

                if (newY + currentBounds.height > ctrl.height) {
                    newY = ctrl.height - currentBounds.height;
                } else if (newY < 0) {
                    newY = 0;
                }

                evt.target.x = newX;
                point.x = evt.target.x + currentBounds.width;

                evt.target.y = newY;
                point.y = evt.target.y + currentBounds.height;

                updateSearchTooltipDisplay(false);
                rect.setBounds(rect.x, rect.y, currentBounds.width, currentBounds.height);
                ctrl.stage.update();
            });

            rect.on('pressup', function() {
                // after move the rectangle and pressup it, set the new rect bounds data to the annotationData array
                // and call the binding callback.

                if (!rect.editable) {
                    // When the annotation is not editable, it does not handle pressup
                    // event since creating annotation by drag and drop is not
                    return true;
                }
                updateSearchTooltipDisplay(true);
                updateAnnotationGeometry(rect);

                notifyAnnotationEdited(rect.id);
            });

            point.on('pressmove', function(evt) {
                if (!rect.editable) {
                    return true;
                }
                updateSearchTooltipDisplay(false);
                resizeAnnotation(rect, point, evt.stageX, evt.stageY);
            });

            // after resize the annotation with the point and pressup it, set the new rect bounds data to
            // the annotationData array and call the binding callback.
            point.on('pressup', function() {
                if (!rect.editable) {
                    return true;
                }
                updateSearchTooltipDisplay(true);
                updateAnnotationGeometry(rect);

                notifyAnnotationEdited(rect.id);
            });

            disableDestinationIndicatorOnMouseOver(rect);
            disableDestinationIndicatorOnMouseOver(point);
        }

        /**
         * @name setEditable
         * @description it sets an annotation components status according with the editable status
         *
         * @param {Object} rect rectangle instance
         * @param {Object} point point instance
         * @param {Boolean} editable whether the annotation is editable or not
         */
        function setEditable(rect, point, editable) {
            rect.editable = editable;
            if (editable) {
                point.visible = true;
                rect.cursor = 'move';
                point.cursor = 'se-resize';
            } else {
                point.visible = false;
                rect.cursor = null;
                point.cursor = null;
            }
        }

        /**
         * @name createAnnotation
         * @description it creates the annotation objects in the canvas. However the rect and point instances
         * must be previously created and provided as params
         *
         * @param {Object} rect rectangle instance
         * @param {Object} point point instance
         * @param {Boolean} annotation the annotation object
         */
        function createAnnotation(rect, point, annotation) {
            //Geometry values
            rect.x = annotation.geometry.coordinates[0].x;
            rect.y = annotation.geometry.coordinates[0].y;
            rect.width = annotation.geometry.size[0].w;
            rect.height = annotation.geometry.size[0].h;

            point.x = annotation.geometry.coordinates[0].x + annotation.geometry.size[0].w - 1;
            point.y = annotation.geometry.coordinates[0].y + annotation.geometry.size[0].h - 1;

            //default values
            createAnnotationShapes(rect, point);
            handleShapeEvents(rect, point);

            setEditable(rect, point, annotation.editable);
            ctrl.stage.addChild(rect);
            ctrl.stage.addChild(point);
            ctrl.stage.update();
        }

        /**
         * @name enableStageEventListener
         * @description it handles the stage events allowing the creation of annotation by
         * using the drag and drop gesture
         */
        function enableStageEventListener() {
            ctrl.stage.on('stagemousedown', function(evt) {
                if (!ctrl.enableEditorUi || evt.relatedTarget) {
                    return;
                }

                var rect = new easeljs.Shape();
                var point = new easeljs.Shape();

                //Setting it so the indicator is not displayed on mouseover. Set display to none for better UX
                ctrl.destinationIndicatorVisible = false;
                setDestinationIndicatorVisibility(false);

                // In progress status is related with the action of creating an annotation by using drag and drop
                // gesture. The rect gets ends its progress status once the user finishes the action.
                // It allows to determine when to start validating its minimum size
                rect.inProgress = true;

                point.parentId = rect.id;

                var annotation = {
                    displayConfirmButton: true,
                    displayRemoveButton: true,
                    editable: true,
                    geometry: {
                        type: 'rectangle',
                        coordinates: [{
                            x: evt.stageX,
                            y: evt.stageY
                        }],
                        size: [{
                            h: 1,
                            w: 1
                        }]
                    }
                };

                createAnnotation(rect, point, annotation);

                // hide the search tool.
                updateSearchTooltipDisplay(false);

                var mouseMoveListener = ctrl.stage.on('stagemousemove', function(evt) {
                    resizeAnnotation(rect, point, evt.stageX, evt.stageY);
                });

                var mouseUpListener = ctrl.stage.on('stagemouseup', function() {
                    ctrl.stage.off('stagemousemove', mouseMoveListener);

                    ctrl.stage.off('stagemouseup', mouseUpListener);

                    checkSingleClickPosition(rect, point);
                    checkAnnotationSize(rect, point);
                    updateAnnotationGeometry(rect);

                    rect.inProgress = false;
                    updateSearchTooltipDisplay(true);
                    createActionButtonsAndTooltip(rect).then(function() {
                        notifyAnnotationEdited(rect.id);
                    });

                    ctrl.destinationIndicatorVisible = true;
                });
            });
        }

        /**
         * @name loadAndCreateBitmap
         * @description It loads the images and returns a promise that is resolved once the image is fully loaded
         *
         * @param {String} src the image url
         */
        function loadAndCreateBitmap(src) {
            return $q(function(resolve) {
                var loadedImage = new Image();
                loadedImage.src = src;

                loadedImage.onload = function() {
                    resolve(new easeljs.Bitmap(loadedImage.src));
                };
            });
        }

        /**
         * @name createConfirmButton
         * @description It loads the confirm button image and create the object inside the canvas
         *
         * @param {String} parent is the annotation that is linked with this button
         */
        function createConfirmButton(parent) {
            return loadAndCreateBitmap(ctrl.imagesPath + 'check.png').then(function(bitmap) {
                var annotationData = ctrl.annotationData.find(function(annotation) {
                    return annotation.id === parent.id || annotation.externalId === parent.externalId;
                }) || {};

                bitmap.scaleX = 0.6;
                bitmap.scaleY = 0.6;
                bitmap.cursor = 'pointer';
                bitmap.name = 'confirmButton';
                bitmap.parentId = parent.id;
                bitmap.visible = annotationData.displayConfirmButton || false;
                ctrl.stage.addChild(bitmap);
                ctrl.stage.update();
                //Set onConfirm callback if exists, if not means it is created by drag and drop.
                bitmap.on('click', function() {
                    if (annotationData.onConfirm) {
                        annotationData.onConfirm(annotationData);
                    }
                });

                return bitmap;
            });
        }

        /**
         * @name createRemoveButton
         * @description It loads the remove button image and create the object inside the canvas
         *
         * @param {String} parent is the annotation that is linked with this button
         */
        function createRemoveButton(parent) {
            return loadAndCreateBitmap(ctrl.imagesPath + 'trash.png').then(function(bitmap) {
                var annotationData = ctrl.annotationData.find(function(annotation) {
                    return annotation.id === parent.id || annotation.externalId === parent.externalId;
                }) || {};

                bitmap.scaleX = 0.6;
                bitmap.scaleY = 0.6;
                bitmap.cursor = 'pointer';
                bitmap.name = 'removeButton';
                bitmap.parentId = parent.id;
                bitmap.visible = annotationData.displayRemoveButton || false;
                ctrl.stage.addChild(bitmap);
                ctrl.stage.update();
                //Set onRemove callback if exists, if not means it is created by drag and drop.
                bitmap.on('click', function() {
                    // hide the tooltip if the annotation is beeing created
                    if (!annotationData.externalId) {
                        updateSearchTooltipDisplay(false);
                    }
                    if (annotationData.onRemove) {
                        annotationData.onRemove(annotationData);
                    }
                });

                disableDestinationIndicatorOnMouseOver(bitmap);

                return bitmap;
            });
        }

        /**
         * @name createTooltip
         * @description It loads the tooltip background image and create the object inside the canvas
         * Then it set the tooltip text
         *
         * @param {String} parent is the annotation that is linked with this button
         */
        function createTooltip(parent) {
            return loadAndCreateBitmap(ctrl.imagesPath + 'name.png').then(function(bitmap) {
                var annotationData = ctrl.annotationData.find(function(annotation) {
                    return annotation.id === parent.id || annotation.externalId === parent.externalId;
                }) || {};

                bitmap.scaleX = 0.4;
                bitmap.scaleY = 0.4;
                bitmap.name = 'tooltip';
                bitmap.parentId = parent.id;
                bitmap.visible = annotationData.tooltip || false;

                ctrl.stage.addChild(bitmap);
                var textToUse = annotationData.tooltip ? annotationData.tooltip.text : '';
                var tooltipText = new easeljs.Text(textToUse, tooltipFont, tooltipColor);
                tooltipText.parentId = parent.id;
                ctrl.stage.addChild(tooltipText);

                setRelativePosition({
                    parent: parent,
                    child: tooltipText,
                    x: 5,
                    y: -20,
                    fixToRight: false,
                    fixToBottom: false
                });

                ctrl.stage.update();

                return bitmap;
            });
        }

        /**
         * @name calculateNextPosition
         * @description Calcula the new position (x and y) of and element (child) based on another one (parent)
         *
         * @param {Object} configuration object;
         *        @param {Object} parent parent Object
         *        @param {Object} child child Object
         *        @param {Integrer} x offset left to add to the position
         *        @param {Integrer} y offset top to add to the position
         *        @param {Boolean} fixToRight make the child Object to follow the parent width
         *        @param {Boolean} fixToBottom make the child Object to follow the parent height
         *        @param {Boolean} fixToMiddle make the child Object to appear in the center width of the parent;
                                               overwrites the fixToRight and x (offset width) options.
         *        @param {Integrer} childWidth child Width to use as reference if fixToMiddle
         *
         * @return {Object} x and y position in pixels
         */
        function calculateNextPosition(data) {
            var bounds = data.parent.getBounds();
            var width = bounds.width;
            var height = bounds.height;

            var addToX = data.fixToRight ? width :  0;
            var addToY = data.fixToBottom ? height : 0;

            var newX = bounds.x;
            var newY = bounds.y + data.y + addToY;

            // if fixToMiddle; calculate the middle width of the parent based on the child;
            // otherwise use the offset width on the param x
            if (data.fixToMiddle) {
                newX = bounds.x + ((width - data.childWidth) / 2);
            }else {
                newX =  bounds.x + data.x + addToX;
            }

            return {
                x: newX,
                y: newY
            };
        }

        /**
         * @name setRelativePosition
         * @description Set the new position of an object in the canvas based on its parent.
         *
         * @param {Object} configuration object;
         *        @param {Object} parent annotation object from where the child Object will be posionated
         *        @param {Object} child child Object to positionate
         *        @param {Integrer} x offset width to add to the position
         *        @param {Integrer} y offset height to add to the position
         *        @param {Boolean} fixToRight make the child Object to follow the parent width
         *        @param {Boolean} fixToBottom make the child Object to follow the parent height
         *        @param {Boolean} fixToMiddle make the child Object to appear in the center width of the parent;
                                               overwrites the fixToRight and x (offset width) options.
         *        @param {Integrer} childWidth child Width to use as reference if fixToMiddle
         */
        function setRelativePosition(data) {
            //Tick event is triggered for all objects in canvas whenever the stage is updated
            data.parent.on('tick', function() {
                var newPosition = calculateNextPosition(data);

                if (data.child.x !== newPosition.x || data.child.y !== newPosition.y) {
                    data.child.x = newPosition.x;
                    data.child.y = newPosition.y;
                    ctrl.stage.update();
                }
            });

            ctrl.stage.update();
        }

        /**
         * @name setElementRelativePosition
         * @description Set the new position of an HTML element on the document based on its parent.
         *
         * @param {Object} configuration object;
         *        @param {Object} parent annotation object from where the child Object will be posionated.
         *        @param {Object} element Object to move.
         *        @param {Integrer} x offset width to add to the position
         *        @param {Integrer} y offset height to add to the position
         *        @param {Boolean} fixToRight make the child Object to follow the parent width
         *        @param {Boolean} fixToBottom make the child Object to follow the parent height
         *        @param {Boolean} fixToMiddle make the child Object to appear in the center width of the parent;
                                               overwrites the fixToRight and x (offset width) options.
         *        @param {Integrer} childWidth child Width to use as reference if fixToMiddle
         */
        function setElementRelativePosition(data) {
            var tooltipListener = data.parent.on('tick', function() {
                //current position
                var currentY = parseInt(data.element.style.top.replace('px', ''));
                var currentX = parseInt(data.element.style.left.replace('px', ''));
                data.child = {
                    x: currentX,
                    y: currentY
                };

                var newPosition = calculateNextPosition(data);

                if (currentX !== newPosition.x || currentY !== newPosition.y) {
                    data.element.style.top = newPosition.y + 'px';
                    data.element.style.left =  newPosition.x + 'px';
                }
            });

            return function() {
                data.parent.off('tick', tooltipListener);
            };
        }

        /**
         * @name createActionButtonsAndTooltip
         * @description it loads the confirm and remove buttons images and the tooltip image
         * and add them to the canvas.
         * Is also sets a relative to their parent position for those elements
         *
         * @param {Object} rect rectangle instance
         * @param {Object} point point instance
         */
        function createActionButtonsAndTooltip(parent) {
            var promiseArray = [];
            promiseArray.push(createConfirmButton(parent).then(function(confirmButton) {
                setRelativePosition({
                    parent: parent,
                    child: confirmButton,
                    x: 25,
                    y: 0,
                    fixToRight: true,
                    fixToBottom: false
                });
            }));

            promiseArray.push(createRemoveButton(parent).then(function(removeButton) {
                setRelativePosition({
                    parent: parent,
                    child: removeButton,
                    x: 0,
                    y: 0,
                    fixToRight: true,
                    fixToBottom: false
                });
            }));

            promiseArray.push(createTooltip(parent).then(function(tooltip) {
                setRelativePosition({
                    parent: parent,
                    child: tooltip,
                    x: 0,
                    y: -30,
                    fixToRight: false,
                    fixToBottom: false
                });
            }));

            // if the tooltip were following an annotation
            if (tooltipFollowedListener) {
                // we're going to cancel the following of the previous annotation
                tooltipFollowedListener();
            }
            // tell the tooltip to follow the new annotation.
            tooltipFollowedListener = setElementRelativePosition({
                parent: parent,
                element: searchTooltip.element,
                // distance the tool tip need from the bottom of the annotation in px
                y: 18,
                fixToBottom: true,
                fixToMiddle: true,
                childWidth: searchTooltip.width
            });

            return $q.all(promiseArray);
        }

        /**
         * @name createAnnotationsFromDataBinding
         * @description It creates all objects related to an annotation
         *
         * @param {Object} annotation the annotation object
         */
        function createAnnotationsFromDataBinding(annotation) {
            var rect = new easeljs.Shape();
            var point = new easeljs.Shape();
            rect.id = annotation.id || rect.id;
            rect.externalId = annotation.externalId;

            point.parentId = rect.id;

            annotation.id = rect.id;
            createAnnotation(rect, point, annotation);

            createActionButtonsAndTooltip(rect);

            addHiddenElement(rect.externalId);
        }

        /**
         * @name hasDifferences
         * @description It compares the two annotation objects
         *
         * @param {Object} current the annotation object
         * @param {Object} previous the annotation object
         */
        var hasDifferences = function(current, previous) {
            var objectKeys = [
                'displayConfirmButton',
                'onConfirm',
                'displayRemoveButton',
                'onRemove',
                'editable',
                'tooltip',
                'geometry'
            ];

            return JSON.stringify(current, objectKeys) !== JSON.stringify(previous, objectKeys);
        };

        /**
         * @name updateAnnotation
         * @description Updating an annotation means the the annotation objects are deleted and then the
         * new ones are created
         *
         * @param {Object} annotation the annotation object
         */
        function updateAnnotation(annotation) {
            removeAnnotation(annotation);

            createAnnotationsFromDataBinding(annotation);
        }

        /**
         * @name removeAnnotation
         * @description Remove all object in canvas related with an annotation
         *
         * @param {Object} annotation the annotation object
         */
        function removeAnnotation(annotation) {
            removeHiddenElement(annotation.externalId);
            var parent = ctrl.stage.children.find(function(canvasChild) {
                return (canvasChild.id && canvasChild.id === annotation.id) ||
                    (canvasChild.externalId && canvasChild.externalId === annotation.externalId);
            });

            if (parent) {
                ctrl.stage.children.filter(function(canvasChild) {
                    return canvasChild.parentId === parent.id;
                }).forEach(function(shape) {
                    ctrl.stage.removeChild(shape);
                });
                ctrl.stage.removeChild(parent);

                ctrl.stage.update();
            }
        }

        /**
         * It hides the destination indicator bounding box when on mouseover event for the specified element
         * @param {Object} element The element that mouseover event should hides the destination indicator
         */
        function disableDestinationIndicatorOnMouseOver(element) {
            element.on('mouseover', function() {
                ctrl.destinationIndicatorVisible = false;
            });

            element.on('mouseout', function() {
                ctrl.destinationIndicatorVisible = true;
            });
        }

        /**
         * Whether display the indicator or not
         * @param visible True to set it visible
         */
        function setDestinationIndicatorVisibility(visible) {
            if (visible) {
                ctrl.wrapperElement.css('cursor', 'none');
                ctrl.destinationIndicator.css('display', 'block');
            } else {
                ctrl.wrapperElement.css('cursor', 'default');
                ctrl.destinationIndicator.css('display', 'none');
            }
        }

        /**
         * It adds a box that is displayed where the hotspot would be created on mouseover event
         */
        function addDestinationIndicator() {
            //A div element for the bounding box, plus an icon displayed in the center of the bounding box,
            //plus a div that displays a tooltip
            var html = '<div class="op-annotable-destination-indicator"><i class="icon-plus"/>' +
                '<div class="op-annotable-destination-indicator-tooltip">Click to create hotspot</div>' +
                '</div>';
            var destinationIndicator = angular.element(html);

            ctrl.wrapperElement.append(destinationIndicator);

            ctrl.wrapperElement.on('mousemove', function(e) {
                if (ctrl.destinationIndicatorVisible && ctrl.enableEditorUi) {
                    var leftValue = e.clientX  - (annotationMinWidth / 2);
                    var topValue = e.clientY  - (annotationMinHeight / 2);

                    var wrapperBounding = ctrl.wrapperElement[0].getBoundingClientRect();

                    //New position must be inside the working are. If not, the destination indicator won't move
                    if (leftValue + annotationMinWidth > wrapperBounding.left + ctrl.width) {
                        leftValue = wrapperBounding.left + ctrl.width - annotationMinWidth;
                    } else if (leftValue < wrapperBounding.left) {
                        leftValue = wrapperBounding.left;
                    }

                    if (topValue + annotationMinHeight > ctrl.height + wrapperBounding.top) {
                        topValue = wrapperBounding.top + ctrl.height - annotationMinHeight;
                    } else if (topValue < wrapperBounding.top) {
                        topValue = wrapperBounding.top;
                    }

                    ctrl.destinationIndicator.css('left', leftValue + 'px');
                    ctrl.destinationIndicator.css('top', topValue + 'px');

                    setDestinationIndicatorVisibility(true);
                } else {
                    setDestinationIndicatorVisibility(false);
                }
            });

            ctrl.wrapperElement.on('mouseleave', function() {
                setDestinationIndicatorVisibility(false);
            });

            destinationIndicator.css('top', '0');
            destinationIndicator.css('left', '0');
            destinationIndicator.css('width', annotationMinWidth + 'px');
            destinationIndicator.css('height', annotationMinHeight + 'px');

            ctrl.destinationIndicator = destinationIndicator;
        }

        /**
         * It adds a hidden element for the hotspot. It is being use for QA purpose
         */
        function addHiddenElement(id) {
            if (id) {
                var html = '<input type="hidden" id="hotspot-' + id + '"></input>';
                var hotspotDomElement = angular.element(html);

                ctrl.wrapperElement.append(hotspotDomElement);
            }
        }

        /**
         * It removes the hidden element for the hotspot
         */
        function removeHiddenElement(id) {
            if (id) {
                angular.element($document[0].getElementById('hotspot-' + id)).remove();
            }
        }

        /**
         * @name $onInit
         *
         * @description
         */
        ctrl.$onInit = function() {
            ctrl.canvasId = uuid4.generate();
            ctrl.wrapperId = 'op-annotable-' + ctrl.canvasId;

            ctrl.imagesPath = rome.getImagesPath('annotable');

            //Set default values if width and height are not defined.
            ctrl.width = ctrl.width || 450;
            ctrl.height = ctrl.height || 450;

            componentHeight = ctrl.height;
            componentWidth = ctrl.width;

            ctrl.baseMediaUrl = ctrl.baseMediaUrl || '';

            ctrl.annotationData = ctrl.annotationData || [];

            ctrl.mainImage = new Image();
            ctrl.mainImage.src = ctrl.baseMediaUrl + ctrl.src;

            ctrl.mainImage.onload = function() {
                ctrl.canvasContainer = angular.element($document[0].getElementById('canvasContainer'));

                // Delete canvas html element if exists
                if (ctrl.canvasContainer[0].children.length) {
                    ctrl.canvasContainer[0].removeChild(ctrl.canvasContainer[0].children[0]);
                }

                ctrl.scale = Math.min(ctrl.width / ctrl.mainImage.width, ctrl.height / ctrl.mainImage.height);

                // get white margin spaces
                var whiteMarginX = (ctrl.width - (ctrl.mainImage.width * ctrl.scale)) / 2;
                var whiteMarginY = (ctrl.height - (ctrl.mainImage.height * ctrl.scale)) / 2;

                // Change canvas dimensions with the image scale
                ctrl.width = ctrl.mainImage.width * ctrl.scale;
                ctrl.height = ctrl.mainImage.height * ctrl.scale;

                // Add canvas element to the canvasContainer element
                var canvasElement = angular.element('<canvas id="' + ctrl.canvasId + '" ' +
                    'width="' + ctrl.width + '" height="' + ctrl.height + '"></canvas>');
                ctrl.canvasContainer[0].append(canvasElement[0]);

                //Wait 1 digest tick in order to bind the canvasId with the template
                $timeout(function() {
                    ctrl.wrapperElement = angular.element($document[0].getElementById(ctrl.wrapperId));

                    // Center the canvas with margin spaces
                    ctrl.wrapperElement.css('margin-left', whiteMarginX);
                    ctrl.wrapperElement.css('margin-top', whiteMarginY);

                    //Create a stage instance from the template canvas
                    ctrl.stage = new easeljs.Stage(ctrl.canvasId);

                    ctrl.stage.enableMouseOver();
                    // save the element from the DOM to hide it while
                    // the annotation are being moved.
                    searchTooltip.element = $document[0].getElementById('op-annotable-search-tooltip-' + ctrl.canvasId);
                    searchTooltip.inputElement = $document[0].getElementById('op-annotable-search-stream');

                    addDestinationIndicator();

                    var background = new easeljs.Bitmap(ctrl.mainImage.src);

                    background.x = 0;
                    background.y = 0;

                    background.scaleX = ctrl.scale;
                    background.scaleY = ctrl.scale;

                    // Copying the background image to get the crop later
                    cropImage = angular.copy(background);

                    ctrl.stage.addChild(background);

                    //update canvas with the created image
                    ctrl.stage.update();

                    //Create annotations that already exists in annotation data binding
                    if (ctrl.annotationData && ctrl.annotationData.length) {
                        ctrl.annotationData.forEach(function(annotation) {
                            createAnnotationsFromDataBinding(annotation);
                        });
                    }

                    enableStageEventListener();
                });
            };
        };

        this.$onChanges = function(changesData) {
            var annotationCurrentValue = changesData.annotationData ? changesData.annotationData.currentValue : {};
            var annotationPreviousValue = changesData.annotationData ? changesData.annotationData.previousValue : {};

            if (changesData.src && !changesData.src.isFirstChange() &&
                changesData.src.currentValue !== changesData.src.previousValue) {
                ctrl.stage.children = [];
                ctrl.stage.update();

                // Set component width and heightfor the next media image
                ctrl.width = componentWidth;
                ctrl.height = componentHeight;

                ctrl.mainImage.src = ctrl.baseMediaUrl + changesData.src.currentValue;

                updateSearchTooltipDisplay(false);
            }
            if (ctrl.stage && changesData.annotationData && !changesData.annotationData.isFirstChange()) {
                if (annotationCurrentValue) {
                    annotationCurrentValue.forEach(function(current) {
                        // If annotationPreviousValue is undefined means we must create new annotations
                        var exists = (annotationPreviousValue) ?
                            annotationPreviousValue.some(function(previous) {
                                // if the current id or the externalId are find
                                if ((current.id && current.id === previous.id) ||
                                    (current.externalId && current.externalId === previous.externalId)) {
                                    if (hasDifferences(current, previous)) {
                                        updateAnnotation(current);
                                        updateSearchTooltipDisplay(false);
                                    }
                                    return true;
                                }
                            }) :
                            false;

                        if (!exists && !current.id) {
                            createAnnotationsFromDataBinding(current);
                        } else if (!exists && current.id) {
                            //this is an special case, where the annotation was created
                            // by using drag and drop and it is not reflected on onChange event
                            updateAnnotation(current);
                        }
                    });
                }
                // loop trought the previous annotatio list to remove those which are not present.
                if (annotationPreviousValue) {
                    annotationPreviousValue.forEach(function(previous) {
                        // If annotationCurrentValue is undefined means we must remove all the olds annotations
                        var exists = (annotationCurrentValue) ?
                            annotationCurrentValue.some(function(current) {
                                // if the current id or the externalId are find
                                return (current.id && current.id === previous.id) ||
                                        (current.externalId && current.externalId === previous.externalId);
                            }) :
                            false;

                        if (!exists) {
                            removeAnnotation(previous);
                        }
                    });
                }
            }
        };
    }];

/**
 * @ngdoc component
 * @name op.annotable.img
 *
 * @description This component allow the user the creation of hotspot in a given media with drag and drop.
 *
 * @param {String} src image source. Image will be adapted by canvas width and height, but it will keep its aspect ratio.
 * @param {Number} width the width in px, default 200px
 * @param {Number} height the height in px, default 300px
 * @param {Array} annotationData arrays of objects containing all the annotation data.
 * @param {Boolean} enableEditorUi if this is true, this method allow to the user the creation of annotation using drag and drop
 * @param {String} baseMediaUrl the base image url to get the image src, default empty string
 * @param {Function} onAnnotationDataUpdate callback to be called when an annotation
 * is being edited by using mouse gestures (move, resize, new annotation)
 */

angular
    .module('op.annotable')
    .component('opAnnotableImg', {
        templateUrl: ['rome', function(rome) {
            return rome.getTemplatesPath('annotable') + 'annotable.html';
        }],
        controller: componentController,
        bindings: {
            src: '<',
            width: '<',
            height: '<',
            annotationData: '<',
            onAnnotationDataUpdate: '&',
            onAnnotationInputSearchChange: '<',
            enableEditorUi: '<',
            baseMediaUrl: '<'
        }
    });
