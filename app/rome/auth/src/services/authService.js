'use strict';

/**
 * @ngdoc service
 * @name op.auth.authService
 * @description
 * The service provides Authentication and Authorization features for the App.
 * The Authentication is based on the login data that is stored to retrieve in any part of
 * the app.
 * The Authorization is based on Scopes and you need to apply for that scope.
 */
angular
.module('op.auth')
.service('authService', [
    '$rootScope',
    '$q',
    '$timeout',
    '$log',
    '$location',
    'authServerAPIService',
    'scopeAuthService',
    'RESPONSE_CODES',
    'AUTH_SCOPES',
    'AUTH_EVENTS',
    'appConstant',
    function(
        $rootScope,
        $q,
        $timeout,
        $log,
        $location,
        authServerAPIService,
        scopeAuthService,
        responseCodes,
        AUTH_SCOPES,
        AUTH_EVENTS,
        appConstant
    ) {

        // To prevent ssoClient being accessed outside this service:
        var ssoClient = window.olapicSSOClient;
        delete window.olapicSSOClient;

        // Yes i know, but it's the best way to parse a URl in a browser
        var urlParser = document.createElement('a');
        urlParser.href = $location.absUrl();

        ssoClient.setConfig({
          client: 'Lemurama',
          accountSelection: true,
          accountScope: 'modsquad',
          accountPermissionScopes: Object.values(AUTH_SCOPES),
          callback: authServerAPIService.getLoginCallbackPath(urlParser.origin)
        });
        ssoClient.setClientConfig({
          api: {
            url: appConstant.sso.url
          }
        });

        var storage = {data: {}};

        var storeSession = function(data) {
            storage.data = data;
        };

        var getStoredSession = function() {
            return storage.data;
        };

        var failedRefreshSessionCount = 0;
        var refreshSession = function() {
            return authServerAPIService.getCurrentSession()
            .then(function(result) {
                storeSession(result.data);
                intercomSetup(result.data);
                return result.data;
            })
            .catch(function(e) {
                // try 30 times to load the session
                if (++failedRefreshSessionCount < 30) {
                    return $timeout(refreshSession, 500);
                } else {
                    return $q.reject(e);
                }
            });
        };

        var promise = refreshSession();

        var intercomSetup = function(session) {
            if (!appConstant.intercom.enabled) {
                return $q.when(session);
            }
            var user = session.user;
            var settings = angular.copy({
                app_id: appConstant.intercom.data.appID,
                hide_default_launcher: !appConstant.intercom.showIconChat,
                name: user.name,
                email: user.email,
                created_at: Math.round((new Date()).getTime() / 1000),
                user_id: user.id,
                company: {
                    id: appConstant.intercom.data.company.ID,
                    name: appConstant.intercom.data.company.name,
                    created_at: Math.round((new Date()).getTime() / 1000)
                }
            });
            window.Intercom('boot', settings);

            // TODO i wasn't able to capture intercom API errors :shrug:
            return $q.when(session);
        };

        var authenticateCallback = function(result) {
            var sessionMetadata = {
                user: {
                    email: result.user.email,
                    name: result.user.name,
                    id: result.user.id
                },
                customer: {
                    id: result.account.id,
                    name: result.account.name,
                    settings: result.account.settings
                },
                tokeninfo: {
                    scope: Object.keys(result.account.permissions)
                }
            };

            return authServerAPIService.login(angular.copy(sessionMetadata), result.token)
            .then(function() {
                storeSession(sessionMetadata);
                return sessionMetadata;
            });
        };

        var ssoAuthenticationWrapper = function() {
            var appSession = ssoClient.get('appSession');
            if (appSession.canCreate()) {
                return appSession.create()
                .catch(function() {
                    // error autheticating the cookie, returning original promise (it will redirect to sso/login)
                    return ssoClient.authenticate();
                });
            } else {
                // cookie not set, returning original promise (it will redirect to sso/login)
                return ssoClient.authenticate();
            }
        };

        // Public Methods

        var exports = {};

        exports.authenticate = function() {
            return ssoAuthenticationWrapper()
            .then(authenticateCallback)
            .then(intercomSetup)
            .then(function(result) {
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                $rootScope.$broadcast(AUTH_EVENTS.accountChange);
                return result;
            })
            .catch(function(err) {
                $log.error(err);
                $location.path('/logout');
            });
        };

        exports.switchAccount = function(){
            authServerAPIService.logout()
            .then(function() {
                storeSession({});
                return ssoClient.switchAccount();
            })
            .catch(function(err) {
                $log.error(err);
                $location.path('/logout');
            });
        };

        /**
         * @name isSessionReady
         * @description Resolves the promise that retuns when the session is ready
         * @returns  {Promise} resolved when the session is ready
         */
        exports.isSessionReady = function() {
            return $q.all([promise]).then(function(result) {
                return angular.copy(result[0]);
            });
        };

        /**
         * @name isAuthenticated
         * @description Return true if the user is Authenticated, false otherwise.
         * @returns {Boolean}
         */
        exports.isAuthenticated = function() {
            return !!getStoredSession().customer;
        };

        /**
         * @name isAuthorized
         * @description Return the authorization token for the given scopes. If the user is not
         * authorized for that scope returns an empty string. All the scopes are defined in the `AUTH_SCOPES` service.
         * @example Role: AUTH_SCOPE.curation
         * @param {AUTH_SCOPE} Single or array scope to Authorize
         * @return {String} Token to use or an empty String if the user is not authorized
         */
        exports.isAuthorized = function(scopeToAuthorize) {
            var _this = this;
            var isAuthorized = false;

            // Do not authorize if the user is not authenticated
            if (_this.isAuthenticated()) {
                // If the scopeToAuthorize is empty, allow it
                if (scopeToAuthorize === '') {
                    isAuthorized = true;
                } else {
                    // Delegate the user auth to the role
                    isAuthorized = scopeAuthService.validate(getStoredSession(), scopeToAuthorize);
                }
            }

            return isAuthorized;
        };

        /**
         * @name getScopes
         * @description Return an array with all the available scopes for the customer.
         * They are unique and could be for any customer.
         */
        exports.getScopes = function() {
            var scopes = [];

            // No roles for non logged users
            if (this.isAuthenticated()) {
                scopes = scopeAuthService.getScopesFromCredential(getStoredSession());
            }

            return angular.copy(scopes);
        };

        /**
         * @name logout
         * @description Destroy/End the session, alias: Logout the user.
         */
        exports.logout = function() {
            return $q.all([
                ssoClient.signout(),
                authServerAPIService.logout()
            ]).then(function() {
                storeSession({});
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
            });
        };

        /**
         * @name getSessionMetadata
         * @description Returns the selected credential
         */
        exports.getSessionMetadata = function() {
            return getStoredSession();
        };

        return exports;

    }]);
