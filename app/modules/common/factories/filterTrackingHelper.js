'use strict';

angular
.module('common')
.factory('filterTrackingHelper', [
    '$rootScope',
    'EXTERNAL_TRACKING_EVENTS',
    function(
        $rootScope,
        EXTERNAL_TRACKING_EVENTS
    ) {
        var exports = {};

        var filtersPreviosReport = [];

        var filtersToTrackValuesUsage = [
            'media_type',
            'rights',
            'source',
            'source_group',
            'with_labels',
            'without_labels',
            'rights_programmatic',
        ];

        var filtersToNotTrack = [
            'status_id'
        ];

        var shouldReportFilterValue = function (filter_key) {
            return filtersToTrackValuesUsage.indexOf(filter_key) !== -1;
        };

        var shouldTrackFilter = function (filter_key) {
            return filtersToNotTrack.indexOf(filter_key) === -1;
        };

        var formatFilterEventAction = function (filter_key, filter_value) {
            var sufix = '';
            if (shouldReportFilterValue(filter_key)) {
                sufix = '_';
                switch(filter_key){
                    case 'rights_programmatic':
                        sufix += filter_value === 'true' ? 'yes' : 'no';
                        break;
                    default:
                        sufix += filter_value.toLowerCase().replace(/-/g, '_');
                }
            }
            return filter_key + sufix;
        };

        var getAppliedFiltersName = function(filters) {
            var filtersName = [];
            angular.forEach(filters, function(filter, key) {
                if (!shouldTrackFilter(key)) {
                    return;
                }
                if(shouldReportFilterValue(key)){
                    angular.forEach(filter.values, function(value){
                        filtersName.push(formatFilterEventAction(key, value));
                    });
                }else{
                    filtersName.push(key);
                }
            });
            return filtersName;
        };

        exports.filterApplied = function(filters) {
            var filtersName = getAppliedFiltersName(filters);
            angular.forEach(filtersName, function(filterName){
                if (filtersPreviosReport.indexOf(filterName) === -1) {
                    $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.filters.hit, filterName);
                    filtersPreviosReport.push(filterName);
                }
            });
            //Remove disabled filters to be able to report them later again.
            angular.forEach(filtersPreviosReport, function(filterName){
                if (filtersName.indexOf(filterName) === -1) {
                    filtersPreviosReport.splice(filtersPreviosReport.indexOf(filterName), 1);
                }
            });
        };

        exports.mediaActionExecuted = function(action, count) {
            if(filtersPreviosReport.length === 0){
                return;
            }        
            $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.filters.mediaAction, {
                name: 'media_' + action.toLowerCase().replace(/ /g, '_'),
                filters: filtersPreviosReport.join(','),
                value: count
            });
        };

        exports.clear = function() {
            filtersPreviosReport = [];
        };
        
        return exports;
    }
]);