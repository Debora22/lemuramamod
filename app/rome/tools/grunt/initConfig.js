module.exports = function () {
    // default configuration form the initConfig
    var configurations = {
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    './Gruntfile.js',
                    './**/src/**/*.js',
                    './**/test/*.js',
                    '!./node_modules/**/*.js',
                    '!./bower_components/**/*.js',
                    '!./**/node_modules/**/*.js',
                    '!./**/bower_components/**/*.js'
                ]
            }
        },
        karma: {
            options: {
                configFile: 'karma.js'
            },
            default: {
                autoWatch: false,
                singleRun: true
            },
            precommit: {
                autoWatch: false,
                singleRun: true
            },
            watch: {
                autoWatch: true,
                singleRun: false
            },
            coverage: {
                autoWatch: false,
                singleRun: true,
                reporters: ['progress', 'coverage'],
                preprocessors: {
                    '*/src/statics/partials/*.html': ['ng-html2js'],
                    '*/src/**/*.js': ['coverage']
                },
                coverageReporter: {
                    type: 'html',
                    dir: 'coverage/'
                },
            }
        }
    };

    return configurations;
};
