module.exports = function(config) {
    config.set({

        // Base path that will be used to resolve all patterns.
        basePath: '../',

        // Preprocess matching files before serving them to the browser.
        preprocessors: {
            '**/statics/partials/*.html': ['ng-html2js']
        },

        // Preprocess html files and convert them into JavaScript files.
        ngHtml2JsPreprocessor: {
            moduleName: 'templates',
            cacheIdFromPath: function(filepath) {
                if (filepath.indexOf('src') >= 0) {
                    return filepath.substr(filepath.indexOf('src'));
                } else {
                    return filepath;
                }
            }
        },

        // List of files / patterns to load in the browser.
        files: [
            //External dependencies
            'app/components/jquery/dist/jquery.js',
            'app/components/jquery-ui/jquery-ui.js',
            'app/components/angular/angular.js',
            'app/components/angular-ui-sortable/sortable.js',
            'app/components/angular-cookies/angular-cookies.js',
            'app/components/angular-route/angular-route.js',
            'app/components/angular-mocks/angular-mocks.js',
            'app/components/angular-sanitize/angular-sanitize.js',
            'app/components/angular-translate/angular-translate.js',
            'app/components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'app/components/ngstorage/ngStorage.js',
            'app/components/angular-popup-boxes/angular-popup-boxes.js',
            'app/components/sugar/release/sugar-full.min.js',
            'app/components/angular-notify/dist/angular-notify.min.js',
            'app/components/angular-uuid4/angular-uuid4.min.js',
            'app/appConfig.js',
            'app/components/ng-infinite-scroller-origin/build/*.js',
            'app/components/angular-bootstrap/ui-bootstrap.js',
            'app/components/angular-bootstrap/ui-bootstrap-tpls.js',
            'app/components/moment/moment.js',
            'app/components/angular-moment/angular-moment.min.js',
            'app/components/moment-duration-format/lib/moment-duration-format.js',
            'app/components/ng-slider/dist/ng-slider.min.js',
            'app/components/angular-popup-boxes/angular-popup-boxes.js',
            'app/components/angular-q-all-settled/dist/angular-q-all-settled.min.js',

            // Rome module
            'app/rome/rome.js',

            // Action module
            'app/rome/actions/src/statics/partials/*.html',
            'app/rome/actions/src/*.js',
            'app/rome/actions/src/**/*.js',
            'app/rome/actions/test/*.js',

            // Api module
            'app/rome/api/src/*.js',
            'app/rome/api/src/**/*.js',
            'app/rome/api/test/*.js',

            // annotable module
            'app/rome/annotable/src/*.js',
            'app/rome/annotable/src/**/*.js',
            'app/rome/annotable/test/*.js',

            // Auth module
            'app/rome/auth/src/*.js',
            'app/rome/auth/src/**/*.js',
            'app/rome/auth/test/*.js',

            // Autocomplete module
            'app/rome/autocomplete/src/*.js',
            'app/rome/autocomplete/src/**/*.js',
            'app/rome/autocomplete/test/*.js',
            'app/rome/autocomplete/src/statics/partials/*.html',

            // Box module
            'app/rome/box/src/*.js',
            'app/rome/box/src/**/*.js',
            'app/rome/box/test/*.js',
            'app/rome/box/src/statics/partials/*.html',

            // ExternalTracking module
            'app/rome/externalTracking/src/*.js',
            'app/rome/externalTracking/src/**/*.js',
            'app/rome/externalTracking/test/*.js',

            // Filter module
            'app/rome/filters/src/*.js',
            'app/rome/filters/src/**/*.js',
            'app/rome/filters/test/*.js',
            'app/rome/filters/src/statics/partials/*.html',

            // InternalTracking module
            'app/rome/internalTracking/src/*.js',
            'app/rome/internalTracking/src/**/*.js',
            'app/rome/internalTracking/test/*.js',

            // Library module
            'app/rome/library/src/*.js',
            'app/rome/library/src/**/*.js',
            'app/rome/library/test/*.js',
            'app/rome/library/src/statics/partials/*.html',

            // Loading module
            'app/rome/loading/src/*.js',
            'app/rome/loading/src/**/*.js',
            'app/rome/loading/test/*.js',

            // ngeaseljs module
            'app/rome/ngEaselJS/src/*.js',
            'app/rome/ngEaselJS/src/**/*.js',

            // Modal module
            'app/rome/modal/src/*.js',
            'app/rome/modal/src/**/*.js',
            'app/rome/modal/test/*.js',
            'app/rome/modal/src/statics/partials/*.html',

            // Notifications module
            'app/rome/notifications/src/*.js',
            'app/rome/notifications/src/**/*.js',
            'app/rome/notifications/test/*.js',

            // Progressbutton module
            'app/rome/progressbutton/src/*.js',
            'app/rome/progressbutton/src/**/*.js',
            'app/rome/progressbutton/test/*Spec.js',
            'app/rome/progressbutton/src/statics/partials/*.html',

            // Streamlist module
            'app/rome/streamlist/src/*.js',
            'app/rome/streamlist/src/**/*.js',
            'app/rome/streamlist/test/*.js',
            'app/rome/streamlist/src/statics/partials/*.html',

            // Tagging module
            'app/rome/tagging/src/*.js',
            'app/rome/tagging/src/**/*.js',
            'app/rome/tagging/test/*.js',
            'app/rome/tagging/src/statics/partials/*.html',

            // Track module
            'app/rome/track/src/*.js',
            'app/rome/track/src/**/*.js',
            'app/rome/track/test/*.js',

            // Translate module
            'app/rome/translate/src/*.js',
            'app/rome/translate/src/**/*.js',
            'app/rome/translate/test/*Spec.js',
            'app/rome/translate/src/statics/partials/*.html',

            // Module dependencies
            'app/modules/common/*.js',
            'app/modules/common/**/*.js',
            'app/modules/base/*.js',
            'app/modules/base/**/*.js',
            'app/modules/account/*.js',
            'app/modules/account/**/*.js',
            'app/modules/tagging/*.js',
            'app/modules/tagging/**/*.js',
            'app/modules/tagging/statics/partials/*.html',
            'app/modules/expressmoderation/*.js',
            'app/modules/expressmoderation/**/*.js',
            'app/modules/expressmoderation/statics/partials/*.html',
            'app/modules/tagging/*.js',
            'app/modules/tagging/**/*.js',
            'app/modules/tagging/statics/partials/*.html',
            'app/modules/qa/*.js',
            'app/modules/qa/**/*.js',
            'app/modules/qa/statics/partials/*.html',                
            'app/modules/eventSubscribers/**/*.js',
            'app/modules/moderation/*.js',
            'app/modules/moderation/**/*.js',
            'app/modules/moderation/statics/partials/*.html',
            'app/modules/masterMind/masterMind.js',
            'app/modules/masterMind/services/*.js',
            'app/uiComponents/uiComponents.js',
            'app/uiComponents/**/*.js',
            'app/uiWidgets/uiWidgets.js',
            'app/uiWidgets/**/*.js'
        ],

        // By default watch changes
        autoWatch: true,

        // List of test frameworks to use.
        frameworks: ['jasmine'],

        // Start these browsers.
        browsers: [
            'PhantomJS'
        ],

        // Explicit list of plugins.
        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-coverage',
            'karma-spec-reporter',
            'karma-ng-html2js-preprocessor'
        ]
    });
};
