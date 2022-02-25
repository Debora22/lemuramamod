/* eslint-disable strict */
'use strict';

const jest = require('jest-cli');
const path = require('path');
const msg = require('../others/cliMessages');
const find = require('../others/finder');
/**
 * This class acts as a _wrapper_ for the Jest Node API. It allows us to add special
 * functionalities, like selecting an special suite to run instead of running all of
 * them.
 */
module.exports = class LemuramaMiddlewareJestRunner {
    /**
     * Class constructor.
     * @param  {String}  label         The name of the suite (like _"unit tests"_ or
     *                                 _"integration tests"_). It's used on the success
     *                                 and error messages.
     * @param  {Object}  config        The Jest configuration.
     * @param  {Object}  args          The CLI arguments the script received.
     * @param  {Boolean} runInParallel Optional. Whether or not the tests should run at
     *                                 the same time, or one at the time.
     * @param  {Boolean} cache         Optional. Whether or not Jest should use the
     *                                 cache.
     */
    constructor(label, config, args, runInParallel, cache) {
        /**
         * The name of the suite the instance is going to run.
         * @type {String}
         */
        this.label = label;
        /**
         * The Jest configuration object.
         * @type {Object}
         */
        this.config = config;
        /**
         * Whether the tests need to run one by one, or in parallel.
         * @type {Boolean}
         */
        this.runInBand = !runInParallel;
        /**
         * Whether Jest should use its cache or not.
         * @type {Boolean}
         */
        this.cache = !!cache;
        if (args.files) {
            this.detectFiles(args.files);
        }
    }
    /**
     * Escape special characters from a string that could cause conflicts while on a
     * regular expression.
     * @param  {String} text The string to escape.
     * @return {String} The escaped string.
     */
    escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
    /**
     * Based on a given list of files, this method will create a negative RegExp so the
     * Jest runner will ignore everything that is not on the list.
     * @param {Array} files A list of specific files for Jest to test.
     */
    detectFiles(files) {
        if (!this.config.testPathIgnorePatterns) {
            this.config.testPathIgnorePatterns = [];
        }

        const regexList = [];
        files.split(',').forEach(file => {
            regexList.push(this.escapeRegex(file.trim()));
        }, this);

        const sanitized = regexList.join('|');
        this.config.testPathIgnorePatterns.push(`^((?!(?:${sanitized})).)*$`);
        if (this.config.collectCoverage) {
            const coverageFiles = find(
                path.join(process.cwd(), 'src'),
                new RegExp(sanitized, 'ig'),
                /\.css|\.scss?$/ig
            );

            if (coverageFiles.length) {
                this.config.collectCoverageOnlyFrom = {};
                coverageFiles.forEach(file => {
                    this.config.collectCoverageOnlyFrom[file] = true;
                });
            }
        }
    }
    /**
     * As its name suggests it, this method starts the Jest runner.
     */
    run() {
        this.config.rootDir = process.cwd();
        jest.runCLI({
            config: this.config,
            runInBand: this.runInBand,
            cache: this.cache,
        }, this.config.rootDir, success => {
            if (success) {
                msg.success(`Yay! all the ${this.label} passed!`);
            } else {
                msg.error(`Damn... something went wrong with the ${this.label}`);
            }
        });
    }
};
