'use strict';

var LibraryPage = require('./../../pages/LibraryPage.js');

var EC = protractor.ExpectedConditions;
chai.config.truncateThreshold = 0; // disable truncating

module.exports = function() {
    var libraryPage;

    this.Before(function () {
        libraryPage = new LibraryPage();
    });

    /*THEN*/
    this.Then(/^allowed actions from moderation are displayed on media card "([^"]*)"$/, function (index, done) {
        expect(libraryPage.saveForLaterAction.get(index).isDisplayed()).to.eventually.equal(true);
        expect(libraryPage.rejectAction.get(index).isDisplayed()).to.eventually.equal(true);
        expect(libraryPage.moreOptionsMediaMenu.get(index).isDisplayed()).to.eventually.equal(true).and.notify(done);
    });

    this.Then(/^datetime is displayed on media "([^"]*)"$/, function (index, done) {
        expect(libraryPage.calendarIcons.get(index).isDisplayed()).to.eventually.equal(true).and.notify(done);
    });

    this.Then(/^caption is displayed on media "([^"]*)"$/, function (index, done) {
        expect(libraryPage.captionBoxes.get(index).isDisplayed()).to.eventually.equal(true).and.notify(done);
    });

    this.Then(/^checkbox for bulk actions is "([^"]*)"$/, function (option, done) {
        switch (option) {
            case 'unchecked':
                expect(libraryPage.selectAllBtn.isSelected()).to.eventually.equal(false).and.notify(done);
                break;

            case 'checked':
                expect(libraryPage.selectAllBtn.isSelected()).to.eventually.equal(true).and.notify(done);
                break;
        }
    });

    this.Then(/^bulk actions button is "(enabled|disabled)"$/, function(status, done) {
        switch (status) {
            case 'enabled':
                expect(libraryPage.bulkActionsBtn.isEnabled())
                    .to.eventually.be.equal(true).and.notify(done);
                break;
            case 'disabled':
                expect(libraryPage.bulkActionsBtn.isEnabled())
                    .to.eventually.be.equal(false).and.notify(done);
                break;
        }
    });
}
