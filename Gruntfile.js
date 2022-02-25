// Generated on 2014-07-21 using generator-angular 0.9.5
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        dist: 'dist',
        public: 'dist/public',
        cdnify: require('./configs/cdnify.js'),
        templatePath: (require('./bower.json').appPath || 'app') + '/templates',
        analytics: require('./configs/analytics.js')
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            defaultWatch: {
                bower: {
                    files: ['bower.json'],
                    tasks: ['wiredep']
                },
                js: {
                    files: [
                        'app/modules/**/*.js'
                    ],
                    tasks: ['newer:jshint:all']
                },
                styles: {
                    files: ['<%= yeoman.app %>/modules/theme/statics/*.css'],
                    tasks: ['newer:copy:styles', 'autoprefixer']
                },
                gruntfile: {
                    files: ['Gruntfile.js']
                }
            },
            scss: {
                files: ['<%= yeoman.app %>/johnny/scss/*.scss'],
                tasks: ['sass:build']
            },
            emptyWatch: {}
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },
            standard: {
                options: {
                    open: true,
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use(
                                '/app/components',
                                connect.static('./app/components')
                            ),
                            connect.static(appConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect.static('test'),
                            connect().use('/app/components', connect.static('./app/components')),
                            connect.static(appConfig.app)
                        ];
                    }
                }
            },
            e2e: {
                options: {
                    port: 9003,
                    middleware: function(connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use(
                                '/app/components',
                                connect.static('./app/components')
                            ),
                            connect.static(appConfig.app)
                            ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= yeoman.public %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
                force: false
            },
            all: {
                src: [
                    'Gruntfile.js',
                    'configs/*.js',
                    '<%= yeoman.app %>/modules/**/*.js',
                    '<%= yeoman.app %>/rome/**/*.js',
                    '!<%= yeoman.app %>/modules/repository/statics/js/osc.min.mock.js'
                ]
            },
            test: {
                src: ['<%= yeoman.app %>/modules/**/*_test.js']
            }
        },

        // Sass build
        sass: {
            build: {
                options: {
                    outputStyle: 'compressed',
                    sourcemap: false,
                },
                files: {
                    'app/johnny/css/fonts.css': 'app/johnny/scss/fonts.scss',
                    'app/johnny/css/olapic.bootstrap.css': 'app/johnny/scss/olapic.bootstrap.scss',
                    'app/johnny/css/olapic.theme.css': 'app/johnny/scss/olapic.theme.scss',
                    'app/johnny/css/olapic-icons.css': 'app/johnny/scss/olapic-icons.scss',
                    'app/johnny/css/box.css': 'app/johnny/scss/box.scss',
                    'app/johnny/css/sidebar.css': 'app/johnny/scss/sidebar.scss',
                    'app/johnny/css/library.css': 'app/johnny/scss/library.scss',
                    'app/johnny/css/modal.css': 'app/johnny/scss/modal.scss',
                    'app/johnny/css/analytics.css': 'app/johnny/scss/analytics.scss',
                    'app/johnny/css/error-page.css': 'app/johnny/scss/error-page.scss',
                    'app/johnny/css/progressbutton.css': 'app/johnny/scss/progressbutton.scss',
                    'app/johnny/css/translate.css': 'app/johnny/scss/translate.scss',
                    'app/johnny/css/timeTracker.css': 'app/johnny/scss/timeTracker.scss',
                    'app/johnny/css/submitActivityPopup.css': 'app/johnny/scss/submitActivityPopup.scss',
                    'app/johnny/css/annotable.css': 'app/johnny/scss/annotable.scss'
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                    '.tmp',
                    '<%= yeoman.dist %>/{,*/}*',
                    '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            afterBuild: [
                '<%= yeoman.public %>/components/mastermind/node_modules/karma/node_modules/' +
                'connect/node_modules/serve-index/public/icons/',
                '<%= yeoman.public %>/components/mastermind/bower_components/jquery-ui/themes/'
            ]
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            options: {
                cwd: '<%= yeoman.app %>'
            },
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                ignorePath:  /\.\.\//,
                exclude: [
                    '/components/mastermind',
                    '/components/angular-popup-boxes',
                    '/components/file-saver-js'
                ]
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= yeoman.public %>/scripts/{,*/}*.js',
                    '<%= yeoman.public %>/styles/{,*/}*.css',
                    '<%= yeoman.public %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= yeoman.public %>/styles/fonts/*'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.public %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.public %>/{,*/}*.html'],
            css: ['<%= yeoman.public %>/styles/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= yeoman.public %>','<%= yeoman.public %>/images']
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.public %>/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.public %>/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.public %>',
                    src: ['*.html', 'views/{,*/}*.html'],
                    dest: '<%= yeoman.public %>'
                }]
            }
        },

        // minificate
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '**/*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },

        // Replace Google and external CDN references
        cdnify: {
            options:{
                cdn: appConfig.cdnify
            },
            dist: {
                html: ['<%= yeoman.public %>/*.html']
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                {
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.public %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '*.html',
                        'modules/**/**/**/*.html',
                        'core/lenguages/en-us.json',
                        'rome/**/src/**/**/*.html',
                        'rome/**/src/**/**/*.png'
                    ]
                },
                {
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.public %>',
                    src: [
                        'components/**/*.{png,jpg,jpeg,eot,svg,ttf,woff}'
                    ],
                    filter: 'isFile'
                },
                {
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>/johnny/fonts',
                    dest: '<%= yeoman.public %>/fonts',
                    src: [
                        '*'
                    ],
                    filter: 'isFile'
                },
                {
                    expand: true,
                    flatten: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.public %>/styles',
                    src: [
                        'components/angular-ui-grid/*.{ttf,woff}'
                    ],
                    filter: 'isFile'
                },
                {
                    expand: true,
                    flatten: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.public %>/fonts',
                    src: [
                        'components/bootstrap/dist/fonts/*.{ttf,woff}'
                    ],
                    filter: 'isFile'
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            },
            middleware: {
                options: {
                    mode: true
                },
                files: [
                    {
                        expand: true,
                        cwd: './middleware',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            'src/**',
                            'bin/*',
                            'etc/*'
                        ]
                    }
                ]
            },
            npmConfig: {
                options: {
                    mode: true
                },
                files: [{
                    expand: true,
                    dot: true,
                    dest: '<%= yeoman.dist %>',
                    src: [
                        'package.json',
                        '.nvmrc',
                        'scripts/**'
                    ]
                }]
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                reporters: ['progress'],
                singleRun: true
            },
            unitCoverage: {
                configFile: './test/karma.conf.js',
                autoWatch: false,
                singleRun: true,
                reporters: ['progress', 'coverage'],
                preprocessors: {
                    '**/statics/partials/*.html': ['ng-html2js'],
                    '*/src/**/*.js': ['coverage'],
                    'app/!(components)/**/!(*_test).js': ['coverage']
                },
                coverageReporter: {
                    type: 'html',
                    dir: 'test/coverage/'
                }
            }
        },

        // Functional test configuration
        protractor: {
            options: {
                configFile: 'test/protractor-devel-conf.js',
                keepAlive: false,
                noColor: false,
                args: {
                    cucumberOpts: {
                        tags: [grunt.option('tags'),'~@defect']
                    }
                }
            },
            local: {
                options: {
                    configFile: 'test/protractor-devel-conf.js'
                }
            },
            live: {
                options: {
                    configFile: 'test/protractor-live-conf.js'
                }
            }
        },
        cucumber_html_report: {
            options: {
                src: 'test/e2e/report/src/e2e-test-results.json', // input file
                dst: 'test/e2e/report/e2e-test-results' // output directory
            },
            files: {
            }
        },

        jsbeautifier: {
            files: ['<%= yeoman.app %>/appConfig.js'],
            options: {}
        },

        uglify: {
            options: {
                sourceMap: false
            }
        },

        replace: {
            dist: {
                src: ['<%= yeoman.public %>/index.html'],
                dest: '<%= yeoman.public %>/index.html',
                replacements: [{
                    from: '<!-- TRACKJS HERE -->',
                    to: grunt.file.read('configs/trackjs.html')
                },
                {
                    from: '<!-- INFORMIZELY HERE -->',
                    to: grunt.file.read('configs/informizely.html')
                }]
            }
        },

        ngconstant: {
            options: {
                name: 'appConfig',
                dest: '<%= yeoman.app %>/appConfig.js',
                constants: 'configs/appConfig.json'
            },
            local: {
                constants: 'configs/appConfig_local.json'
            },
            live: {
                constants: 'configs/appConfig_live.json'
            }
        },

        html2js: {
            options: {
                rename: function(moduleName) {
                    return moduleName.replace('../app/', '');
                }
            },
            main: {
                src: ['app/modules/**/*.html',
                    'app/uiComponents/**/*.html',
                    'app/uiWidgets/**/*.html',
                    'app/modules/index.html'],
                dest: '<%= yeoman.templatePath %>/lemurama.js'
            }
        }
    });

    // Load all NPM tasks
    grunt.loadNpmTasks('grunt-protractor-runner');
    // Plugin for e2e report
    grunt.loadNpmTasks('grunt-cucumber-html-report');
    // NG Contant generation
    grunt.loadNpmTasks('grunt-ng-constant');
    // Javascript Beautifier
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.loadNpmTasks('grunt-https-proxy');

    grunt.loadNpmTasks('grunt-html2js');
    // Mock html2js module result for local enviroment. Allow us work with the html source and skipt the cache
    grunt.registerTask('mockhtml2js', function() {
        grunt.file.write('app/templates/lemurama.js', 'angular.module(\'templates-main\', []);');
    });

    grunt.registerTask('replaceAnalytics:dev', function() {
        grunt.file.write('app/googleAnalytics.js', grunt.file.read('configs/googleAnalytics.js')
            .replace('<!--UA-HERE-->', appConfig.analytics.development));
    });

    grunt.registerTask('replaceAnalytics:dist', function() {
        grunt.file.write('app/googleAnalytics.js', grunt.file.read('configs/googleAnalytics.js')
            .replace('<!--UA-HERE-->', appConfig.analytics.production));
    });

    /**
     * Debugging with sourceMap:
     * - Activate the sourceMap option on the uglify task.
     * - Include the following task on build:live to correct the a sourceMap's urls.
     * - Generate a STG with this branch.
     * - Don't include the sourceMap on production ready branch.
     */
    grunt.registerTask('updateSourceMaps', function() {
        var regReplace = /\["(.*)[scripts|vendor](.*)"\]/;
        // iterate over the file on the script's path
        grunt.file.recurse('dist/public/scripts', function(abspath, rootdir, subdir, filename) {
            if (filename.search(/[scripts|vendor]\.(.*)\.js\.map/) > -1) {
                filename = filename.replace('.map', '');
                var content = grunt.file.read(abspath);
                // replace wrong sourceMap's content
                content = content.replace(regReplace, '["' + filename + '"]');
                content = content.replace('scripts.js', filename);
                content = content.replace('vendor.js', filename);
                // let's write the results overwriting the old sourceMap
                grunt.file.write(abspath, content);
            }
        });
    });

    grunt.registerTask('serve:local', [
        'sass:build',
        'mockhtml2js',
        'ngconstant:local',
        'replaceAnalytics:dev'
    ]);

    grunt.registerTask('selectWatch', function() {
        var targetOptions = grunt.config('watch')[arguments[0]];
        grunt.config('watch', targetOptions);
        return grunt.task.run('watch');
    });

    grunt.registerTask('test', [
        'concurrent:test',
        'html2js',
        'autoprefixer',
        'karma:unit'
    ]);

    grunt.registerTask('run-build', [
        'sass:build',
        'clean:dist',
        'replaceAnalytics:dist',
        'ngconstant:live',
        'html2js',
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'ngAnnotate',
        'copy:dist',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin',
        'replace:dist',
        'copy:middleware',
        'copy:npmConfig',
        'clean:afterBuild'
    ]);

    grunt.registerTask('build', [
        'run-build'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);

    grunt.registerTask('test:e2e:local', [
        'connect:e2e',
        'protractor:local'
    ]);

    grunt.registerTask('test:e2e:live', [
        'protractor:live'
    ]);

    grunt.registerTask('test:build', 'Run functional test', function(target) {
        if (target === 'local') {
            return grunt.task.run(['test:unit','test:e2e:local']);
        } else if (target === 'e2e') {
            // Temporal task for run the test in pull requests
            return grunt.task.run(['test:e2e:live']);
        } else {
            return grunt.task.run(['test:unit']);
        }
    });

    grunt.registerTask('test:unit', [
        'karma:unit'
    ]);

    grunt.registerTask('test:coverage', [
        'karma:unitCoverage'
    ]);
};
