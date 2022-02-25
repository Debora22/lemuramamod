'use strict';

angular
    .module('qa', [])
    .config(function($routeProvider, AUTH_SCOPES, AUTH_EVENTS) {
        $routeProvider
            .when('/qa', {
                templateUrl: 'modules/qa/statics/partials/qa.html',
                controller: 'qaController',
                data:{
                    authScopes: [AUTH_SCOPES.qa]
                },
                resolve: {
                    customerSelected : ['authService', '$q', function(authService, $q) {
                        return authService.isSessionReady().then(function() {
                            if (!authService.isAuthenticated()){
                                return $q.reject(AUTH_EVENTS.notAuthenticated);
                            } else if (!authService.isAuthorized(AUTH_SCOPES.qa)) {
                                return $q.reject(AUTH_EVENTS.notAuthorized);
                            }
                        });
                    }]
                }
            });
    });
