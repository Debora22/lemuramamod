'use strict';

/**
 * @ngdoc service
 * @name op.box.boxService
 * @param {object} custom settings
 * @return {object} a new instance of Box
 * @description
 *
 * This service is used for create an instance of Box.
 * Extend the settings and return an new instance.
 *
 */
angular
    .module('op.box')
    .service('boxService', ['boxToolsService', function(BoxToolsService){

        var tools = new BoxToolsService();

        /**
         * Default settings
         *
         * The supported options are:
         *
         * type {string}
         * carousel {array | function}
         * headerActions {object}
         * templatePath {string}
         * templateUrl {string}
         * translate {object}
         * callbacks:afterRender {function}
         * callbacks:photoClick {function}
         * callbacks:checkboxChange {function}
         * callbacks:afterCarouselPhotoClick {function}
         */
        var defaultSettings = {
            type: 'media',
            carousel: false,
            headerActions: {},
            templatePath: '',
            templateUrl: false,
            showCheckbox: true,
            translate: null,
            callbacks: {
                afterRender: function(){},
                afterPhotoClick: function(){},
                afterCheckboxChange: function(){},
                afterCarouselPhotoClick: function(){}
            }
        };

        /*
         * Merge defaultSettings and custom settings
         * @return {object}
         */
        return function(settings){
            return tools.extend(angular.copy(defaultSettings), settings);
        };

    }]);
