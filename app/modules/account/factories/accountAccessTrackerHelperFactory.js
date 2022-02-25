'use strict';

/**
 * @ngdoc factory
 * @name account.factory:AccountAccessTrackerHelper
 * @description
 *
 * This helper contains a few useful functions to track account access
 * events, like Login and Logout.
 *
 */
angular
.module('account')
.factory('AccountAccessTrackerHelper', [
    'authService',
    'trackv2',
    '$q',
    function(
        authService,
        trackv2,
        $q
    ) {

        var getEntity = function(session) {
            return {
                id: session.customer.id,
                type: 'Customer'
            };
        };

        /**
         * Sends the "login" event to Analytics V2 / Eridani
         * @return {Promise}
         */
        var loginEvent = function() {
            return authService.isSessionReady().then(function(session) {
                trackv2.addEvent('account', 'account.login', getEntity(session));
                trackv2.flush();
            });
        };

        /**
         * Sends the "logout" event to Analytics V2 / Eridani
         * @return {Promise} trackv2 flush response
         */
        var logoutEvent = function() {
            return authService.isSessionReady().then(function(session) {
                if (session.customer) {
                    trackv2.addEvent('account', 'account.logout', getEntity(session));
                    return trackv2.flush();
                } else {
                    return $q.when();
                }
            });
        };

        return {
            trackLogin: loginEvent,
            trackLogout: logoutEvent
        };
    }
]);
