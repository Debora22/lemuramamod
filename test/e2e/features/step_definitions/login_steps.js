'use strict';

var LoginPage = require('../../pages/LoginPage');
var AccountsPage = require('../../pages/AccountsPage');
var BasePage = require('../../pages/BasePage');

var EC = protractor.ExpectedConditions;
chai.config.truncateThreshold = 0; // disable truncating

module.exports = function() {
    var loginPage;
    var accountsPage;
    var basePage;

    this.Before(function() {
        loginPage = new LoginPage();
        accountsPage = new AccountsPage();
        basePage = new BasePage();
    });

    /*Given*/
    this.Given(/^user is on the login page$/, function(done) {
        loginPage.go();
        browser.driver.wait(EC.presenceOf(loginPage.emailInput));
        browser.wait(loginPage.emailInput.isEnabled());
        done();
    });

    /*When*/
    this.When(/^user sends incorrect access credentials$/, function(done) {
        loginPage.login('invalid@username.com', 'crazy_password').then(done);
    });

    this.When(/^user sends correct access credentials$/, function(done) {
        loginPage.login('lemuramaqa@olapic.com', 'lemurama').then(done);
    });

    this.When(/^the user selects "([^"].*)" account on the list$/, function(accountName, done) {
        accountsPage.accountsList.filter(function(elem) {
            return elem.getText().then(function(text) {
                return text === accountName;
            });
        }).first().click().then(done);
    });

    /*Then*/
    this.Then(/^user is not logged in and an error message is shown$/, function(done) {
        expect(loginPage.loginErrorMsg.isDisplayed()).to.eventually.be.equal(
            true, 'Login error not found');
        expect(loginPage.loginErrorMsg.getText()).
        to.eventually.equal('Hmm, wrong e-mail or password!\nPlease try again.',
         'Error message is not correct').and.notify(done);
    });

    this.Then(/^user is correctly logged in$/, function(done) {
        expect(accountsPage.accountsList.get(0).isDisplayed()).
            to.eventually.be.equal(true, 'The account screen is not present').
            and.notify(done);
    });

    this.Then(/^user logs out$/, function (done) {
        basePage.brandAvatar.click();
        basePage.switchAccountOption.click();
        basePage.switchAccountButton.click();
        accountsPage.logoutButton.click().then(done);
    });
};
