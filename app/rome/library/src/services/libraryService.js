'use strict';

angular
    .module('op.library')
    /**
     * @ngdoc service
     * @name op.libraryService
     * @param {object} custom settings
     * @return {object} a new instance of Library
     *
     * @description
     * This service is used for create an instance of Library.
     * Extend the settings and return an new instance.
     */
    .service('libraryService', function(){

        /**
         * extend
         * @param  {object} dst settings
         * @return {object} [description]
         */
        var extend = function(dst) {
            angular.forEach(arguments, function(obj) {
                if (obj !== dst) {
                    angular.forEach(obj, function(value, key) {
                        if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                            extend(dst[key], value);
                        } else {
                            dst[key] = value;
                        }
                    });
                }
            });
            return dst;
        };

        /**
         * Default settings
         *
         * The supported options are:
         *
         * entityView {Service} The responsible to draw the data
         * template {string} The template content
         * templateUrl {string}
         * templatePath {string} The template (partials) url path
         * inifinteScroll {boolean} Use infinite scroll to query new elements
         * useKeys {boolean} Une keys to navigate in the library
         *
         * actions:clear {funcion} Clear the content in the library
         * actions:loadMore {funcion} Load more content
         * actions:fill {funcion}(Entity|Array) Clear and fill the library with these data.
         * actions:item:push {function}{Entity} Push new entity to the entities array
         * actions:item:pop {function}{Entity} Remove an entity from the list
         * actions:item:update {function}{String, Entity} Update an entity
         * actions:items {function}{} Return a list of actual entities in library
         *
         * callbacks:loading:start {function} The library started to load
         * callbacks:loading:end {function} The library ended to load
         * callbacks:loadContent {function} Provide content to the library
         * callbacks:afterAppendContent {function} Triggered after append new elements
         */
        var defaultSettings = {
            entityView: undefined,
            template : '',
            templateUrl : '',
            templatePath: '',
            inifinteScroll : true,
            useKeys : false,
            actions : {
                clear : function(){},
                fill : function(){},
                loadMore : function(){},
                item: {
                    push: function(){},
                    pop: function(){},
                    update: function(){}
                },
                items: function(){}
            },
            callbacks: {
                loading : {
                    start : function(){},
                    end : function(){}
                },
                loadContent : function(){},
                afterAppendContent : function(){}
            }
        };

        return function(settings){
            return extend(angular.copy(defaultSettings), settings);
        };
    });
