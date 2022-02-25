'use strict';

var TaggingPage = require('../../pages/TaggingPage');
var PremodPage = require('../../pages/PremodPage');
var LibraryPage = require('../../pages/LibraryPage');
var BasePage = require('./../../pages/BasePage.js');
var ModalPage = require('./../../pages/ModalPage.js');
var ModerationPage = require('./../../pages/ModerationPage.js');
chai.config.truncateThreshold = 0;
var EC = protractor.ExpectedConditions;

module.exports = function() {
    var premodPage;
    var taggingPage;
    var libraryPage;
    var basePage;
    var modalPage;
    var moderationPage;

    var approvedCounter = '0';
    var rejectedCounter = '0';
    var taggedCounter = '0';

    this.Before(function() {
        basePage = new BasePage();
        premodPage = new PremodPage();
        taggingPage = new TaggingPage();
        libraryPage = new LibraryPage();
        modalPage = new ModalPage();
        moderationPage = new ModerationPage();
    });

    this.When(/^user perform random moderation actions for "([^"]*)" (minute|minutes)$/, function(timeout, option, done) {
        var startTime = Date.now();
        var endTime = startTime + (timeout * 75 * 1000);

        var actions = [
            this.selectRandomNumberOfImagesForBulkAndApprove,
            this.selectRandomNumberOfImagesForBulkAndSFL,
            this.tagFirstMedia
        ];

        browser.wait(function() {
            var randomIndex = Math.floor(Math.random() * 3);

            return actions[randomIndex]().then(function() {
                return (Date.now() >= endTime);
            });
        }).then(function() {
            done();
        });
    }.bind(this));

    this.Then(/^the counters have increased$/, function(done) {
        var approveCounterPromise = libraryPage.approveCounter.getText();
        var rejectedCounterPromise = libraryPage.rejectedCounter.getText();
        var taggedCounterPromise = libraryPage.taggedCounter.getText();

        Promise.all([
            approveCounterPromise,
            rejectedCounterPromise,
            taggedCounterPromise
        ]).then(function(values) {
            expect((values[0] === approvedCounter) && (values[1] === rejectedCounter)
                && (values[2] === taggedCounter)).to.equal(false, 'The counters have not increased');
            approvedCounter = values[0];
            rejectedCounter = values[1];
            taggedCounter = values[2];
            done();
        });
    });

    this.selectRandomNumberOfImagesForBulkAndApprove = function() {
        return Promise.all([
            this.goToSectionPage('premod'),
            this.selectImagesForBulk(),
            this.approveSelectedAndRejectOthers()
        ]);
    }.bind(this);

    this.selectRandomNumberOfImagesForBulkAndSFL = function() {
        return Promise.all([
            this.goToSectionPage('moderation'),
            this.selectImagesForBulk(),
            this.clickBulkActionBtn(),
            this.clickSFLFromModal()
        ]);
    }.bind(this);

    this.tagFirstMedia = function() {
        return Promise.all([
            this.goToSectionPage('tagging'),
            this.selectMedia(),
            this.searchStreamInTaggingTab(),
            this.selectFirstStreamInList(),
            this.approveInModal(),
            this.closeModal()
        ]);
    }.bind(this);

    this.goToSectionPage = function(section) {
        browser.wait(EC.invisibilityOf(basePage.spinnerLoading));
        var promise;

        switch (section) {
            case 'tagging':
                promise = taggingPage.go();
                break;
            case 'premod':
                promise = premodPage.go();
                break;
            case 'moderation':
                promise = moderationPage.go();
                break;
        }

        return promise;
    };

    this.selectImagesForBulk = function() {
        var randomNumber = (Math.floor(Math.random() * 3) + 3);

        const clicks = [];
        for (var i = 0; i < randomNumber; i++) {
            var elem = libraryPage.libraryBoxImageSelectors.get(i);
            clicks.push(browser.actions().mouseMove(elem).click().perform());
        };
        return Promise.all(clicks);
    };

    this.clickSFLFromModal = function() {
        return modalPage.saveForLaterAction.click();
    };

    this.selectMedia = function() {
        return libraryPage.libraryBoxImage.get(0).click();
    };

    this.searchStreamInTaggingTab = function() {
        return taggingPage.taggingStreamSearch('OlaProd #3');
    };

    this.selectFirstStreamInList = function() {
        return taggingPage.resultItems.first().click();
    };

    this.approveSelectedAndRejectOthers = function() {
        return basePage.approveSelectedRejectOthersBtn.click();
    };

    this.clickBulkActionBtn = function() {
        return browser.wait(libraryPage.bulkActionsBtn.isEnabled()).then(function() {
            return libraryPage.bulkActionsBtn.click();
        });
    };

    this.approveInModal = function() {
        return modalPage.approveAction.click();
    };

    this.closeModal = function() {
        return modalPage.closeModalBtn.click();
    };
};
