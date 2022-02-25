'use strict';

var LoginPage = function() {

    /*Mapping element page*/
    this.emailInput = element(by.id('emailInput'));
    this.passwordInput = element(by.id('passwordInput'));
    this.submitButton = element(by.id('loginButton'));
    this.loginErrorMsg = element(by.id('loginErrorMsg'));
    this.forgotPasswordButton = element(by.id('forgotPasswordButton'));
    this.go = function() {
        return browser.driver.get(browser.baseUrl + '#/login');
    };

    this.getAccount = function() {
        this.accountsList.first().getText().then(function(txt) {
            return txt;
        });
    };

    this.logout = function() {
        browser.preventBrowserAlert();
        browser.driver.get(browser.baseUrl + '#/logout');
    };

    this.setCredentials = function(username, password) {
        this.emailInput.sendKeys(username);
        this.passwordInput.sendKeys(password);
    };

    this.submitLogin = function() {
        return this.submitButton.click();
    };

    this.login = function(user, password) {
        this.setCredentials(user, password);
        return this.submitLogin();
    };

    this.selectAccount = function(accountId) {
        element(by.id('account-' + accountId)).click();
    };

};
module.exports = LoginPage;
