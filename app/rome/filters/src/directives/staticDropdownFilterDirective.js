'use strict';
angular
.module('op.filters')
.directive('opStaticDropdownFilter', [function() {
    var controller = function(scope) {
        var settings = scope.settings;

        scope.templateUrl = (settings.templateUrl !== '') ?
             settings.templateUrl :
             settings.templatePath + 'src/statics/partials/static-dropdown.html';

        scope.items = settings.data;
        scope.disabled = false;

        scope.position = settings.position;

        if (angular.isDefined(settings.initialValue)) {
            scope.itemSelected = settings.initialValue;
        } else {
            scope.itemSelected = scope.items[0];
        }

        scope.label = settings.label;

        scope.onChange = function(item) {
            scope.itemSelected = item;
            settings.callbacks.onChange.apply(settings.actions, [item]);
        };

        settings.actions.clear = function(index) {
            scope.itemSelected = scope.items[index || 0];
            settings.callbacks.onChange.apply(settings.actions, [scope.itemSelected]);
        };

        settings.actions.addFilter = function(q, key, value) {
            q.filter = q.filter || [];
            var statusFilter = q.filter.indexOf(q.filter.filter(function(f) {
                return Object.keys(f)[0] === key;
            })[0]);
            if (statusFilter !== -1) {
                q.filter[statusFilter][key] = value;
            } else {
                var filter = {};
                filter[key] = value;
                q.filter.push(filter);
            }
        };

        settings.actions.getSelectedItem = function() {
            return scope.itemSelected;
        };

        settings.actions.setDisabled = function(disabled) {
            scope.disabled = disabled;
        };
    };
    return {
        restrict: 'E',
        replace: true,
        scope: {
            settings: '='
        },
        link: controller,
        template: '<div class="sidebar-item" ng-style="{order: position}">' +
            '<op-include-replace src="templateUrl"/></div>'
    };
}]);
