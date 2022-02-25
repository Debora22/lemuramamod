'use strict';

/**
 * @ngdoc object
 * @name op.tagging
 * @description
 *
 * This is the main script for this module, only init the module
 *
 */
angular
    .module('op.tagging', ['ui.sortable', 'op.modal'])
    .constant('ROME_TAGGING_EVENTS', {
        stream: {
            add: 'rome:tagging:stream:add',
            addAfterSuggestion: 'rome:tagging:stream:addAfterSuggestion',
            position: 'rome:tagging:stream:position'
        },
        suggestions: {
            available: 'rome:tagging:suggestions:available',
            unavailable: 'rome:tagging:suggestions:unavailable'
        }
    });
