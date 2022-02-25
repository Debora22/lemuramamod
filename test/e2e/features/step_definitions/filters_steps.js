'use strict';

var LoginPage = require('../../pages/LoginPage');
var TaggingPage = require('../../pages/TaggingPage');
var PremodPage = require('../../pages/PremodPage');
var LibraryPage = require('../../pages/LibraryPage');
var AccountsPage = require('../../pages/AccountsPage');
var BasePage = require('./../../pages/BasePage.js');
var FiltersPage = require('./../../pages/FiltersPage.js');

var EC = protractor.ExpectedConditions;
chai.config.truncateThreshold = 0; // disable truncating

module.exports = function() {
    var loginPage;
    var premodPage;
    var taggingPage;
    var libraryPage;
    var basePage;
    var accountsPage;
    var filtersPage;

    this.Before(function() {
        loginPage = new LoginPage();
        accountsPage = new AccountsPage();
        basePage = new BasePage();
        premodPage = new PremodPage();
        taggingPage = new TaggingPage();
        libraryPage = new LibraryPage();
        filtersPage = new FiltersPage();
    });

    /*WHEN*/
    this.When(/^user refines media search by selecting the option "([^"]*)" from the filter "([^"]*)"$/, function(option, filter, done) {
        var pattern = /^\d+$/;

        filtersPage.expandFilterByName(filter);
        browser.wait(EC.visibilityOf(filtersPage.filterUncollapsed));
        browser.wait(EC.visibilityOf(libraryPage.libraryBoxImage.get(0)));

        if (pattern.test(option)) {
            var subFilter = filtersPage.getFilterOptionByIndex(filter, option);
            subFilter.getAttribute('id').then(function(id) {
                var value = id.split('filters-option-' + filter.toLowerCase() + '-')[1];
                this.subfilterValue = value;
                subFilter.click();
            }.bind(this)).then(done);
        } else {
            filtersPage.getFilterOptionByName(filter, option).click().then(done);
        }
    });

    /*THEN*/
    this.Then(/^user verifies that results are filtered by "([^"]*)" stream$/, function(stream, done) {
        libraryPage.libraryBoxImage.count().then(function(resultsCount) {
            expect(libraryPage.getStreamsByName(stream).count()).to.eventually.
            equal(resultsCount, 'streams count and media count is not matching').
            and.notify(done);
        });
    });
};
