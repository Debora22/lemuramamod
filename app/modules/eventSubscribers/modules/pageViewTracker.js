'use strict';

/**
 * Tracker for all page view related events
 */
var pageViewTrackerModule = angular.module('eventSubscribers.pageViewTracker', []);

var ignoredLocations = ['/'];

var pageConfigs = {
    '/login': {
        title: 'UserLogin',
        includeCustomer: false
    },
    '/logout': {
        title: 'UserLogout',
        includeCustomer: true
    },
    '/accounts': {
        title: 'AccountSelection',
        includeCustomer: false
    },
    '/expressmoderation': {
        title: 'Premod-Gallery',
        includeCustomer: true
    },
    '/expressmoderation/media': {
        title: 'Premod-Media',
        includeCustomer: true
    },
    '/expressmoderation/search': {
        title: 'Premod-Search',
        includeCustomer: true
    },
    '/expressmoderation/filter/metadata': {
        title: 'Premod-filter',
        includeCustomer: true
    },
    '/tagging': {
        title: 'Tagging-Gallery',
        includeCustomer: true
    },
    '/tagging/media': {
        title: 'Tagging-Media',
        includeCustomer: true
    },
    '/tagging/bulk': {
        title: 'Tagging-BulkAction',
        includeCustomer: true
    },
    '/tagging/media/search': {
        title: 'Tagging-Media-Search',
        includeCustomer: true
    },
    '/tagging/bulk/search': {
        title: 'Tagging-BulkAction-Search',
        includeCustomer: true
    },
    '/tagging/search': {
        title: 'Tagging-Search',
        includeCustomer: true
    },
    '/tagging/filter/metadata': {
        title: 'Tagging-Filter',
        includeCustomer: true
    },
    '/moderation': {
        title: 'Moderation-Gallery',
        includeCustomer: true
    },
    '/moderation/media': {
        title: 'Moderation-Media',
        includeCustomer: true
    },
    '/moderation/bulk': {
        title: 'Moderation-BulkAction',
        includeCustomer: true
    },
    '/moderation/media/search': {
        title: 'Moderation-Media-Search',
        includeCustomer: true
    },
    '/moderation/bulk/search': {
        title: 'Moderation-BulkAction-Search',
        includeCustomer: true
    },
    '/moderation/search': {
        title: 'Moderation-Search',
        includeCustomer: true
    },
    '/moderation/filter/metadata': {
        title: 'Moderation-filter',
        includeCustomer: true
    },
    '/qa': {
        title: 'Qa-Gallery',
        includeCustomer: true
    },
    '/qa/media': {
        title: 'Qa-Media',
        includeCustomer: true
    },
    '/qa/bulk': {
        title: 'Qa-BulkAction',
        includeCustomer: true
    },
    '/qa/media/search': {
        title: 'Qa-Media-Search',
        includeCustomer: true
    },
    '/qa/bulk/search': {
        title: 'Qa-BulkAction-Search',
        includeCustomer: true
    },
    '/qa/search': {
        title: 'Qa-Search',
        includeCustomer: true
    },
    '/qa/filter/metadata': {
        title: 'Qa-filter',
        includeCustomer: true
    }
};

pageViewTrackerModule.run([
    '$rootScope',
    '$location',
    'externalTrackingFactory',
    'EXTERNAL_TRACKING_EVENTS',
    '$window',
    function(
        $rootScope,
        $location,
        externalTrackingFactory,
        EXTERNAL_TRACKING_EVENTS,
        $window
    ) {
        var defaultConfig = {
            title: '',
            includeCustomer: false
        };

        /**
         * Returns configs according with the current page
         * @param page The page name
         */
        function getPageConfig(page) {
            var pageConfig = pageConfigs[page];
            var result = '';

            if (!pageConfig || !pageConfig.title) {
                if ($window.trackJs) {
                    //Directly invokes an error to be sent to TrackJS
                    $window.trackJs.track('ERROR: No external tracking TITLE defined for the current page: ' + page);
                }
                result = defaultConfig;
            } else {
                result = pageConfig;
            }

            return result;
        }

        /**
         * It handles the page change event and send this information to external tracking service
         */
        $rootScope.$on('$routeChangeSuccess', function() {
            var page = $location.path();
            if (ignoredLocations.indexOf(page) < 0) {
                var config = getPageConfig(page);

                externalTrackingFactory.trackPageView(page, config.title, config.includeCustomer);
            }
        });

        /**
         * It handles the external tracking page event and send this information to external tracking service
         */
        $rootScope.$on(EXTERNAL_TRACKING_EVENTS.pageView.page, function(event, page) {
            var config = getPageConfig(page);

            externalTrackingFactory.trackPageView(page, config.title, config.includeCustomer);
        });

        /**
         * It handles the search event in a page
         */
        $rootScope.$on(EXTERNAL_TRACKING_EVENTS.pageView.search, function(event, page, searchTerm) {
            var config = getPageConfig(page);

            externalTrackingFactory.trackPageView(page, config.title, config.includeCustomer, searchTerm);
        });
    }]);
