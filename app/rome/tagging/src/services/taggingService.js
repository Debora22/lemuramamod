'use strict';

/**
 * @ngdoc service
 * @name op.tagging.taggingService
 * @param {Object} Custom Settings
 * @return {Object} New instance of the tagging
 * @description
 *
 * This service is used for create a new instance of tagging
 */
angular
    .module('op.tagging')
    .service('taggingService', ['taggingToolService', function(TaggingToolService){

        var tools = new TaggingToolService();

        /**
         * Default Settings
         *
         * The supported settings are:
         *
         * templatePath {String} The path of the template file
         * searchLimit {Integer} The number of results per search
         * zoomOnHover {Boolean} Set if the zoom on the results items will be enabled or disabled by default
         * sorting {Boolean} Set whether the drag and drop sort it's enabled or not.
         * callbacks.loadContent {Function} Search the content
         * callbacks.emptyField {Function} The user has emptied the search field.
         * callbacks.filterItemToAdd {Function} A callback function that can be used to filter some of the properties of the items that it's going to be added. It supports a Promise as a return value
         * callbacks.itemAdded {Function} Callback for when a item is added
         * callbacks.itemAdded {Function} Callback for when a item is added
         * callbacks.itemRemoved {Function} Callback for when an annotation is removed
         * callbacks.resultItemOnHover {Function} Callback on hover item as parameter we pass the entity
         * callbacks.resultItemOnOut {Function} Callback on out item as parameter we pass the entity
         * callbacks.saveSorting {Function} This is called after the entities order is changed.
         *
         */
        var defaultSettings = {
            templatePath: '',
            searchLimit: 15,
            zoomOnHover: false,
            sorting: false,
            callbacks: {
                loadContent: function(){},
                emptyField: function(){},
                loadMoreContent: function(){},
                filterItemToAdd: function(item){ return item; },
                itemAdded: function(){},
                itemRemoved: function(){},
                resultItemOnHover: function(){},
                resultItemOnOut: function(){},
                saveSorting: function(){}
            }
        };

        /**
         * Merge defaultSettings with the implementation settings
         *
         * @return {Object}
         */
        return function(settings){
            return tools.extend(angular.copy(defaultSettings), settings);
        };

    }]);
