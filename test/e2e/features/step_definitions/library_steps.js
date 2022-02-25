'use strict';

var LoginPage = require('../../pages/LoginPage');
var AccountsPage = require('../../pages/AccountsPage');
var LibraryPage = require('../../pages/LibraryPage');
var BasePage = require('./../../pages/BasePage.js');
var ModalPage = require('./../../pages/ModalPage.js');
var EC = protractor.ExpectedConditions;
chai.config.truncateThreshold = 0; // disable truncating

module.exports = function() {
    var loginPage;
    var accountsPage;
    var libraryPage;
    var basePage;
    var modalPage;

    this.Before(function() {
        loginPage = new LoginPage();
        accountsPage = new AccountsPage();
        libraryPage = new LibraryPage();
        basePage = new BasePage();
        modalPage = new ModalPage();
    });

    this.When(/^the user press the spacebar key over a library media$/, function(done) {
        basePage.pressKey('spacebar').then(done);
    });

    this.Then(/^more options button is not displayed$/, function(done) {
        expect(modalPage.moreOptions.isDisplayed())
            .to.eventually.be.equal(false, 'More options button is visible').and.notify(done);
    });

    this.Then(/^user sees that library is displayed$/, function(done) {
        expect(libraryPage.libraryBoxContainer.get(0).isDisplayed())
            .to.eventually.be.true.and.notify(done);
    });

    this.Then(/^user is redirected to (tagging|moderation|account|login) page$/, function(page, done) {
        switch (page) {
            case 'tagging':
                browser.getCurrentUrl().then(function(actualUrl) {
                    expect(basePage.validateURL(actualUrl, page)).to.be.equal(true);
                    done();
                });
                break;
            case 'moderation':
                browser.getCurrentUrl().then(function(actualUrl) {
                    expect(basePage.validateURL(actualUrl, page)).to.be.equal(true);
                    done();
                });
                break;
            case 'account':
                browser.getCurrentUrl().then(function(actualUrl) {
                    expect(basePage.validateURL(actualUrl, page)).to.be.equal(true);
                    done();
                });
                break;
            case 'login':
                browser.getCurrentUrl().then(function(actualUrl) {
                    expect(basePage.validateURL(actualUrl, page)).to.be.equal(true);
                    done();
                });
                break;
        }
    });
};
