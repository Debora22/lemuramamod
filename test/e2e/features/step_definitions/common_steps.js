'use strict';

var LoginPage = require('../../pages/LoginPage');
var TaggingPage = require('../../pages/TaggingPage');
var PremodPage = require('../../pages/PremodPage');
var LibraryPage = require('../../pages/LibraryPage');
var AccountsPage = require('../../pages/AccountsPage');
var BasePage = require('./../../pages/BasePage.js');
var FiltersPage = require('./../../pages/FiltersPage.js');
var ModalPage = require('./../../pages/ModalPage.js');
var ModerationPage = require('./../../pages/ModerationPage.js');
var QAPage = require('./../../pages/QAPage.js')

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
    var moderationPage;
    var qaPage;

    var username;
    var indexPosition;
    var librarySize;
    var approvedMediaInitial;
    var rejectedMediaInitial;
    var taggedMediaInitial;
    var selectedMediaForBulkIds;

    this.Before(function() {
        loginPage = new LoginPage();
        accountsPage = new AccountsPage();
        basePage = new BasePage();
        premodPage = new PremodPage();
        taggingPage = new TaggingPage();
        libraryPage = new LibraryPage();
        filtersPage = new FiltersPage();
        modalPage = new ModalPage();
        moderationPage = new ModerationPage();
        qaPage = new QAPage();
    });
    var conditions = function(condition) {
        switch (condition) {
            case 'be':
                condition = 1;
                break;
            case 'not be':
                condition = 0;
                break;
        }

        return condition;
    };

    /*GIVEN*/
    this.Given(/^user goes to "([^"]*)" page$/, function(section, done) {
        browser.wait(EC.invisibilityOf(basePage.spinnerLoading));
        switch (section) {
            case 'tagging':
                taggingPage.go().then(done);
                break;
            case 'premod':
                premodPage.go().then(done);
                break;
            case 'moderation':
                moderationPage.go().then(done);
                break;
            case 'qa':
                qaPage.go().then(done);
                break;
        }
    });

    /*WHEN*/

    this.When(/^user "([^"]*)" the "([^"]*)" media$/, function(action, position, done) {
        browser.wait(EC.visibilityOf(libraryPage.mediaBoxButtons.get(position)));

        libraryPage.getIdFromMedia(position)
        .then(function(id) {
            selectedMediaForBulkIds = [];
            selectedMediaForBulkIds.push(id);
            return libraryPage.approveCounter.getText();
        })
        .then(function(valueLabel) {
            approvedMediaInitial = parseInt(valueLabel);
            return libraryPage.rejectedCounter.getText();
        })
        .then(function(valueLabel) {
            rejectedMediaInitial = parseInt(valueLabel);
            return libraryPage.taggedCounter.getText();
        })
        .then(function(valueLabel) {
            return taggedMediaInitial = parseInt(valueLabel);
        });

        switch (action) {
            case 'approves':
                libraryPage.aproveAction.get(position).click().then(done);
                break;
            case 'rejects':
                libraryPage.rejectAction.get(position).click().then(done);
                break;
            case 'flags as spam':
                libraryPage.moreOptionsMediaMenu.get(position).click()
                .then(function() {
                    libraryPage.flagAsSpamMenuAction.get(position).click();
                }).then(done);
                break;
            case 'blacklist user of':
                libraryPage.moreOptionsMediaMenu.get(position).click().then(function() {
                    libraryPage.blacklistMenuAction.get(position).click();
                }).then(done);
                break;
            case 'saves for later':
                libraryPage.saveForLaterAction.get(position).click().then(done);
                break;
            case 'sends to MQ':
                libraryPage.sendToMQAction.get(position).click().then(done);
                break;
        }

    });

    this.When(/^user (cancels|confirms) the alert$/, function(option, done) {
        switch(option) {
            case 'confirms':
                libraryPage.confirmationDialogAcceptBtn.click().then(done);
                break;
            case 'cancels':
                libraryPage.confirmationDialogCancelBtn.click().then(done);
                break;
        }
    });

    this.When(/^user scrolls to the bottom$/, function(done) {
        libraryPage.checkLibrarySize().then(function(response) {
            librarySize = response;
            basePage.scrollToBottom();
            done();
        });
    });

    this.When(/^user scrolls to the top/, function(done) {
        libraryPage.checkLibrarySize().then(function(response) {
            librarySize = response;
            basePage.scrollToTop();
            done();
        });
    });

    this.When(/^the user moves between medias using arrows keys$/, function(done) {
        browser.wait(EC.visibilityOf(libraryPage.libraryBoxContainer.get(0)));
        basePage.pressKey('right').then(done);
    });

    this.When(/^user selects "([^"]*)" (photos|photo) for bulk$/,
    function(mediasToSelect, option, done) {
        libraryPage.approveCounter.getText()
        .then(function(valueLabel) {
            approvedMediaInitial = parseInt(valueLabel);
            return libraryPage.rejectedCounter.getText();
        })
        .then(function(valueLabel) {
            rejectedMediaInitial = parseInt(valueLabel);
            return libraryPage.taggedCounter.getText();
        })
        .then(function(valueLabel) {
            return taggedMediaInitial = parseInt(valueLabel);
        })
        .then(function() {
            const clicks = [];
            for (var i = 0; i < mediasToSelect; i++) {
                var elem = libraryPage.libraryBoxImageSelectors.get(i);
                clicks.push(browser.actions().mouseMove(elem).click().perform());
            };
            return Promise.all(clicks);
        }).then(function() {
            selectedMediaForBulkIds = [];
            for (var i = 0; i < mediasToSelect; i++) {
                libraryPage.getIdFromMedia(i).then(function(idOfMedia) {
                    selectedMediaForBulkIds.push(idOfMedia);
                });
            };
        }).then(function() {
            done();
        });
    });

    this.When(/^user selects photo number "([^"]*)"/, function(position, done) {
        username = libraryPage.getUsername(position);

        libraryPage.getIdFromMedia(position)
        .then(function(id) {
            selectedMediaForBulkIds = [];
            selectedMediaForBulkIds.push(id);
            return libraryPage.approveCounter.getText();
        })
        .then(function(valueLabel) {
            approvedMediaInitial = parseInt(valueLabel);
            return libraryPage.rejectedCounter.getText();
        })
        .then(function(valueLabel) {
            rejectedMediaInitial = parseInt(valueLabel);
            return libraryPage.taggedCounter.getText();
        })
        .then(function(valueLabel) {
            taggedMediaInitial = parseInt(valueLabel);
            return libraryPage.libraryBoxImage.get(position).click();
        }).then(done);
    });

    this.When(/^user selects several photos at a time$/, function(done) {
        browser.wait(EC.visibilityOf(libraryPage.libraryBoxContainer.get(0)));
        basePage.pressKey('spacebar');
        basePage.pressKey('right');
        basePage.pressKey('spacebar');
        basePage.pressKey('right').then(done);
    });

    this.When(/^the user clicks on approve selected and reject all other button$/, function(done) {
        basePage.approveSelectedRejectOthersBtn.click().then(done);
    });

    this.When(/^user sorts by (Newest|Oldest)$/, function(state, done) {
        switch (state) {
            case 'Newest':
                moderationPage.orderBySelectorMenu.click();
                moderationPage.clickOrderByOption(state).then(done);
                break;
            case 'Oldest':
                moderationPage.orderBySelectorMenu.click();
                moderationPage.clickOrderByOption(state).then(done);
                break;
        }
    });

    this.When(/^user filters by (Save for Later|Pending) status$/, function(state, done) {
        switch (state) {
            case 'Save for Later':
                moderationPage.sortBySelectorMenu.click();
                moderationPage.clickSortByOption(state).then(done);
                break;
        }
    });

    this.When(/^user searches by (Username) on the search box$/, function(parameter, done) {
        switch (parameter) {
            case 'Username':
                browser.wait(EC.visibilityOf(libraryPage.libraryBoxContainer.get(0)));
                moderationPage.searchBy(username);
                moderationPage.suggestionList.first().click().then(done);
                break;
        }
    });

    this.When(/^the user clicks on flag as spam button$/, function(done) {
        basePage.flagAsSpamBulkBtn.click().then(done);
    });

    this.When(/^user clicks on bulk actions button$/, function(done) {
        libraryPage.bulkActionsBtn.click().then(done);
    });

    this.When(/^there is media available on (moderation|save for later|tagging|qa|premod) page$/, function(page, done) {
        switch (page) {
            case 'moderation':
                validateMediaOnPending();
                done();
                break;
            case 'save for later':
                validateMediaOnSFL();
                validateSessionNotRestored(done);
                done();
                break;
            case 'tagging':
                validateMediaOnTagging();
                validateSessionNotRestored(done);
                done();
                break;
            case 'qa':
                validateMediaOnQA();
                validateSessionNotRestored(done);
                done();
                break;
            case 'premod':
                validateMediaOnPremd();
                done();
                break;
        }
    });

    this.When(/^user clicks on Select All button$/, function(done) {
        libraryPage.selectAllBtn.click().then(done);
    });

    this.When(/^user clicks on (More Options) button of media "([^"]*)"$/, function(option, position, done) {
        switch (option) {
            case 'More Options':
                libraryPage.moreOptionsMediaMenu.get(position).click().then(done);
                break;
        }
    });

    this.When(/^the user selects media till "([^"]*)" are selected$/, function(mediasToSelect, done) {
        libraryPage.checkHighlightedMediaSize().then(function(amount) {
            if (parseInt(mediasToSelect) > amount) {
                var toSelect = parseInt(mediasToSelect) - amount;
                const clicks = [];
                for (var i = 0; i < toSelect; i++) {
                    var elem = libraryPage.libraryBoxImageSelectors.get(amount + i);
                    clicks.push(browser.actions().mouseMove(elem).click().perform());
                };
                return Promise.all(clicks);
            }
        }).then(function() {
            done();
        });
    });

    this.When(/^user makes sure the session is not restored$/, function (done) {
        validateSessionNotRestored(done);
    });

    this.Then(/^the user should see that media is "([^"]*)"$/, function(status, done) {
        browser.sleep(500);
        var stat;
        switch (status) {
            case 'highlighted':
                stat = 'box-media-active';
                break;
            case 'selected':
                stat = 'box-media-checked';
                break;
        }

        expect(libraryPage.libraryBoxContainer.get(1).getAttribute('class')).
            to.eventually.contain(stat).and.notify(done);
    });

    this.Then(/^the library should have more photos loaded$/, function(done) {
        browser.wait(EC.invisibilityOf(basePage.spinnerLoading));
        libraryPage.checkLibrarySize().then(function(response) {
            expect(response).to.be.above(librarySize);
            done();
        });
    });

    this.Then(/^user verifies an initial set of pics is displayed$/, function(done) {
        libraryPage.checkLibrarySize().then(function(response) {
            expect(response).to.be.above(1);
            done();
        });
    });

    this.Then(/^all available media are selected$/, function(done) {
        this.selectedMedia = 0;

        libraryPage.libraryBoxContainer.each(function(media) {
            expect(media.getAttribute('class')).to.eventually.contain('box-media-checked');
            this.selectedMedia++;
        }.bind(this));
        done();
    });

    this.Then(/^the "([^"]*)" should show$/, function(ele, done) {
        var elementsToValidate = basePage.elementsSelector(ele);
        elementsToValidate.count().then(function(count) {
            expect(count).to.equal(1);
            done();
        });
    });

    this.Then(/^user should see the "([^"]*)"$/, function(notificationType, done) {
        basePage.checkGrowlNotification(notificationType).then(function(notification) {
            expect(notification.isPresent).to.equal(true, 'The ' + element + ' is not being shown');
            done();
        });
    });

    this.Then(/^the confirmation modal should reads "([^"]*)"$/, function(text, done) {
        basePage.confirmationDialogBox.getText().then(function(value) {
            expect(value).to.equal(text, 'The dialog message is incorrect');
        }).then(done);
    });

    this.Then(/^user "([^"]*)" streams on the "([^"]*)" media$/, function(visibility, position, done) {
        var textMediaId = libraryPage.getIdFromMedia(position);
        switch (visibility) {
            case 'sees':
                textMediaId.then(function(id) {
                    var streamElements = taggingPage.getElementFromBoxCarousel(id);
                    expect(streamElements.count()).to.eventually.be.at.least(
                        1, 'The stream/s were/was not added to the media').and.notify(done);
                });
                break;
            case 'does not sees':
                textMediaId.then(function(id) {
                    var streamElements = taggingPage.getElementFromBoxCarousel(id);
                    expect(streamElements.count()).to.eventually.equal(
                        0, 'The stream/s were/was not delete from the media').and.notify(done);
                });
                break;
        }

    });

    this.Then(/^"(approved|rejected|tagged)" counter is increased on "([^"]*)"$/, function(counter,value,done) {
        var amount;
        var value = parseInt(value);
        approvedMediaInitial = 0;
        rejectedMediaInitial = 0;
        taggedMediaInitial = 0;
        switch (counter) {
            case 'approved':
                libraryPage.approveCounter.getText().then(function(text) {
                    expect(parseInt(text)).to.equal(approvedMediaInitial + value,
                         'approved counter is not icreased');
                    done();
                });
                break;
            case 'rejected':
                libraryPage.rejectedCounter.getText().then(function(text) {
                    expect(parseInt(text)).to.equal(rejectedMediaInitial + value,
                        'approved counter is not icreased');
                    done();
                });
                break;
            case 'tagged':
                libraryPage.taggedCounter.getText().then(function(text) {
                    expect(parseInt(text)).to.equal(taggedMediaInitial + value,
                        'tagged counter is not increased');
                    done();
                });
                break;
        }
    });

    this.Then(/^media should( not)? be on the media list$/, function(negate, done) {
        var selectedMediaIdsPromises = [];
        selectedMediaForBulkIds.forEach(function(selectedMediaForBulkId) {
            var mediaIsPresent = ((negate) ? libraryPage.mediaIsNotPresent(
                selectedMediaForBulkId) : libraryPage.isMediaPresent(
                    selectedMediaForBulkId));
            selectedMediaIdsPromises.push(expect(mediaIsPresent).to.eventually.equal(
                        true, 'Media is not present on the media list'));
        });
        Promise.all(selectedMediaIdsPromises).then(function() {
            done();
        });
    });

    this.Then(/^(flag as spam) option is displayed for media "([^"]*)"$/, function(option, position, done) {
        switch (option) {
            case 'flag as spam':
                expect(libraryPage.flagAsSpamMenuAction.get(position).isDisplayed())
                    .to.eventually.equal(true).and.notify(done);
                break;
        }
    });

    /*Private Functions*/
    function validateSessionNotRestored (done) {
        // Implicit wait is the default time that protractor waits before passing or throwing an error for an action
        browser.manage().timeouts().implicitlyWait(1000);
        browser.isElementPresent(basePage.restoredSessionModal).then(function (value) {
            if(value){
                basePage.restoredSessionOkBtn.click();
                basePage.brandAvatar.click();
                basePage.switchAccountOption.click();
                basePage.switchAccountButton.click();
                accountsPage.logoutButton.click();
                loginPage.login('lemuramaqa@olapic.com', 'lemurama');
                accountsPage.accountsList.filter(function(elem) {
                    return elem.getText().then(function(text) {
                        return text === 'enforcersqa';
                    });
                }).first().click().then(done);
            }
            else{
                done();
            }
        });
    }

    function validateMediaOnPending () {
        browser.wait(EC.visibilityOf(libraryPage.resultsLabel));
        libraryPage.resultsLabel.getText().then(function(value) {
            var amount = value.substr(value.indexOf('Results:') + 9);
            if (parseInt(amount, 10) < 40) {
                return Promise.all([
                    moderationPage.sortBySelectorMenu.click(),
                    moderationPage.clickSortByOption('Save for Later'),
                    libraryPage.selectAllBtn.click(),
                    libraryPage.bulkActionsBtn.click(),
                    libraryPage.sendToMQAction.get(0).click(),
                    libraryPage.confirmationDialogAcceptBtn.click(),
                    moderationPage.sortBySelectorMenu.click(),
                    moderationPage.clickSortByOption('Pending')]);
            }
            return true;
        });
    }

    function validateMediaOnPremd () {
        browser.wait(EC.visibilityOf(libraryPage.resultsLabel));
        libraryPage.resultsLabel.getText().then(function(value) {
            var amount = value.substr(value.indexOf('Results:') + 9);
            if (parseInt(amount, 10) > 0) {
               return true;
            }
        });
    }


    function validateMediaOnSFL () {
        browser.wait(EC.visibilityOf(libraryPage.resultsLabel));
        libraryPage.resultsLabel.getText().then(function(value) {
            var amount = value.substr(value.indexOf('Results:') + 9);
            if (parseInt(amount, 10) < 40) {
                return Promise.all([
                    moderationPage.sortBySelectorMenu.click(),
                    moderationPage.clickSortByOption('Pending'),
                    libraryPage.selectAllBtn.click(),
                    libraryPage.bulkActionsBtn.click(),
                    libraryPage.saveForLaterAction.get(0).click(),
                    libraryPage.confirmationDialogAcceptBtn.click(),
                    loginPage.logout(),
                    loginPage.login('lemuramaqa@olapic.com','lemurama'),
                    loginPage.selectAccount('218020'),
                    moderationPage.go(),
                    moderationPage.sortBySelectorMenu.click(),
                    moderationPage.clickSortByOption('Save for Later')]);
            }
            return true;
        });
    }

    function validateMediaOnTagging () {
        browser.wait(EC.visibilityOf(libraryPage.resultsLabel));
        libraryPage.resultsLabel.getText().then(function(value) {
            var amount = value.substr(value.indexOf('Results:') + 9);
            if (parseInt(amount, 10) < 40) {
                return Promise.all([
                    premodPage.go().then(function () {
                        const clicks = [];
                        for (var i = 0; i < 25; i++) {
                            var elem = libraryPage.libraryBoxImageSelectors.get(i);
                            clicks.push(browser.actions().mouseMove(elem).click().perform());
                        }
                        return Promise.all(clicks);
                    }),
                    basePage.approveSelectedRejectOthersBtn.click(),
                    loginPage.logout(),
                    loginPage.login('lemuramaqa@olapic.com','lemurama'),
                    loginPage.selectAccount('218020')])
            }
            return true;
        });
    }

    function validateMediaOnQA () {
        browser.wait(EC.visibilityOf(libraryPage.resultsLabel));
        libraryPage.resultsLabel.getText().then(function(value) {
            var amount = value.substr(value.indexOf('Results:') + 9);
            if (parseInt(amount, 10) < 40) {
                return Promise.all([
                    taggingPage.go(),
                    libraryPage.selectAllBtn.click(),
                    libraryPage.bulkActionsBtn.click(),
                    modalPage.approveAction.click(),
                    loginPage.logout(),
                    loginPage.login('lemuramaqa@olapic.com','lemurama'),
                    loginPage.selectAccount('218020')])
            }
            return true;
        });
    }
};
