'use strict';

/**
 * @ngdoc controller
 * @name account.controller:logoutController
 * @description
 */
angular.module('account')
.controller('logoutController', [
    '$rootScope',
    'authService',
    'AccountAccessTrackerHelper',
    '$location',
    'AUTH_EVENTS',
    'trackingAPIService',
    function(
        $rootScope,
        authService,
        AccountAccessTrackerHelper,
        $location,
        AUTH_EVENTS,
        trackingAPIService
    ) {

        trackingAPIService.resetActionCounters();

        authService.logout().then(function() {
            $location.path('/login');
        });

    }]);
