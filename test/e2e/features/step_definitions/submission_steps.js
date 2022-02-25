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

    /*WHEN*/
    this.When(/^user edits the "(hours|minutes|approved|rejected|tagged|reason)" input with "([^"]*)" value$/, function(field, value, done) {
        switch (field) {
            case 'hours':
                basePage.timeModerateHoursInput.clear();
                basePage.timeModerateHoursInput.sendKeys(value).then(done);
                break;
            case 'minutes':
                basePage.timeModerateMinutesInput.clear();
                basePage.timeModerateMinutesInput.sendKeys(value).then(done);
                break;
            case 'approved':
                basePage.activityApprovedInput.clear();
                basePage.activityApprovedInput.sendKeys(value).then(done);
                break;
            case 'rejected':
                basePage.activityRejectedInput.clear();
                basePage.activityRejectedInput.sendKeys(value).then(done);
                break;
            case 'tagged':
                basePage.activityTaggedInput.clear();
                basePage.activityTaggedInput.sendKeys(value).then(done);
                break;
            case 'reason':
                browser.wait(EC.elementToBeClickable(basePage.activitySubmitReasonInput));
                basePage.activitySubmitReasonInput.click();
                basePage.activitySubmitReasonInput.sendKeys(value).then(done);
                break;
        }
    });

    this.When(/^user confirms submit the work and (switch account|logout)$/, function(option, done) {
        basePage.submitButton.click().then(done);
    });

    this.When(/^user clicks on cancel button$/, function(done) {
        basePage.submissionCancelButton.click().then(done);
    });

    this.When(/^user (pauses|resumes) the timer$/, function (option, done) {
        libraryPage.timeTrackerBtn.click().then(done);
    });

    /*THEN*/
    this.Then(/^the form values match with the counters$/, function(done) {
        browser.wait(EC.visibilityOf(basePage.timeModerateHoursInput));
        basePage.activityApprovedInput.getAttribute('value').then(function(text) {
            expect(parseInt(text)).to.equal(this.approvedAmount);
            return basePage.timeModerateHoursInput.getAttribute('value');
        }.bind(this))
        .then(function(text) {
            expect(parseInt(text)).to.equal(this.moderationHours);
            return basePage.timeModerateMinutesInput.getAttribute('value');
        }.bind(this))
        .then(function(text) {
            expect(parseInt(text)).to.equal(this.moderationMinutes);
            return basePage.activityRejectedInput.getAttribute('value');
        }.bind(this))
        .then(function(text) {
            expect(parseInt(text)).to.equal(this.rejectedAmount);
            return basePage.activityTaggedInput.getAttribute('value');
        }.bind(this))
        .then(function(text) {
            expect(parseInt(text)).to.equal(this.taggedAmount);
        }.bind(this))
        .then(function() {
            done();
        });
    });

    this.Then(/^cancel and submit buttons are "(enabled|disabled)"$/, function(status, done) {
            switch (status) {
                case 'enabled':
                    expect(basePage.submitButton.isEnabled())
                    .to.eventually.be.equal(true).and.notify(done);
                    expect(basePage.submissionCancelButton.isEnabled())
                    .to.eventually.be.equal(true).and.notify(done);
                    break;
                case 'disabled':
                    expect(basePage.submitButton.isEnabled())
                    .to.eventually.be.equal(false).and.notify(done);
                    expect(basePage.submissionCancelButton.isEnabled())
                    .to.eventually.be.equal(false).and.notify(done);
                    break;
            }
        });

    this.Then(/^the reason input field is hidden$/, function(done) {
        expect(basePage.activitySubmitReasonInput.isPresent())
        .to.eventually.be.equal(false, 'Reason input field is visible').and.notify(done);
    });

    this.Then(/^the submit button is (disabled|enabled)$/, function(buttonStatus, done) {
        switch (buttonStatus) {
            case 'disabled':
                expect(basePage.submitButton.isEnabled()).to.eventually.be
                .equal(false, 'The button is still enabled').and.notify(done);
                break;
            case 'enabled':
                expect(basePage.submitButton.isEnabled()).to.eventually.be
                .equal(true, 'The button is not enabled').and.notify(done);
                break;
        }
    });

    this.Then(/^the reason field is displayed empty$/, function(done) {
        expect(basePage.activitySubmitReasonInput.isDisplayed()).to.eventually
        .be.equal(true, 'Reason input field is not visible').and.notify(done);
    });

    this.Then(/^the "([^"]*)" counter value is "([^"]*)"$/, function(counterField, counterValue, done) {
        switch (counterField) {
            case 'approved':
                libraryPage.approveCounter.getText().then(function(text) {
                    expect(parseInt(text)).to.equal(parseInt(counterValue));
                }).then(done);
                break;
            case 'tagged':
                libraryPage.taggedCounter.getText().then(function(text) {
                    expect(parseInt(text)).to.equal(parseInt(counterValue));
                }).then(done);
                break;
            case 'rejected':
                libraryPage.rejectedCounter.getText().then(function(text) {
                    expect(parseInt(text)).to.equal(parseInt(counterValue));
                }).then(done);
                break;
            case 'moderation time':
                libraryPage.moderationTime.getText().then(function(text) {
                    expect(text).to.equal(counterValue);
                }).then(done);
                break;
            default:
                done();
                break;
        }
    });

    this.Then(/^the submission form remains displayed$/, function(done) {
        expect(basePage.submissionModal.isDisplayed()).to.eventually.be.equal(
            true, 'The modal is hidden').and.notify(done);
    });

    this.Then(/^the timer (is paused|is running)$/, function(timerStatus, done) {
        switch (timerStatus) {
            case 'is paused':
                expect(libraryPage.timeTrackerBtn.getAttribute('class')).to.eventually
                    .contain('icon-play', 'invalid expected timer status:' + timerStatus).and.notify(done);
                break;
            case 'resumes':
                expect(libraryPage.timeTrackerBtn.getAttribute('class')).to.eventually
                    .contain('icon-pause', 'invalid expected timer status:' + timerStatus).and.notify(done);
                break;
            default:
                done();
                break;
        }
    });

    this.Then(/^the timer remains paused with the proper values$/, function(done) {
        expect(libraryPage.timeTrackerBtn.getAttribute('class')).to.eventually.contain('icon-play');
        libraryPage.moderationTime.getText().then(function(text) {
            var splitTime = text.split(/[^0-9]/);
            expect(this.moderationHours).to.equal(parseInt(splitTime[0]));
            expect(this.moderationMinutes).to.equal(parseInt(splitTime[3]));
        }.bind(this)).then(function() {
            done();
        });
    });
};
