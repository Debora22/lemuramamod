'use strict';

var LoginPage = require('../../pages/LoginPage');
var AccountsPage = require('../../pages/AccountsPage');
var LibraryPage = require('../../pages/LibraryPage');
var BasePage = require('./../../pages/BasePage.js');
var EC = protractor.ExpectedConditions;
chai.config.truncateThreshold = 0; // disable truncating

module.exports = function() {
    var loginPage;
    var accountsPage;
    var libraryPage;
    var basePage;

    this.Before(function() {
        loginPage = new LoginPage();
        accountsPage = new AccountsPage();
        libraryPage = new LibraryPage();
        basePage = new BasePage();
    });

    this.When(/^user selects the first account$/, function(done) {
        browser.wait(EC.visibilityOf(accountsPage.accountsList));
        accountsPage.selectAccount().then(done);
    });

    this.When(/^user attempts to (Switch Account|Logout|Submit and Switch Account)$/, function(option, done) {
        var approveCounterPromise = libraryPage.approveCounter.getText();
        var rejectedCounterPromise = libraryPage.rejectedCounter.getText();
        var taggedCounterPromise = libraryPage.taggedCounter.getText();
        var moderationTimePromise = libraryPage.moderationTime.getText();

        Promise.all([
            approveCounterPromise,
            rejectedCounterPromise,
            taggedCounterPromise,
            moderationTimePromise
        ]).then(function(values) {
            var splitTime = values[3].split(/[^0-9]/);
            this.approvedAmount = parseInt(values[0]);
            this.rejectedAmount = parseInt(values[1]);
            this.taggedAmount = parseInt(values[2]);
            this.moderationHours = parseInt(splitTime[0]);
            this.moderationMinutes = parseInt(splitTime[3]);
        }.bind(this));

        switch (option) {
            case 'Switch Account':
                basePage.brandAvatar.click();
                basePage.switchAccountOption.click().then(done);
                break;
            case 'Submit and Switch Account':
                basePage.brandAvatar.click();
                basePage.submitAndSwitchAccountSOption.click().then(done);
                break;
            case 'Logout':
                basePage.brandAvatar.click();
                basePage.logOutOption.click().then(done);
                break;
        }
    });

    this.When(/^user confirms switch account before submitting$/, function(done) {
        basePage.switchAccountButton.click().then(done);
    });

    this.When(/^user clicks on cancel button on the switch account modal$/, function(done) {
        basePage.switchAccountCancelButton.click().then(done);
    });

    this.Then(/^cancel and switch account buttons are "(enabled|disabled)"$/, function(status, done) {
        var expectedValue = (status === 'enabled');
        expect(basePage.switchAccountButton.isEnabled()).to.eventually.be.
        equal(expectedValue).and.notify(done);
        expect(basePage.switchAccountCancelButton.isEnabled()).to.eventually.be.
        equal(expectedValue).and.notify(done);
    });
};
