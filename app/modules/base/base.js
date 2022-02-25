'use strict';

/**
 * @ngdoc overview
 * @name theme
 * @description
 * This module contains the base theme and a lot of components
 *
 */
angular
    .module('base', [])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                resolve: {
                    redirect: ['$location', 'authService', 'AUTH_SCOPES',
                        function redirectService($location, authService, AUTH_SCOPES) {
                            authService.isSessionReady().then(function() {
                                var scopes = authService.getScopes();
                                if (scopes.indexOf(AUTH_SCOPES.premod) > 0) {
                                    $location.url('/expressmoderation');
                                } else if (scopes.indexOf(AUTH_SCOPES.tagging) > 0) {
                                    $location.url('/tagging');
                                } else if (scopes.indexOf(AUTH_SCOPES.moderation) > 0) {
                                    $location.url('/moderation');
                                } else {
                                    $location.url('/login');
                                }
                            });
                        }
                    ]
                }
            })
            .when('/401', {
                templateUrl: 'modules/base/statics/partials/401.html'
            })
            .when('/404', {
                templateUrl: 'modules/base/statics/partials/404.html'
            })
            .when('/500', {
                templateUrl: 'modules/base/statics/partials/500.html'
            })
            .otherwise({ redirectTo: '/404' });
    })
    /**
     * @description
     * Set settings for notifications module
     */
    .config(['notificationsProvider', function(notifications) {
        notifications.setSettings({
            position: 'right',
            duration: 8000
        });
    }])
    /**
     * @description
     * Set settings for translation module
     */
    .config(['$translateProvider', function($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'core/lenguages/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en-us');
    }]);
