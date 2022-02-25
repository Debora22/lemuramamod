'use strict';

angular
    .module('moderation', [])
    .config(function($routeProvider, AUTH_SCOPES, AUTH_EVENTS) {
        $routeProvider
            .when('/moderation', {
                templateUrl: 'modules/moderation/statics/partials/moderation.html',
                controller: 'moderationController',
                data: {
                    authScopes: [AUTH_SCOPES.moderation]
                },
                resolve: {
                    customerSelected : ['authService', '$q', function(authService, $q) {
                        return authService.isSessionReady().then(function() {
                            if (!authService.isAuthenticated()){
                                return $q.reject(AUTH_EVENTS.notAuthenticated);
                            } else if (!authService.isAuthorized(AUTH_SCOPES.moderation)) {
                                return $q.reject(AUTH_EVENTS.notAuthorized);
                            }
                        });
                    }]
                }
            });
    });
