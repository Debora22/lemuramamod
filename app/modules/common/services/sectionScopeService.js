'use strict';

/**
 * @ngdoc service
 * @name sectionScopeService
 * @description This service allow to define the sections available in LemuramaModsquad in one place
 * and export its data.
 */

angular
.module('common')
.service('sectionScopeService', [
    'AUTH_SCOPES',
    function(
        AUTH_SCOPES
    ) {
        var sectionScopeData = [{
            name: 'MENU_ITEM_EXPRESS_MODERATOR',
            href: '#/expressmoderation',
            scope: AUTH_SCOPES.premod,
            implementationValue: 'expressmoderation'
        },
        {
            name: 'MENU_ITEM_TAGGING',
            href: '#/tagging',
            scope: AUTH_SCOPES.tagging,
            implementationValue: 'tagging'
        },
        {
            name: 'MENU_ITEM_MODERATION',
            href: '#/moderation',
            scope: AUTH_SCOPES.moderation,
            implementationValue: 'moderation'
        },
        {
            name: 'MENU_ITEM_QA',
            href: '#/qa',
            scope: AUTH_SCOPES.qa,
            implementationValue: 'qa'
        }];

        this.getSectionValues = function() {
            return sectionScopeData;
        };
    }]);
