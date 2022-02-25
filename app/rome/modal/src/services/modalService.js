'use strict';

/**
 * @ngdoc service
 * @name op.modal.modalService
 * @param {object} custom settings
 * @return {object} a new instance of Modal
 * @description
 *
 * This service is used to create a instance of the Modal.
 *
 */
angular
    .module('op.modal')
    .service('modalService', ['modalToolService', function(ModalToolService){

        var tools = new ModalToolService();

        /**
         * @description
         * Default settings
         *
         * The supported options are:
         *
         * template {String}
         * templatePath {String}
         * templateUrl {String}
         * fullscreen {Boolean}
         * size {String}
         * navigation {Boolean}
         * zoom {Boolean}
         * showTabs {Boolean}
         * enableAnnotations.status {Boolean}
         * extras {Array}
         * extras.title {String}
         * extras.role {String}
         * extras.directive {String}
         * extras.scope {Object}
         * extras.before {Function}
         * extras.after {Function}
         * directives {Array}
         * directives.selector {String}
         * directives.directive {String}
         * directives.scope {Object}
         * translate {Object}
         * actions {Object}
         * actions:open {Function}
         * actions:close {Function}
         * actions:navigation {Function}
         * actions.setTitle {Function}
         * actions.next {Function}
         * actions.prev {Function}
         * actions.isOpen {Function}
         * callbacks:afterOpen {Function}
         * callbacks:afterClose {Function}
         * callbacks.afterMove {Function}
         * callbacks.afterRemovingItem {Function}
         * preview {Object}
         * preview.update {Function}
         * preview.show {Function}
         * preview.hide {Function}
         */
        var defaultSettings = {
            template: 'media',
            templatePath: '',
            templateUrl: false,
            fullscreen: true,
            size: 'medium',
            navigation: true,
            zoom: false,
            showTabs: true,
            extras: [],
            directives: [],
            translate: null,
            enableAnnotations: {
                status: false
            },
            annotationSearchTooltip: true,
            actions: {
                open: function(){},
                close: function(){},
                navigation: function(){},
                setTitle: function(){},
                next: function(){},
                prev: function(){},
                isOpen: function(){}
            },
            callbacks: {
                afterOpen: function(){},
                afterClose: function(){},
                afterMove: function(){},
                afterRemovingItem: function(){}
            },
            preview: {
                update: function(){},
                show: function(){},
                hide: function(){}
            }
        };

        /**
         * @description
         * Merge defaults settings with custom settings
         *
         * @param  {Object} settings Custom settings
         * @return {Object}
         */
        return function(settings){
            return tools.extend(angular.copy(defaultSettings), settings);
        };

    }]);
