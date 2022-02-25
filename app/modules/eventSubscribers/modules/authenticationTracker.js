'use strict';


/**
 * This common subscriber listen for customer change and clears the tracking state
 */
angular
.module('eventSubscribers.authenticationTracker', [])
.run([
    '$rootScope',
    'externalTrackingFactory',
    'AUTH_EVENTS',
    'authService',
    'fullstoryService',
    function(
        $rootScope,
        tracking,
        AUTH_EVENTS,
        authService,
        fullstoryService
    ) {
        var getAccountInfo = function() {
            authService.isSessionReady()
            .then(function(session) {
                if (session.customer) {
                    tracking.setConfig('customer', session.customer.name);
                    tracking.setConfig('customer_id', session.customer.id);
                    fullstoryService.identify(session.customer.id, {
                        email: session.user.email,
                        displayName: session.user.name,
                        customerID: session.customer.id,
                        customerName: session.customer.name
                    });
                }
            });
        };
        getAccountInfo();

        $rootScope.$on(AUTH_EVENTS.accountChange, function() {
            getAccountInfo();
        });

    }]);
