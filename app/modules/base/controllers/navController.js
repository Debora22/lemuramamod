'use strict';

/**
 * @ngdoc function
 * @name theme.controller:NavController
 * @description
 * # NavController
 * Controller for manage nav bar
 */
angular.module('base')
.controller('NavController', [
    '$scope',
    '$rootScope',
    '$window',
    '$location',
    '$http',
    '$q',
    '$log',
    'angularPopupBoxes',
    'authService',
    'AUTH_EVENTS',
    'internalTrackingService',
    'trackingAPIService',
    'AccountAccessTrackerHelper',
    'loadingService',
    'sectionScopeService',
    'moderationTimeTrackerService',
    function(
        $scope,
        $rootScope,
        $window,
        $location,
        $http,
        $q,
        $log,
        popup,
        authService,
        AUTH_EVENTS,
        internalTracking,
        trackingAPIService,
        accountAccessTrackerHelper,
        loadingService,
        sectionScopeService,
        moderationTimeTrackerService
    ) {
        $scope.navCollapsed = true;

        // dont's show the menu on the section s account and login
        if ($location.path().search('login') > -1) {
            $scope.hideMenuFromNav = true;
        }

        /**
         * @name updateCounters
         * @desc set the counters values to be displayed
         */
        function updateCounters(values) {
            $scope.headerCountersData = {
                approved: values.approved || 0,
                rejected: values.rejected || 0,
                tagged: values.tagged || 0
            };
        }
        //Sets a callback to be called when the counters are updated
        internalTracking.onCounterChange(function(values) {
            updateCounters(values);
        });

        updateCounters(internalTracking.getCountersData());

        /**
         * @name modalInstances
         * @desc hold the modal instances that were broadcasted as open
         */
        var modalInstances = [];

        var bindDataWhenReady = function(session) {
            $scope.menu = [];
            $scope.currentSession = (session && session.customer) || {};
            $scope.hideMenuFromNav = false;

            var userPermisions = authService.getScopes();

            angular.forEach(sectionScopeService.getSectionValues(), function(section) {
                userPermisions.some(function(permission) {
                    if (section.scope === permission) {
                        $scope.menu.push(section);
                        return true;
                    }
                });
            });

            // dont's show the menu on the section s account and login
            if ($location.path().search(/(accounts|login)/) > -1) {
                $scope.hideMenuFromNav = true;
            }
        };

        /**
         * @name submitActivity
         * @desc It opens the activity submission popup
         * @param action: whether it is a 'switchAccount' or a 'logout' action
         * @param showSubmit: True to indicate tha it should display the form to submit moderator activity
         */
        function submitActivity(action, showSubmit) {
            //We refresh time tracker display right before the popup is displayed so we have both values on sync
            var resumer = moderationTimeTrackerService.pause();

            var templateToUse = showSubmit ? 'modules/base/statics/partials/submitActivityPopup.html' :
                'modules/base/statics/partials/switchAccountWithoutSubmitPopup.html';

            return popup.confirm({
                templateUrl: templateToUse,
                controller: 'switchAccountController',
                modalId: 'submitActivityModal',
                resolve: {
                    actionType: function() {
                        return action;
                    }
                },
                keyboard: false
            }, {
                width: 553
            }).result.then(function() {
                loadingService.on();
                return $q.all([
                    moderationTimeTrackerService.stop(),
                    trackingAPIService.resetActionCounters(),
                    accountAccessTrackerHelper.trackLogout(),
                ]);
            }, function() {
                //If the previous running status was false, do not resume.
                resumer();

                return $q.reject();
            });
        }

        /**
         * @name switchAccount
         * @desc It shows the switch account dialog box
         * @param showSubmit: True to indicate tha it should display the form to submit moderator activity
         */
        $scope.switchAccount = function(showSubmit) {
            submitActivity('switchAccount', showSubmit).then(function() {
                $scope.hideMenuFromNav = true;
                authService.switchAccount();
            });
        };

        $scope.logout = function() {
            submitActivity('logout', true).then(function() {
                $scope.hideMenuFromNav = true;
                $location.path('/logout');
            });
        };

        var bindData = function() {
            authService.isSessionReady()
            .then(bindDataWhenReady)
            .catch(function(e) {
                $log.error(e);
                $location.path('/logout');
            });
        };

        $rootScope.$on('$viewContentLoaded', function() {
            bindData();
        });

        // bind data on account change.
        $rootScope.$on(AUTH_EVENTS.accountChange, function() {
            moderationTimeTrackerService.init();
            internalTracking.init();
            bindData();
        });

        // bind data on login.
        $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
            bindData();
        });

        // bind data on login.
        $rootScope.$on(AUTH_EVENTS.logoutSuccess, function() {
            bindData();
        });

        /**
         * @name isActive
         *
         * @description
         * Add class active to item active in the nav bar
         *
         * @param {string} path Current location.
         *
         * @returns {string} class
         */
        $scope.isActive = function(path) {
            if ($location.path().split('/')[1] === path.split('/')[1]) {
                return 'nav-active';
            } else {
                return '';
            }
        };

        /**
         * @desc listen for the event opModalInstantiated to save the instance into a collection
         */
        $rootScope.$on('opModalInstantiated', function(e, args) {
            if (modalInstances.indexOf(args.target) === -1) {
                modalInstances.push(args.target);
            }
        });

        /**
         * @desc when the state route changes, tyries to close the modal that might be opened
         */
        $rootScope.$on('$routeChangeStart', function() {
            modalInstances.forEach(function(modal) {
                if (angular.isDefined(modal) && modal.actions.isOpen()) {
                    modal.actions.close();
                }
            });
        });

        $scope.isLoading = loadingService.loading;
    }]);
