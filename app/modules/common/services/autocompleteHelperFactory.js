'use strict';

angular
.module('common')
.factory('AutocompleteHelperFactory', [ '$q', '$filter', 'autocompleteService', 'apiService',
    function ($q, $filter, AutocompleteService, apiService){
        return function() {

            var exports = {};

            var endpoints = {
                searchAutocomplete: 'suggestions/?phrase='
            };

            var getAutocompleteData = function(term) {
                return apiService.get(endpoints.searchAutocomplete + encodeURIComponent(term));
            };

            exports.onSelect = function(){
                exports.query.staticFilters.phrase = '';
            };

            exports.onSelectStream = function(){};

            exports.onSelectUser = function(){};

            exports.onSelectPlace = function(){};

            exports.onSelectHashtag = function(){};

            exports.service = new AutocompleteService({
                templatePath: 'rome/autocomplete/',
                minimunTermLength: 3,
                callbacks: {
                    getData: getAutocompleteData,
                    formatData: function(res, push) {
                        angular.forEach(res.data, function(item) {
                            push(item.type, item.name, item);
                        });
                    },
                    onSelect: function(selected) {
                        switch(selected.type) {
                            case 'stream': {
                                exports.onSelect();
                                exports.onSelectStream(selected._raw);
                                break;
                            }
                            case 'user': {
                                exports.onSelect();
                                exports.onSelectUser(selected._raw);
                                break;
                            }
                            case 'place':
                            case 'location': {
                                exports.onSelect();
                                exports.onSelectPlace(selected._raw);
                                break;
                            }
                            case 'hashtag': {
                                exports.onSelect();
                                exports.onSelectHashtag(selected._raw);
                                break;
                            }
                        }
                    }
                }
            });

            return exports;
        };
    }
]);
