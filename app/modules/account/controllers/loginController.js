'use strict';

/**
 * @ngdoc function
 * @name account.controller:loginController
 * @description
 */

angular.module('account')
.controller('loginController', [
    '$scope',
    '$location',
    '$log',
    'loadingService',
    'authService',
    'sectionService',
    'AccountAccessTrackerHelper',
    function(
        $scope,
        $location,
        $log,
        loadingService,
        authService,
        sectionService,
        AccountAccessTrackerHelper
    ) {
        loadingService.on();

        authService.authenticate()
        .then(AccountAccessTrackerHelper.trackLogin)
        .then(function() {
            var path = '/' + (sectionService.getValidSection() || '404');
            $location.path(path);
        })
        .catch(function(e) {
            $log.error(e);
            $location.path('/login');
        })
        .finally(function() {
            loadingService.off();
        });
    }
]);
