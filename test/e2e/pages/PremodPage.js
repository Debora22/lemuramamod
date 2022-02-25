'use strict';

var PremodPage = function() {

    // Mapping
    this.blacklistButton = element(by.id('btn-blacklist-bulk'));

    // Main Page Getter

    this.go = function() {
        browser.preventBrowserAlert();
        return browser.driver.get(browser.baseUrl + '#/expressmoderation');
    };

};
module.exports = PremodPage;
