'use strict';

var PremodPage = require('../../pages/PremodPage');
var LibraryPage = require('../../pages/LibraryPage');
var BasePage = require('./../../pages/BasePage.js');
var ModalPage = require('./../../pages/ModalPage.js');
var TaggingPage = require('./../../pages/TaggingPage.js');

var EC = protractor.ExpectedConditions;
chai.config.truncateThreshold = 0; // disable truncating

module.exports = function() {
    var premodPage;
    var libraryPage;
    var modalPage;
    var basePage;
    var retrievedStreams;
    var taggingPage;

    this.Before(function () {
        basePage = new BasePage();
        premodPage = new PremodPage();
        libraryPage = new LibraryPage();
        modalPage = new ModalPage();
        taggingPage = new TaggingPage();
    });

    /*WHEN*/
    this.When(/^user clicks on (Next|More|Prev|Approve|Reject|Spam|Blacklist|SFL|Send to MQ) button from the modal$/, function (option, done) {
        switch (option) {
            case 'Next':
                this.actualMediaHref = modalPage.returnHref(modalPage.modalMedia);
                modalPage.modalNextArrow.click().then(done);
                break;
            case 'Prev':
                this.actualMediaHref = modalPage.returnHref(modalPage.modalMedia);
                modalPage.modalPrevArrow.click().then(done);
                break;
            case 'Approve':
                modalPage.approveAction.click().then(done);
                break;
            case 'Reject':
                browser.wait(EC.visibilityOf(modalPage.rejectAction));
                modalPage.rejectAction.click().then(done);
                break;
            case 'More':
                modalPage.moreOptions.click().then(done);
                break;
            case 'Blacklist':
                modalPage.blacklistAction.click().then(done);
                break;
            case 'Spam':
                modalPage.flagAsSpamAction.click().then(done);
                break;
            case 'SFL':
                modalPage.saveForLaterAction.click().then(done);
                break;
            case 'Send to MQ':
                modalPage.sendToMQBtn.click().then(done);
                break;
        }
    });

    this.When(/^user closes the modal$/, function (done) {
        modalPage.closeModalBtn.click().then(done);
    });

    this.When(/^user clicks on (zoom in|zoom out) button$/, function (option, done) {
        modalPage.modalZoomButton.click().then(done);
    });

    this.When(/^user clicks on More button at the bottom of the page$/, function (done) {
        browser.executeScript('window.scrollTo(0,0);');
        browser.wait(EC.visibilityOf(modalPage.loadMoreBtn));
        modalPage.loadMoreBtn.click().then(done);
    });

    this.When(/^user removes the stream "([^"]*)"$/, function (streamToRemove, done) {
        taggingPage.streamsTaggedInTheModal.each(function (element, index) {
            element.getText().then(function (text) {
                if (text.toLowerCase() === streamToRemove.toLowerCase()) {
                    taggingPage.tagBoxRemove.get(index).click();
                }
            });
        }).then(function () {
            done();
        });
    });

    this.When(/^user creates a hotspot by (clicking|dragging and dropping) on the pic$/, function (option, done) {
        libraryPage.createHotspot(option).then(done);
    });

    /*THEN*/
    this.Then(/^edit media box should open$/, function (done) {
        expect(modalPage.previewMedia.isDisplayed()).to.eventually.be.true.and.notify(done);
    });

    this.Then(/^a different photo from the line is displayed$/, function (done) {
        modalPage.returnHref(modalPage.modalMedia).then(function (href) {
            expect(this.actualMediaHref).to.not.equal(href).and.notify(done);
        }.bind(this));
    });

    this.Then(/^the title Edit Media is displayed on the modal$/, function (done) {
        expect(modalPage.modalHeader.getText()).to.eventually.contain('Edit Media').and.notify(done);
    });

    this.Then(/^available actions are displayed$/, function (done) {
        expect(modalPage.approveAction.isDisplayed()).to.eventually.equal(true);
        expect(modalPage.rejectAction.isDisplayed()).to.eventually.equal(true).and.notify(done);
    });

    this.Then(/^send to MQ option is displayed$/, function (done) {
        expect(modalPage.sendToMQBtn.isDisplayed()).to.eventually.equal(true).and.notify(done);
    });

    this.Then(/^more options actions are displayed$/, function (done) {
        expect(modalPage.moreOptions.isDisplayed()).to.eventually.equal(true);
        modalPage.moreOptions.click();
        expect(modalPage.flagAsSpamAction.isDisplayed()).to.eventually.equal(true);
        expect(modalPage.blacklistAction.isDisplayed()).to.eventually.equal(true).and.notify(done);
    });

    this.Then(/^arrows are visible$/, function (done) {
        expect(modalPage.modalNextArrow.isDisplayed()).to.eventually.equal(true);
        expect(modalPage.modalPrevArrow.isDisplayed()).to.eventually.equal(true).and.notify(done);
    });

    this.Then(/^X button is visible$/, function (done) {
        expect(modalPage.closeModalBtn.isDisplayed()).to.eventually.equal(true).and.notify(done);
    });

    this.Then(/^media caption is displayed$/, function (done) {
        expect(modalPage.modalCaption.isDisplayed()).to.eventually.equal(true).and.notify(done);
    });

    this.Then(/^the stream information is retrieved$/, function (done) {
        expect(modalPage.streamInformation.get(0).isDisplayed()).to.eventually.equal(true).and.notify(done);
    });

    this.Then(/^more streams are retrieved$/, function (done) {
        modalPage.streamInformation.count().then(function (totalStreamsAmount) {
            expect(totalStreamsAmount).to.be.at.least(this.retrievedStreams);
        }.bind(this)).then(function () {
            done();
        });
    });

    this.Then(/^the streams tagged to the media on the modal are "([^"]*)"$/, function (streams, done) {
        var splitStreams = streams.split(',');
        taggingPage.streamsTaggedInTheModal.each(function (element, index) {
            element.getText().then(function (text) {
                for (var i = 0; i < splitStreams.length; i++) {
                    expect(taggingPage.streamsTaggedInTheModal.get(i).getText()).to.eventually.equal(splitStreams[i]);
                    break;
                }
            });
        }).then(function () {
            done();
        });
    });

    this.Then(/^user does not see the stream "([^"]*)" in the modal$/, function (streamName, done) {
        taggingPage.streamsTaggedInTheModal.count().then(function (value) {
            if(value > 0) {
                taggingPage.streamsTaggedInTheModal.each(function (element, index) {
                    element.getText().then(function (text) {
                        expect(text.toLowerCase()).to.not.equal(streamName.toLowerCase());
                    });
                });
                done();
            }
            else {
                done();
            }
        });
    });

    this.Then(/^the media found should match the username filter criteria$/, function (done) {
        libraryPage.confirmationDialogUserName.getText().then(function (text) {
            expect(text.toLowerCase()).to.contain(this.subfilterValue);
        }.bind(this)).then(done);
    });

    this.Then(/^all medias are displayed on the left panel with an 'x' button in order to remove them$/, function (done) {
        modalPage.checkModalMediaListSize().then(function (amount) {
            expect(this.selectedMedia).to.equal(amount);
            expect(modalPage.checkModalMediaListCloseButtonsSize()).to.eventually.equal(amount);
            done();
        }.bind(this));
    });

    this.Then(/^the (zoom in|zoom out) button is displayed$/, function (buttonAction, done) {
        switch (buttonAction) {
            case 'zoom in':
                expect(basePage.hasClass(modalPage.modalZoomButton, 'modal-zoom-in-button')).to.eventually.equal(true)
                    .and.notify(done);
                break;
            case 'zoom out':
                expect(basePage.hasClass(modalPage.modalZoomButton, 'modal-zoom-out-button')).to.eventually.equal(true)
                    .and.notify(done);
                break;
        }
    });

    this.Then(/^the stream "([^"]*)" is visible in search input$/, function (streamName, done) {
        taggingPage.searchInput.getAttribute('value').then(function (text) {
            expect(streamName).to.equal(text);
            done();
        });
    });

    this.Then(/^user sees hotspots created for stream "([^"]*)"$/, function (streamName, done) {
        var splitStreams = streamName.split(',');
        var streamIds = [];
        var arrayPromises = [];
        var hotspotsids = [];

        taggingPage.streamsTaggedInTheModal.each(function (element, index) {
            arrayPromises.push(element.getText().then(function (text) {
                return taggingPage.taggedStreamsCarouselModal.get(index).getAttribute('data-stream-id').then(function (id) {
                    streamIds.push(id);
                });
                return null;
            }));
        }).then(function () {
            Promise.all(arrayPromises).then(function () {
                arrayPromises = [];
                modalPage.hotspots.each(function (element, index) {
                    arrayPromises.push(element.getAttribute('id').then(function (hotspotid) {
                        hotspotsids.push(hotspotid);
                    }));
                }).then(function () {
                    Promise.all(arrayPromises).then(function () {
                        arrayPromises = [];
                        for (var i = 0; i < streamIds.length; i++) {
                            if (hotspotsids.indexOf('hotspot-' + streamIds[i] > 0)) {
                                arrayPromises.push(hotspotsids.indexOf('hotspot-' + streamIds[i]));
                            }
                        }
                        Promise.all(arrayPromises).then(function () {
                            expect(arrayPromises.length).to.be.above(0, 'no matches');
                            done();
                        });
                    });
                });
            });
        });
    });
}
