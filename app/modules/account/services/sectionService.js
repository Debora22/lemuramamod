'use strict';

angular
.module('account')
.service('sectionService', [
    '$localStorage',
    'authService',
    'sectionScopeService',
    'scopeAuthService',
    function(
        $storage,
        authService,
        sectionScopeService,
        scopeAuthService
    ) {
        var currentSection = null;
        var getKey = function(credential) {
            return 'lastSection_' + credential.customer.id;
        };

        this.last = function() {
            var credential = authService.getSessionMetadata();
            var path = '/';
            if (credential && credential.customer && $storage[getKey(credential)]) {
                path = $storage[getKey(credential)];
            }
            return path;
        };

        this.in = function(section) {
            authService.isSessionReady().then(function() {
                var credential = authService.getSessionMetadata();
                if (credential && credential.customer) {
                    currentSection = section;
                    $storage[getKey(credential)] = section;
                }
            });
        };

        this.current = function() {
            return currentSection;
        };

        /**
        * @name getname
        * @returns get the display name of the section
        */
        this.getName = function() {
            return (currentSection === 'expressmoderation') ? 'premod' : currentSection;
        };

        /**
        * @name getValidSection
        *
        * @description Get the valid section according the current user scopes and the last section saved
        * for this user.
        *
        * @return {String} Last section saved for the user or the first section available.
        */
        this.getValidSection = function() {
            // Get customer credential from the customer selected
            var customerCredential = authService.getSessionMetadata();
            // Get user scope from the customer credentials.
            var userScopes = scopeAuthService.getScopesFromCredential(customerCredential);
            var validSection = {};

            //Fill the validSection for the user accoriding its scopes for the current customer and all the app scopes.
            sectionScopeService.getSectionValues().forEach(function(section) {
                userScopes.some(function(userScope) {
                    if (section.scope === userScope) {
                        validSection[section.implementationValue] = section.implementationValue;
                        return true;
                    }
                });
            });
            return validSection[this.last()] || Object.keys(validSection)[0];
        };
    }
]);
