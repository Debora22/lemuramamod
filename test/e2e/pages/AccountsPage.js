'use strict';
var AccountsPage = function() {

    /*Mapping element page*/
    this.accountFilter = $('.tool-filter input');
    this.accountsList  = $$('.center-block a');
    this.buttonAccount = $('header .dropdown button');
    this.logoutButton = element(by.className('logout-button'));

    this.go = function() {
        browser.preventBrowserAlert();
        return browser.driver.get(browser.baseUrl + '#/accounts');
    };

    this.getAccount = function() {
        return this.accountsList.first().getText();
    };

    this.selectAccount = function() {
        return this.accountsList.first().click();
    };

    this.getCurrentAccount = function() {
        return this.buttonAccount.getText();
    };
};
module.exports = AccountsPage;
