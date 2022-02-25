/* eslint strict: 0 */
'use strict';

const babel = require('babel-core');
const jestPreset = require('babel-preset-jest');
const path = require('path');
const glob = require('glob');
/**
 * A custom preprocessor for Jest we built in order to add some features that don't come
 * out of the box.
 */
class LemuramaMiddlewareJestPreProcessor {
    /**
     * Class constructor.
     * @param  {String} relativePath The relative path from this file to the project
     *                               root directory.
     * @param  {Array}  ignoredLines A list of lines that need to be prefixed with the
     *                               Istanbul comment that ignores the line.
     * @return {LemuramaMiddlewareJestPreProcessor} A new instance of the class.
     */
    constructor(relativePath, ignoredLines) {
        /**
         * The relative path from this file to the project root directory.
         * @type {String}
         */
        this.rootPath = path.join(__dirname, relativePath);
        /**
         * A list of lines the parser should prefix with the Istanbul comment that
         * ignores the line
         * @type {Array}
         */
        this.ignoredLines = ignoredLines || [];
        /**
         * The required comment Istanbul needs in order to ignore the line on the code
         * coverage.
         * @type {String}
         */
        this.ignoreComment = 'istanbul ignore next';
        /**
         * Every time a file is parsed, this property will have the current code.
         * @type {String}
         */
        this.code = '';
        /**
         * This is the method that Jest will receive in order to process the files.
         * @type {Function}
         */
        this.process = this.process.bind(this);
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
     * Prefix a required file line with the Istanbul comment. This method won't return
     * anything, but update the value of `this.code`.
     * @param  {String} line The line to replace.
     */
    ignoreLine(line) {
        if (typeof line === 'string') {
            const regex = new RegExp(this.escapeRegex(line), 'g');
            this.code = this.code.replace(regex, `/* ${this.ignoreComment} */ ${line}`);
        } else {
            this.code = this.code.replace(line, `/* ${this.ignoreComment} */ $1`);
        }
    }
    /**
     * Replace the special paths the tests uses with regular paths. Instead of using
     * relative paths to the root directory, the tests can use paths with the following
     * format `[root directory folder]:[path]`. For example: `../../src/app/...`, you
     * can use `src:app/...`. This feature is currently only supported for the
     * following function:
     * - import
     * - jest.unmock
     * - jest.setMock
     * - require
     * This method won't return anything, but update the value of `this.code`.
     * @param  {String} filepath The path to the file that it's being parsed.
     */
    findSpecialPaths(filepath) {
        const relative = path.relative(path.dirname(filepath), this.rootPath);
        this.code = this.code.replace(
            /import (.*?) from '(.*):(.*)';/ig,
            `import $1 from '${relative}/$2/$3';`
        );

        this.code = this.code.replace(
            /import ({\n(?:[\s\S]*?)}) from '(.*):(.*)';/ig,
            `import $1 from '${relative}/$2/$3';`
        );

        this.code = this.code.replace(
            /jest.unmock\('(.*):(.*)'\);/ig,
            `jest.unmock('${relative}/$1/$2');`
        );

        this.code = this.code.replace(
            /jest.setMock\('(.*):(.*)',/ig,
            `jest.setMock('${relative}/$1/$2',`
        );

        this.code = this.code.replace(
            /require\('(.*):(.*)'\)/ig,
            `require('${relative}/$1/$2')`
        );
    }
    /**
     * Detect Node glob patterns on the calls to `jest.unmock` and replace them with the
     * paths to the actual files.
     * This method won't return anything, but update the value of `this.code`.
     * @param {String} filepath The path to the file that it's being parsed.
     */
    expandUmockGlobs(filepath) {
        const filedir = path.dirname(filepath);
        const regex = /jest.unmock\('(.*?\*.*?)'\)/ig;
        let match = regex.exec(this.code);
        while (match) {
            const globRoot = path.dirname(path.relative(this.rootPath, filepath));
            const globPattern = match[1];
            let globPath = `${globRoot}/${globPattern}`;
            let ignoredList = [];

            if (globPath.indexOf('!') > -1) {
                const globParts = globPath.split('!');
                globPath = globParts[0];
                if (globParts[1]) {
                    ignoredList = globParts[1].split(',');
                }
            }

            let lines = '';
            glob.sync(globPath).forEach(file => {
                if (!ignoredList.filter(value => file.indexOf(value) > -1).length) {
                    const fpath = path.relative(filedir, file);
                    lines += `\njest.unmock('${fpath}');`;
                }
            });

            this.code = this.code.replace(match[0], lines);
            match = regex.exec(this.code);
        }
    }
    /**
     * This is the method Jest receives in order to parse the files.
     * @param  {String} src      The file contents.
     * @param  {String} filename The path to the file.
     * @return {String} The parsed code.
     */
    process(src, filename) {
        if (filename.match(/\.[css|less|scss|png]+$/)) {
            return '';
        }

        this.code = src;
        if (babel.util.canCompile(filename)) {
            this.findSpecialPaths(filename);
            this.expandUmockGlobs(filename);
            this.code = babel.transform(this.code, {
                auxiliaryCommentBefore: ` ${this.ignoreComment} `,
                filename,
                presets: ['es2015',jestPreset],
                retainLines: true,
                plugins: [
                  'transform-runtime',
                  'transform-async-to-generator'
                ]
            }).code;

            if (this.ignoredLines.length) {
                this.ignoredLines.forEach(line => this.ignoreLine(line));
            }
        }

        return this.code;
    }
}
/**
 * Instantiate the preprocessor with a line that is currently causing issues for the
 * coverage.
 * @type {LemuramaMiddlewareJestPreProcessor}
 */
const preProcessor = new LemuramaMiddlewareJestPreProcessor(
    process.env.PROJECT_ROOT || '../..',
    [
        'return obj && obj.__esModule ? obj : { default: obj };',
        /((?:var _this(\d+)? =|return) .*?\.__proto__ \|\| \(\d+, _getPrototypeOf.*?\n)/,
    ]
);
/**
 * Exports the pre processor.
 * @type {Object}
 */
module.exports = {
    process: preProcessor.process,
};
