'use strict';

var LoginPage = require('../../pages/LoginPage');
var TaggingPage = require('../../pages/TaggingPage');
var PremodPage = require('../../pages/PremodPage');
var LibraryPage = require('../../pages/LibraryPage');
var AccountsPage = require('../../pages/AccountsPage');
var BasePage = require('./../../pages/BasePage.js');
var FiltersPage = require('./../../pages/FiltersPage.js');
var ModalPage = require('./../../pages/ModalPage.js');

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
    var modalPage;
    var retrievedStreams;

    this.Before(function() {
        loginPage = new LoginPage();
        accountsPage = new AccountsPage();
        basePage = new BasePage();
        premodPage = new PremodPage();
        taggingPage = new TaggingPage();
        libraryPage = new LibraryPage();
        filtersPage = new FiltersPage();
        modalPage = new ModalPage();
    });

    /*WHEN*/
    this.When(/^user search "([^"]*)" stream in the tagging tab$/, function(string, done) {
        taggingPage.taggingStreamSearch(string);
        modalPage.streamInformation.count().then(function (streamSearchResults) {
            this.retrievedStreams = streamSearchResults;
        }.bind(this)).then(function () {
            done();
        });
    });;

    this.When(/^user search "([^"]*)" stream in the hotspot input$/, function(string, done) {
        modalPage.taggingStreamHotspotSearch(string);
        modalPage.streamInformation.count().then(function (streamSearchResults) {
            this.retrievedStreams = streamSearchResults;
        }.bind(this)).then(function () {
            done();
        });
    });

    this.When(/^make sure there are no streams assigned$/, function(done) {
        browser.wait(EC.visibilityOf(taggingPage.modalWrapper));
        browser.wait(EC.invisibilityOf(basePage.spinnerLoading));
        taggingPage.removeAllTaggedStreamsFromMedia().then(done);

    });

    this.When(/^user selects first stream in the stream list result$/, function(done) {
        taggingPage.resultItems.first().click().then(done);
    });

    this.When(/^user clears the search results$/, function(done) {
        taggingPage.clearSearchStreamsResults.click().then(done);
    });

    /*THEN*/

    this.Then(/^the "([^"]*)" stream should be tagged correctly$/, function(taggedProd, done) {
        var textToUpperCase;
        taggedProd = taggedProd.toUpperCase();
        browser.wait(EC.invisibilityOf(taggingPage.emptyTagMessage));
        taggingPage.taggingStreamsCarousel.get(0).getText().then(function(txtToVerify) {
            textToUpperCase = txtToVerify.toUpperCase();
            expect(textToUpperCase).to.contain(taggedProd);
            done();
        });
    });

    this.Then(/^user sees that the tagging suggestions section shows empty$/, function(done) {
        expect(taggingPage.suggestedProductsTitle.isDisplayed()).to.eventually
        .be.equal(true, 'The tagging suggestions ' + 'is not present');
        expect(taggingPage.emptySuggestionMessage.isPresent()).to.eventually
        .equal(true, 'The message is not being displayed').and.notify(done);
    });
};
