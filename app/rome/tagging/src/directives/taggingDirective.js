
'use strict';

/**
 * @ngdoc directive
 * @name op.tagging.opTagging
 * @restrict E
 *
 * @description
 * This directive binds a tag '<op-tagging></op-tagging>'
 */
angular
.module('op.tagging')
.directive('opTagging', [
    '$timeout',
    '$location',
    'taggingSuggestionService',
    'ROME_TAGGING_EVENTS',
    'EXTERNAL_TRACKING_EVENTS',
    'modalMediaAnnotationService',
    function(
        $timeout,
        $location,
        taggingSuggestionService,
        ROME_TAGGING_EVENTS,
        EXTERNAL_TRACKING_EVENTS,
        modalMediaAnnotationService
    ) {
        var controller = function($scope, element, attrs) {
            var stopWatch = $scope.$watch(function($scope) {
                return $scope[attrs.tagging] || $scope.tagging || $scope.$parent.tagging;
            }, function(tagging) {
                if (!angular.isUndefined(tagging) && !angular.isUndefined(tagging.templatePath)) {
                    stopWatch();
                    /**
                     * Settings
                     */
                    var settings = tagging;

                    /**
                     * Setting templateUrl in base of the seted path
                     */
                    $scope.templateUrl = settings.templatePath + 'src/statics/partials/tagging.html';

                    /**
                     * Bind object contain the query search and the zoomOnHover settings
                     */
                    $scope.bind = {
                        searchText: '',
                        zoomOnHover: settings.zoomOnHover
                    };

                    /**
                     * Setting loading indicator status
                     */
                    $scope.loading = false;

                    /**
                     * Flag to set when the search doens't get any result
                     */
                    $scope.searchFail = false;

                    /**
                     * Flag to set when the search doens't have more content for load
                     */
                    $scope.haveNextPage = false;

                    /**
                     * The list of results returned from the loadContent callback
                     */
                    $scope.results = [];

                    /*
                     * Boolean in charge of show or not show suggested medias
                     */
                    $scope.showSuggestion = true;

                    /**
                     * Holds the promise returned by $timeout on $scope.onInputSearchChange
                     * so it can be canceled after a new search is triggered to prevent
                     * racecondition on live search
                     */
                    $scope.stopSearch = null;

                    /**
                     * Show or hide the clear button for the search input
                     */
                    $scope.showClearBtn = false;

                    /**
                     * @name saveSorting.
                     *
                     * @description
                     * This is called every time it sorting changes. It
                     * executes the callback that will probably inform
                     * the API of the change.
                     */
                    var saveSorting = function() {
                        settings.callbacks.saveSorting($scope.entities);
                    };

                    /**
                     * The options for the ui-sortable implementation.
                     * @type {Object}
                     */
                    $scope.sortableOptions = {
                        disabled: !settings.sorting,
                        /**
                         * This should be on the 'update' callback but for some
                         * WEIRD scope magic, the directive rewrites itself
                         * before the jQuery event triggers
                         */
                        stop: function() {
                            saveSorting();
                        },
                        axis: 'x'
                    };

                    /**
                     * @name onInputSearchKeypress
                     *
                     * @description
                     * Listen the keypress event on input search and triggers $scope.search
                     * if the key pressed is an "enter"
                     *
                     * @param  {Event} $event The input event
                     */
                    $scope.onInputSearchKeypress = function($event) {
                        if ($event.which === 27) {
                            angular.element('button', $event.target.parentElement).focus();
                        } else if ($event.which === 13) {
                            $scope.search();
                        }
                    };

                    /**
                     * @name onInputSearchChange
                     *
                     * @description
                     * This will trigger a search after the search input changed.
                     *
                     */
                    $scope.onInputSearchChange = function() {
                        $scope.results = [];
                        $scope.showClearBtn = $scope.bind.searchText ? true : false;
                        $scope.search();
                    };

                    /**
                     * IT handles the annotation input change event. It execute the search of streams
                     */
                    var annotationCallbackCanceler = modalMediaAnnotationService.onAnnotationInputChange(
                        function(newText) {
                            $scope.bind.searchText = newText;
                            $scope.search();
                        }
                    );

                    /**
                     * @name search
                     *
                     * @description
                     * This will trigger the loadContent callback with the query
                     * and catch the results.
                     *
                     */
                    $scope.search = function() {
                        var searchText = $scope.bind.searchText;
                        var eventLocation =  $location.path();
                        eventLocation += ($scope.media.length > 1) ? '/bulk/search' : '/media/search';

                        if (searchText.trim().length <= 2) {
                            settings.callbacks.emptyField();
                            $scope.showSuggestion = true;
                            return;
                        }
                        $scope.loading = true;
                        settings.callbacks.loadContent({
                            q: searchText,
                            size: settings.searchLimit
                        }, function(response) {
                            if (response.batch.length === 0) {
                                $scope.searchFail = true;
                                $scope.showSuggestion = true;
                            } else {
                                $scope.showSuggestion = false;
                            }
                            $scope.results = response.batch;
                            $scope.haveNextPage = response.nextPage;
                            $scope.loading = false;
                        });
                        $scope.$emit(EXTERNAL_TRACKING_EVENTS.pageView.search, eventLocation, searchText);
                    };

                    /**
                     * @name onClearBtnClick
                     *
                     * @description
                     * Clears the search input, shows the suggestions and hides the clear btn
                     *
                     */
                    $scope.onClearBtnClick = function() {
                        $scope.bind.searchText = '';
                        $scope.results = [];
                        $scope.searchFail = false;
                        $scope.showSuggestion = true;
                        $scope.showClearBtn = false;
                    };

                    /**
                     * @name loadMoreContent
                     *
                     * @description
                     * This will trigger the loadMoreContent callback
                     * and concat the results.
                     *
                     */
                    $scope.loadMoreContent = function() {
                        $scope.loading = true;
                        settings.callbacks.loadMoreContent(function(response) {
                            if (response.batch.length === 0) {
                                $scope.searchFail = true;
                            }
                            $scope.results = $scope.results.concat(response.batch);
                            $scope.haveNextPage = response.nextPage;
                            $scope.loading = false;
                        });
                    };

                    /**
                     * @name checkIfExists
                     *
                     * @description
                     * Internal function to check if the item is already in the entities
                     * array.
                     *
                     * @param  {Integer} id The entity id which we want to control
                     * @return {Boolean}
                     */
                    $scope.checkIfExists = function(id) {
                        var exit = false,
                            strId = id.toString();
                        $scope.entities.forEach(function(item) {
                            if (item.id === strId || item.id === id) {
                                exit = true;
                            }
                        });
                        return exit;
                    };

                    /**
                     * @name annotationsToPercent
                     *
                     * @description
                     * Transform the annotation geometry object from pixels to percentage
                     *
                     * @param  {Object} annotationGeometry geometry to transform
                     * @param  {Object} scaleImageSize current scaled image
                     * @return {Object} annotationGeometry with the transformed data
                     */
                    var annotationsToPercent = function(annotationGeometry, scaleImageSize) {
                        annotationGeometry.size[0].w = annotationGeometry.size[0].w / scaleImageSize.width;
                        annotationGeometry.size[0].h = annotationGeometry.size[0].h / scaleImageSize.height;
                        annotationGeometry.coordinates[0].x = annotationGeometry.coordinates[0].x / scaleImageSize.width;
                        annotationGeometry.coordinates[0].y = annotationGeometry.coordinates[0].y / scaleImageSize.height;

                        return annotationGeometry;
                    };

                    /**
                     * @name pushEntity
                     *
                     * @description
                     * This is the real method that saves the entity into the
                     * 'entities' array. It's exposed outside the scope because
                     * the 'filterItemToAdd' callback can return a promise or
                     * not. See the definition of $scope.add to better
                     * understand the reason of this.
                     *
                     * @param  {Object} entity The entity object to push
                     */
                    var pushEntity = function(entity, metadataValue) {
                        if (!$scope.checkIfExists(entity.id)) {
                            var pendingAnnotation = modalMediaAnnotationService.getPendingAnnotation();

                            if (pendingAnnotation) {
                                var scaledImageSize = pendingAnnotation.getBaseImageSize();

                                entity.annotation = {
                                    id: pendingAnnotation.id,
                                    geometry: pendingAnnotation.geometry
                                };
                                modalMediaAnnotationService.markPendingAnnotationAsUsed(entity);

                                entity.annotation.geometry = annotationsToPercent(
                                    angular.copy(pendingAnnotation.geometry),
                                    scaledImageSize
                                );
                            }

                            $scope.entities.push(entity);
                            settings.callbacks.itemAdded(entity, $scope, metadataValue).then(function(result){
                                //update the annotationID with the response from the service
                                if (pendingAnnotation && result[$scope.media[0].id]) {
                                    // search for the stream which was assined to the annotation
                                    var theStream = result[$scope.media[0].id].find(function(stream){
                                        return (stream.id === entity.id);
                                    });
                                    if(theStream){
                                        modalMediaAnnotationService.setAnnotationID(entity.annotation, theStream.annotation_id);
                                        taggingSuggestionService.getAllSuggestions();
                                    }
                                }
                            });


                        }
                    };

                    /**
                     * @name add
                     *
                     * @description
                     * Add new item to the entities and trigger the itemAdded callback
                     * Aditionally triggers an App Event for their subscribers.
                     *
                     * @param {Object} stream The stream object
                     * @param {String} section Section where the add stream comes from: search-result / suggestion
                     * @param {String} position position of the selected stream in the suggestion list
                     */
                    $scope.add = function(stream, section, position) {
                        var filter = settings.callbacks.filterItemToAdd(stream);
                        var metadataValue = [];
                        // custom dimensions variables
                        var hasHotspot = !!stream.annotation;
                        var taggingFrom = 'search';
                        var suggestionsActive = 'no';

                        // custom dimensions validations
                        if ($scope.isSuggestionAvailable && $scope.isSuggestionFromCropAvailable) {
                            suggestionsActive = 'both';
                        } else if ($scope.isSuggestionAvailable) {
                            suggestionsActive = 'general_suggestion';
                        } else if ($scope.isSuggestionFromCropAvailable) {
                            suggestionsActive = 'suggestion_by_crop';
                        }

                        if (($scope.isSuggestionAvailable || $scope.isSuggestionFromCropAvailable) &&
                            $scope.media.length === 1) {
                            var searchEventData = {
                                from: section,
                                stream: stream
                            };

                            if (section === 'search-result') {
                                // Retrieve latest suggested stream list in order to check if the searched
                                // stream was in the suggested list
                                var latestSuggestion = taggingSuggestionService.getLastestSuggestions();
                                var allSuggestions = [];
                                Object.keys(latestSuggestion).forEach(function(category) {
                                    allSuggestions = allSuggestions.concat(latestSuggestion[category]);
                                });
                                var streamHasBeenSuggested = allSuggestions.some(function(suggestedStream) {
                                    return suggestedStream.id === stream.id;
                                });
                                // streamHasBeenSuggested is true means the user search a stream that was
                                // in the suggested list
                                searchEventData.streamHasBeenSuggested = streamHasBeenSuggested ?
                                    'stream already suggested' :
                                    'stream not suggested';
                                $scope.$emit(ROME_TAGGING_EVENTS.stream.addAfterSuggestion, searchEventData,
                                    hasHotspot);
                            } else if (section === 'suggestion') {
                                taggingFrom = taggingSuggestionService.isTagSuggestionFromCrop() ?
                                    'suggestion_by_crop' :
                                    'suggestion_regular';

                                $scope.$emit(ROME_TAGGING_EVENTS.stream.addAfterSuggestion, searchEventData,
                                    hasHotspot);
                            }
                        }

                        $scope.media.forEach(function(media) {
                            $scope.$emit(ROME_TAGGING_EVENTS.stream.add, {
                                streamId: stream.id.toString(),
                                hasHotspot: hasHotspot,
                                taggingFrom: taggingFrom,
                                suggestionsActive: suggestionsActive,
                                mediaId: media.id.toString()
                            });
                        });

                        // Fill metadainformation for internal tracking tag event
                        metadataValue.push(
                            {
                                key: 'tagging_type',
                                value: taggingFrom
                            },
                            {
                                key: 'suggestion_order',
                                value: position ? position : '0'
                            }
                        );

                        if (filter.id) {
                            pushEntity(stream, metadataValue);
                        } else {
                            filter.then(pushEntity);
                        }
                    };

                    /**
                     * @name remove
                     *
                     * @description
                     * Remove a item from the entities array and trigger the itemRemoved callback
                     *
                     * @param {Object}  entity The entity object
                     * @param {Integer} $index The index of the array to be removed
                     * @param {Boolean} byID   Optional. If this is true, the index
                     *                         parameter will be ignored and the
                     *                         function will retrieve it using the
                     *                         ID property of the entity
                     */
                    $scope.remove = function(entity, $index, byID) {
                        if (byID) {
                            $scope.entities.some(function(item, idx) {
                                if (Number(item.id) === entity.id) {
                                    $index = idx;
                                    return true;
                                }
                            });
                        }
                        $scope.entities.splice($index, 1);
                        settings.callbacks.itemRemoved(entity, $scope);

                        //remove the annotation linked to the entity if it exists from the managed annotation list
                        modalMediaAnnotationService.removeAnnotation(entity.id);
                        entity.annotation = undefined;
                    };

                    //When an annotation hotspot is removed by using the hotspot remove button. We must also
                    //Remove the linked entity (Stream)
                    var removeListener = modalMediaAnnotationService.onRemoveAnnotation(function(annotation) {
                        if (annotation.externalId) {
                            $scope.remove({
                                id: annotation.externalId,
                                annotation: {
                                    persitedEntityID: annotation.persitedEntityID
                                }
                            }, null, true);
                        }
                    });

                    element.on('$destroy', function() {
                        removeListener();
                        // remove the callback for the annotation search input
                        annotationCallbackCanceler();
                    });

                    /**
                     * @name hover
                     *
                     * @description
                     * If zoomOnHover is enabled, we trigger callbacks for the mousein and mouseout
                     * on the searched items
                     *
                     * @param {String} action The action [in, out]
                     * @param {Object} item The entity object
                     */
                    var supported = {
                        in: settings.callbacks.resultItemOnHover,
                        out: settings.callbacks.resultItemOnOut
                    };
                    $scope.hover = function(action, item) {
                        if ($scope.bind.zoomOnHover) {
                            return supported[action](item);
                        }
                    };

                    /**
                     * @name sliderScrollSize
                     *
                     * @description
                     * Dynamic scroll width for the overflow:scroll, 251 is the width of each
                     * element inside the slider, is not responsive
                     *
                     * @return {Boolean}
                     */
                    $scope.sliderScrollSize = function() {
                        return (angular.isDefined($scope.entities)) ? $scope.entities.length * 251 : 0;
                    };
                }
            });
        };

        return {
            restrict: 'E',
            link: controller,
            scope: {
                entities: '=streams',
                media: '=',
                isSuggestionAvailable: '=',
                isSuggestionFromCropAvailable: '='
            },
            template: '<ng-include src="templateUrl">'
        };
    }
])

.directive('opFocus', function($timeout) {
    return {
        restrict: 'AC',
        link: function($scope, $element) {
            $timeout(function() {
                $element[0].focus();
            }, 0);
        }
    };
})

.directive('opTaggingTooltip', function() {
    /**
     * Add a tooltip only if it's needed
     */
    var controller = function(scope, element, attrs) {
        scope.text = attrs.text;
        scope.position = attrs.position || 'right';

        var isLonger = (scope.text.length > attrs.textLimit);
        scope.filter_tooltip = isLonger ? scope.text : '';
        if (isLonger) {
            scope.text = scope.text.substr(0, attrs.textLimit) + '...';
        }
    };

    return {
        restrict: 'E',
        replace: true,
        scope: {},
        link: controller,
        template: '<em tooltip-placement="{{position}}" tooltip="{{filter_tooltip}}">{{text}}</em>'
    };
});
