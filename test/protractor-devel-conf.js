exports.config = {
    allScriptsTimeout: 70000,
    seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'http://localhost:9003',
    multiCapabilities: [
        {
            browserName: 'chrome'
        },
    ],

    // How long to wait for a page to load.
    getPageTimeout: 70000,

    onPrepare: function() {
        // All imports
        fs = require('fs');
        path = require('path');
        util = require('util');
        chai = require('chai');
        chaiAsPromised = require('chai-as-promised');
        chai.use(chaiAsPromised);
        expect = chai.expect;
        // Disable animations so e2e tests run more quickly
        browser.addMockModule('disableNgAnimate', function() {
            angular.module('disableNgAnimate', []).run(function($animate) {
                $animate.enabled(false);
            });
        });
        browser.addMockModule('configNotificationTimeout', function() {
            angular.module('configNotificationTimeout', [])
                .config(['notificationsProvider', function(notifications) {
                    notifications.setSettings({
                        duration: 4000
                    });
                }]);
        });
        global.isAngularSite = function(flag) {
            browser.ignoreSynchronization = !flag;
        };
        browser.driver.executeScript(() => ({
           width: window.screen.availWidth,
           height: window.screen.availHeight,
       }))
       .then(result => browser.driver.manage().window().setSize(result.width, result.height));
    },
    resultJsonOutputFile: 'report.json',
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    specs: [
        'e2e/features/*.feature'
    ],
    cucumberOpts: {
        require: './e2e/features/*/*.js',
        format: 'pretty',
        keepAlive: true
    }
};
