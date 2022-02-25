'use strict';

angular
    .module('expressModeration', [])
    .config(function ($routeProvider, AUTH_SCOPES, AUTH_EVENTS) {
        $routeProvider
            .when('/expressmoderation', {
                templateUrl: 'modules/expressmoderation/statics/partials/expressModeration.html',
                controller: 'expressModerationController',
                data: {
                    authScopes: [AUTH_SCOPES.premod]
                },
                resolve: {
                    customerSelected : ['authService', '$q', function(authService, $q) {
                        return authService.isSessionReady().then(function() {
                            if (!authService.isAuthenticated()){
                                return $q.reject(AUTH_EVENTS.notAuthenticated);
                            } else if (!authService.isAuthorized(AUTH_SCOPES.premod)) {
                                return $q.reject(AUTH_EVENTS.notAuthorized);
                            }
                        });
                    }]
                }
            });
    });
