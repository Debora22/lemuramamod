'use strict';

/**
 * @ngdoc overview
 * @name account
 * @description
 * This module contains the login and select account sections
 *
 */
angular
    .module('account', ['op.auth'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/login', {
                template: '',
                controller: 'loginController'
            })
            .when('/logout', {
                controller: 'logoutController',
                template: ''
            });
    })
    /**
     * @description
     * Inject the HttpProvider Auth Interceptor into the $httpProvider
     * to broadcast some messages under some http codes.
     */
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptorFactory');
    })
    /**
     * @ngdoc constant
     *
     * @description
     * list of the available Auth Events.
     */
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth:login-success',
        loginFailed: 'auth:login-failed',
        logoutSuccess: 'auth:logout-success',
        sessionTimeout: 'auth:session-timeout',
        notAuthenticated: 'auth:not-authenticated',
        notAuthorized: 'auth:not-authorized',
        accountChange: 'auth:account-change'
    });
