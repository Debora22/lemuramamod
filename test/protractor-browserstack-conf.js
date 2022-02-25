exports.config = {
    allScriptsTimeout: 25000,
    seleniumAddress: 'http://hub.browserstack.com/wd/hub',
    baseUrl: 'https://lemurama-staging.s3.amazonaws.com/LemuramaModsquad/bs-refactor-base-branch-1-test/index.html#/login',
    //baseUrl: 'http://lemurama-new-deployment.s3.amazonaws.com/LemuramaModsquad/index.html',
    //baseUrl: 'http://localhost:9003',

    multiCapabilities: [
        //{
        //    'browserName': 'chrome',
        //    //'chromeOptions': {
        //    //    'args': ['show-fps-counter=true','enable-logging','v=1','net-log-level=0']
        //    //}
        //},
        {
            //'browserstack.local' : 'true',
            'browserstack.debug' : 'true',
            'browserName' : 'firefox',
            'browser_version' : '46.0',
            'os' : 'OS X',
            'os_version' : 'El Capitan',
            'resolution' : '1920x1080',
            'browserstack.user' : 'brunosoko3',
            'browserstack.key' : 'WyzzZ1JyqAtyyxuppsF4'
        },
    ],

    // How long to wait for a page to load.
    getPageTimeout: 25000,

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
        browser.manage().timeouts().implicitlyWait(30000);
        browser.driver.manage().window().maximize();
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