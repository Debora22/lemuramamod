'use strict';
var EC = protractor.ExpectedConditions;

var QAPage = function() {


    //Methods
    this.go = function() {
        browser.preventBrowserAlert();
        return browser.driver.get(browser.baseUrl + '#/qa');
    };

};
module.exports = QAPage;