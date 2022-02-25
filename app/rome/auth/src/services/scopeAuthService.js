'use strict';

/**
 * @ngdoc service
 * @name op.auth.scopeAuthService
 *
 * @description
 * The service is in charge of authenticate the scope with a given set of
 * credentials.
 */
angular
    .module('op.auth')
    .service('scopeAuthService', function() {

        var exports = {};

        /**
         * @name validate
         *
         * @description
         * Determines if the user credentials are authorized to use the given role.
         * @param  {Object} credentials
         * @param  {AUTH_SCOPES} roleToValidate
         * @return {String} Token to use, Empty String otherwise
         */
        exports.validate = function(credentials, scopeToValidate) {
            var isValid = false;

            if (typeof scopeToValidate === 'string') {
                if (this.getScopesFromCredential(credentials).indexOf(scopeToValidate) !== -1) {
                    isValid = true;
                }
            } else {
                for (var i = 0; i < scopeToValidate.length; i++) {
                    if (this.getScopesFromCredential(credentials).indexOf(scopeToValidate[i]) !== -1) {
                        isValid = true;
                        break;
                    }
                }
            }
            return isValid;
        };

        /**
         * @name getScopesFromCredential
         *
         * @description
         * Parse the scope from the token_info to return the list of valid scopes.
         * @param {Object} credential
         * @return {Array} scope list
         */
        exports.getScopesFromCredential = function(credential) {
            var scopes = [];
            if (angular.isDefined(credential) && angular.isDefined(credential.tokeninfo)) {
                scopes = credential.tokeninfo.scope;
            }
            return scopes;
        };

        return exports;
    });
