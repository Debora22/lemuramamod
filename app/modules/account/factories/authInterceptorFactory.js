

/**
 * Intereceptor for the HTTP codes related to the Authorization/Authentication.
 * Only throw the message in the $rootScope broadcast.
 * Each controller/service should manage it.
 */
angular.module('account')
    .factory('AuthInterceptorFactory', ['$rootScope', '$q', '$location', 'AUTH_EVENTS', 'loadingService', '$window',
        function($rootScope, $q, $location, AUTH_EVENTS, loadingService, $window) {
            return {
                responseError: function(response) {
                    if ($window.trackJs) {
                        var invalid = [-1, 0, 404, 403, 401, 409]; // status code <= 0 means request canceled
                        if (invalid.indexOf(response.status) === -1) {
                            $window.trackJs.track(response);
                        }
                    }
                    $rootScope.$broadcast({
                        401: AUTH_EVENTS.notAuthenticated,
                        403: AUTH_EVENTS.notAuthorized, // customer not selected
                        419: AUTH_EVENTS.sessionTimeout,
                        440: AUTH_EVENTS.sessionTimeout
                    }[response.status], response);

                    if ((response.status === 401) && !$location.path().has('/login')) {
                        loadingService.off();
                        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                        $location.url('/login');
                    }

                    return $q.reject(response);
                }
            };
        }
    ]);
