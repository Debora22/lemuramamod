'use strict';

/**
 * @ngdoc overview
 * @name lemuramaApp
 * @description
 * Tha main module, here you can append the sub-modules
 */
angular
.module('lemuramaApp', [
    'ngRoute',
    'templates-main',
    'pascalprecht.translate',
    'appConfig',
    'op.masterMind',
    'op.translate',
    'account',
    'common',
    'base',
    'tagging',
    'qa',
    'expressModeration',
    'moderation',
    'eventSubscribers',
    'op.rome',
    'op.internalTracking',
    'op.externalTracking',
    'uiComponents',
    'uiWidgets',
    'ui.slider'
])

/**s
 * @description
 * Add support for the CrossDomains requests.
 */
.config(['$httpProvider', 'OfflineProvider',
    function($httpProvider, OfflineProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        OfflineProvider.options({
            checkOnLoad: true,
            interceptRequests: true
        });
    }
])
/**
 * @desc Configure op.rome
 */
.config(['romeProvider', function(provider) {
    provider.set.basePath('rome/');
}])

/**
 * @desc Configure op.track / trackv2Provider
 */
.config(['trackv2Provider', 'appConstant', '$compileProvider',
    function(trackv2Provider, appConstant, $compileProvider) {
        if (!appConstant.debugInfo) {
            $compileProvider.debugInfoEnabled(false);
        }
        trackv2Provider.setSettings({
            url: appConstant.anafrus.url,
            appName: appConstant.appName,
            enabled: appConstant.anafrus.enabled,
            bulkLimit: appConstant.anafrus.bulkLimit
        });
    }
])
.run(function($rootScope, $location, AUTH_EVENTS, notifications) {
    // listen to the route change error event to;
    // each section will valida on the routing if the user user is properly logged.
    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
        if(rejection === AUTH_EVENTS.notAuthorized) {
            notifications.addErrorMessage('You can\'t access this section.');
            $location.path('/403');
        } else {
            // no reason usually means `authService.isSessionReady()`
            // returned a rejected session` on some router resolver.
            $location.path('/logout');
        }
    });
});
