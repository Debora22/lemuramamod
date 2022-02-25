exports.config = {
    allScriptsTimeout: 50000,
    seleniumAddress: 'http://selenium.servers.photorank.me:4444/wd/hub',
    baseUrl: 'https://olapic-tests.s3.amazonaws.com/lemurama/functional-tests/index.html',
    multiCapabilities: [
        {
            browserName: 'chrome'
        },
    ],

    // How long to wait for a page to load.
    getPageTimeout: 50000,

    onPrepare: function() {
        // All imports
        var width = 1370;
        var height = 660;
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
        browser.manage().timeouts().implicitlyWait(30000);
        browser.driver.manage().window().setSize(width, height);
    },

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
