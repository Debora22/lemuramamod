'use strict';

/**
 * @ngdoc directive
 * @name op.autocomplete.opAutocomplete
 * @restrict E
 *
 * @description
 * This directive binds a attribute 'op-autocomplete'
 */
angular
    .module('op.autocomplete')
    .directive('opAutocomplete', function($compile) {
        var link = function link(scope, element) {
            element.removeAttr('op-autocomplete');

            var stopWatch = scope.$watch('opAutocomplete', function(autocompleteService) {
                scope = scope.$parent;
                if (angular.isUndefined(autocompleteService)) {
                    $compile(element)(scope);
                    return;
                }
                stopWatch();

                var templateUrl;
                if (angular.isDefined(autocompleteService.templateUrl)) {
                    templateUrl = autocompleteService.templateUrl;
                } else {
                    templateUrl = autocompleteService.templatePath +
                        'src/statics/partials/autocomplete.html';
                }

                autocompleteService.getItems = function(term) {
                    return autocompleteService.callbacks.getData(term).then(function(data) {
                        var formatted = [];
                        autocompleteService.callbacks.formatData(data,
                            function(type, title, rawItem) {
                                formatted.push({
                                    type: type,
                                    title: title,
                                    _raw: rawItem,
                                    _classes: ['icon-' + type]
                                });
                            }
                        );
                        return formatted;
                    });
                };

                element.attr('ng-model', element.attr('ng-model') || 'autocomplete.selected');
                element.attr('uib-typeahead',
                    'item as item.title for item in autocomplete.getItems($viewValue)'
                );
                element.attr('typeahead-min-length', autocompleteService.minumumTermLength);
                element.attr('typeahead-template-url', templateUrl);
                element.attr('typeahead-wait-ms', 150);
                element.attr('typeahead-on-select',
                    'autocomplete.callbacks.onSelect($item, $model, $label)'
                );

                scope.autocomplete = autocompleteService;
                $compile(element)(scope);
            });
        };
        return {
            restrict: 'A',
            scope: {
                opAutocomplete: '='
            },
            link: link,
            // explanation why terminal and priority is needed in here:
            // http://stackoverflow.com/a/19228302/1860006
            terminal: true,
            priority: 1000
        };
    });
