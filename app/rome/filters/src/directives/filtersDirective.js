'use strict';

/**
 * @ngdoc directive
 * @name op.filters.opFilters
 * @restrict E
 *
 * @description
 * This directive binds a tag '<op-filters><'
 */
angular
    .module('op.filters')
    .directive('opFilters', [function() {
        var rightsKey = 'rights';
        var rightsWhitelistedName = 'rights_whitelisted';
        var init = function(scope, settings) {

            /**
             * This function will be used to validate there is at least one filter in the list
             * excluding default filters, the status_id and lemurama_qa_finish metadata
             */
            var excludeDefaultFilters = function(item) {
                return item !== 'status_id' && item !== 'lemurama_qa_finish';
            };

            scope.isLoading = settings.isLoading;
            /*
             * Decide if use the default themplate or a custom template.
             * If use the default template, add a custom template path
             */
            if (settings.templateUrl !== '') {
                scope.templateUrl = settings.templateUrl;
            } else {
                scope.templateUrl = settings.templatePath + 'src/statics/partials/filters.html';
            }

            /**
             * @name mark
             *
             * @description
             * Set or create the property selected in true/false, this method is used in the front
             * to showwhat filter was applied
             *
             * @param {object} filters Filter list
             * @param {string} key filter parent ex: user
             * @param {string} value filter to apply ex: loverajoel
             */
            var mark = function(filters, key, value) {
                if (filters[key]) {
                    filters[key].values.map(function(item) {
                        if (value === item.name) {
                            item.selected = angular.isDefined(item.selected) ? !item.selected : true;
                        }
                    });
                }
            };

            /**
             * @name triggerFilter
             *
             * @description
             * This method is in charge to add or remove a filter, according to if it wasn't
             * applied yet.
             *
             * @param {object} filters Filter list
             * @param {string} key filter parent ex: user
             * @param {string} value filter to apply ex: loverajoel
             */
            var triggerFilter = function(filters, key, value, options) {
                options = options || {};
                var intFilers = angular.copy(filters);
                var filter = intFilers[key] ? intFilers[key] : {values: []};
                if (options.replace) {
                    filter.values = [value];
                    intFilers[key] = filter;
                } else {
                    var index = filter.values.indexOf(value);
                    if (index > -1) {
                        filter.values.splice(index, 1);
                    } else {
                        filter.values.push(value);
                        // Search item to add
                        var item = scope.filters[key].values.filter(function(item) {
                            if (value === item.name) {
                                return item;
                            }
                        });
                        var newItem = angular.isObject(item[0]) ? item[0] : { name: value };
                        if (options.label) {
                            newItem.label = options.label;
                        }
                    }
                    if (filter.values.length) {
                        filter.condition = 'and';
                        intFilers[key] = filter;
                    } else {
                        delete intFilers[key];
                    }
                }
                return intFilers;
            };

            /**
             * @name addRightsWhitelistedFilter
             *
             * @description
             * Add the Rights Whitelisted filter only if the rights given filter exists
             *
             * @param {Array} aggregations  the aggregations information
             *
             * @return {Array}
             */
            var addRightsWhitelistedFilter = function(aggregations) {
                var rightsAgg;

                aggregations.forEach(function(agg) {
                    if (agg.key === rightsKey) {
                        var isRightGivenOption = agg.values.some(function(value) {
                            return value.name === 'GIVEN';
                        });

                        if (isRightGivenOption) {
                            rightsAgg = agg;
                        }
                    }
                });

                if (rightsAgg) {
                    rightsAgg.values.push({
                        name: rightsWhitelistedName,
                        total: 0,
                        label: 'Rights Whitelisted',
                        selected: angular.isObject(settings.query.filters.rights_whitelisted)
                    });
                }

                return aggregations;
            };

            /**
             * @name applyFilter
             *
             * @description
             * This method is trigger by the filters item from the DOM. Call anothers methods and
             * fire callbacks.
             *
             * @param {string} key filter parent ex: user
             * @param {string} value filter to apply ex: loverajoel
             */
            scope.applyFilter = function(key, value, options) {
                options = options || {};
                /*
                 * Whenever we select the Rights Whitelisted filter we will handle it
                 * differently as the normal aggregations
                 */
                if (key === rightsKey && value === rightsWhitelistedName) {
                    if (settings.query.filters.rights_whitelisted) {
                        delete settings.query.filters.rights_whitelisted;
                    } else {
                        settings.query.filters.rights_whitelisted = { values: true };
                    }
                } else {
                    settings.query.filters = triggerFilter(settings.query.filters, key, value, options);
                }
                mark(scope.filters, key, value);
                settings.callbacks.afterSearchPress(settings.query);
                settings.callbacks.onChange(settings.query, options.replace);
            };

            /**
             * @name actions.fill
             *
             * @description
             * fill filter with data
             *
             * @param {object} aggregations
             */
            settings.actions.fill = function(data) {
                // Check if we need to add the Rights Whitelisted filter
                var aggregations = addRightsWhitelistedFilter(data);

                scope.filtersOrdered = aggregations;

                // remove the current keys that this time didn't came on data
                var dataKeys = aggregations.map(function(filter) {
                    return filter.key;
                });
                Object.keys(scope.filters).forEach(function(key) {
                    if (dataKeys.indexOf(key) === -1) {
                        scope.filters[key].values = [];
                    }
                });

                aggregations.forEach(function(filter) {
                    var agg = settings.query.filters[filter.key];

                    // keep items selected
                    if (agg && angular.isArray(agg.values)) {
                        agg.values.forEach(function(item) {
                            filter.values.forEach(function(newItem) {
                                if (newItem.name === item) {
                                    newItem.selected = true;
                                }
                            });
                        });
                    }

                    scope.filters[filter.key] = filter;
                });

                scope.isLoading = false;

            };

            /**
             * @name actions.fillTotal
             *
             * @description
             * fill total label from ouside the directive
             *
             * @param {integer} total
             */
            settings.actions.fillTotal = function(total) {
                scope.total = angular.isNumber(total) ? total : 0;
            };

            /**
             * @name actions.clear
             *
             * @description
             * clear all data on the filters
             *
             * @param {object} aggregations
             */
            settings.actions.clear = function() {
                Object.keys(scope.filters).forEach(function(key) {
                    if (settings.query.filters[key]) {
                        delete settings.query.filters[key];
                    }
                    scope.filters[key].values.forEach(function(item) {
                        item.selected = false;
                    });
                });
            };

            /**
             * @name injectFilterConditionc
             *
             * @description
             * inject a filter condition from outside of the filter directive
             *
             * @param {string} *key* Agg, e.g: "Stream"
             * @param {string|integer} *value* Condition value, e.g: a stream.id
             * @param {Object} *options* options are: replace: {boolean}, label: {String}
             *
             */
            settings.actions.injectFilterCondition = function(key, value, options) {
                if (typeof options === 'boolean') {
                    // to be backward compatible with old parameter "replace"
                    options = {replace: options};
                }
                scope.applyFilter(key, value, options);
            };

            /**
             * @name replaceFilterCondition
             *
             * @description
             * Instead of appending the condition to an existing filter, it completly replaces the
             * filter with a new value.
             *
             * @param  {String}         key   The filter name, e.g.: 'Status'.
             * @param  {String|Integer} value The filter value, e.g.: 'PENDING'.
             */
            settings.actions.replaceFilterCondition = function(key, value) {
                scope.applyFilter(key, value, {replace: true});
            };

            /**
             * @name clearAll
             *
             * @description
             * This function is called from the default template
             *
             */
            scope.resetFilters = function() {
                settings.actions.clear();
                settings.query.staticFilters = {phrase: ''};

                Object.keys(settings.query.filters).filter(excludeDefaultFilters).forEach(function(item) {
                    delete settings.query.filters[item];
                });
                angular.forEach(settings.callbacks.afterClearAll, function(callback){
                    callback(settings.query);
                });
                settings.callbacks.onChange(settings.query);
            };

            /**
             * @name search
             *
             * @description
             * Make a new search keep all the filters
             */
            scope.search = function() {
                settings.callbacks.afterSearchPress(settings.query);
                settings.callbacks.onChange(settings.query);
            };

            scope.thereAreAppliedFilters = function() {
                return (settings.query.staticFilters.phrase.length ||
                    Object.keys(settings.query.filters).filter(excludeDefaultFilters).length > 0);
            };

            /**
             * @name normalizeIndexId
             *
             * @description
             * Return a DOM ID valid name.
             * Replace non-char character by - and lowercase the result.
             *
             * @param  {String} str   The string to normalize, eg 'Media Source'.
             *
             * @return  {String} value The normalize string, eg  'media-source'.
             */
            scope.normalizeIndexId = function(str) {
                return (str.replace(/[^\d\w.-]/g, '-')).toLocaleLowerCase();
            };

        };

        var link = function(scope) {
            var stopWatch = scope.$watch(function(scope) {
                return scope.settings;
            }, function(settings) {

                if (angular.isUndefined(settings) || angular.isUndefined(settings.itemsOrder)) {
                    return;
                }

                scope.tooltip = settings.tooltip;
                scope.total = 0;
                scope.showTotal = settings.showTotal;
                scope.filters = {};
                scope.filtersOrdered = [];
                scope.openFilters = {};
                scope.itemsOrder = settings.itemsOrder;
                scope.searchAutocomplete = settings.autocompleteService;
                scope.searchPlaceholder = settings.searchPlaceholder || '';

                stopWatch();
                init(scope, settings);
            });
        };
        var controller = ['$scope', function($scope) {

            this.resetFilters = function() {
                $scope.resetFilters();
            };

            this.onChange = function() {
                $scope.settings.callbacks.onChange($scope.settings.query);
            };

            this.getQuery = function() {
                return $scope.settings.query;
            };
        }];

        return {
            restrict: 'E',
            replace: true,
            scope: {
                settings: '=',
                loading: '='
            },
            link: link,
            controller: controller,
            transclude: true,
            // I've put the container in here because ng-transclude doesn't work inside a ng-include
            template: '<div class="sidebar-container" id="filters-container">' +
                '<op-transclude-replace></op-transclude-replace>' +
                '<op-include-replace src="templateUrl"></op-include-replace>' +
                '</div>'
        };
    }])

    .directive('opFiltersTooltip', function() {
        /**
         * Add a tooltip only if it's needed
         */
        var controller = function(scope, element, attrs) {
            scope.text = attrs.text;
            scope.position = attrs.position || 'right';
            if (attrs.textLimit === -1) {
                scope.filter_tooltip = scope.text;
            } else {
                scope.filter_tooltip = (scope.text.length > attrs.textLimit) ? scope.text : '';
            }
        };

        return {
            restrict: 'E',
            replace: true,
            scope: {},
            link: controller,
            template: '<em tooltip-placement="{{::position}}" tooltip="{{::filter_tooltip}}" ' +
                'tooltip-append-to-body="true">{{::text}}</em>'
        };
    });
