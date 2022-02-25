'use strict';

angular
    .module('tagging', [])
    .config(function($routeProvider, AUTH_SCOPES, AUTH_EVENTS) {
        $routeProvider
            .when('/tagging', {
                templateUrl: 'modules/tagging/statics/partials/tagging.html',
                controller: 'TaggingController',
                data:{
                    authScopes: [AUTH_SCOPES.tagging]
                },
                resolve: {
                    customerSelected : ['authService', '$q', function(authService, $q) {
                        return authService.isSessionReady().then(function() {
                            if (!authService.isAuthenticated()){
                                return $q.reject(AUTH_EVENTS.notAuthenticated);
                            } else if (!authService.isAuthorized(AUTH_SCOPES.tagging)) {
                                return $q.reject(AUTH_EVENTS.notAuthorized);
                            }
                        });
                    }]
                }
            });
    });
