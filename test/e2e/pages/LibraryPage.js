'use strict';

var LibraryPage = function() {

    this.libraryBoxContainer         = element.all(by.css('#library-media .box-container'));
    this.libraryMediaChecked         = element.all(by.css('#library-media .box-container.box-media-checked'));
    this.libraryBoxImage             = element.all(by.css('.box-media-wrapper'));
    this.libraryBoxImageSelectors    = element.all(by.css('.box-media-check'));
    this.confirmationDialogCancelBtn = element(by.css('.angular-notification-btn-cancel'));
    this.confirmationDialog          = element.all(by.css('.modal-confirmation-dialog'));
    this.confirmationDialogBox       = element(by.css('.modal-dialog'));
    this.confirmationDialogUserName  = element(by.css('.modal-user .text-truncated'));
    this.confirmationDialogAcceptBtn = element(by.css('.angular-notification-btn-ok'));
    this.libraryBoxDataMediaUsername = element.all(by.css('[data-media-username]'));
    this.libraryBoxDataMediaId       = element.all(by.css('[data-media-id]'));
    this.modalMediaCloseBtn          = element.all(by.css('#modal-media #modal-button-close'));
    this.aproveAction                = element.all(by.id('action-Approve'));
    this.rejectAction                = element.all(by.id('action-Reject'));
    this.moreOptionsMediaMenu        = element.all(by.id('dLabel'));
    this.dropDownMediaMenuContainer  = element.all(by.css('.dropdown-menu'));
    this.flagAsSpamMenuAction        = element.all(by.id('action-dropdown-block'));
    this.blacklistMenuAction         = element.all(by.id('action-dropdown-blacklist'));
    this.saveForLaterAction          = element.all(by.id('action-Save for Later'));
    this.mediaBoxButtons             = element.all(by.css('#library-media .box-container')).all(by.className('box-header'));
    this.taggedCounter               = element.all(by.css('.header-actions-number')).get(0);
    this.approveCounter              = element.all(by.css('.header-actions-number')).get(1);
    this.rejectedCounter             = element.all(by.css('.header-actions-number')).get(2);
    this.bulkActionsBtn              = element(by.id('btnBulkActions'));
    this.moderationTime              = element(by.className('opTimeTracking_copy_time'));
    this.sendToMQAction              = element.all(by.id('action-Send to moderation queue'));
    this.resultsLabel                = element(by.id('sidebar-total'));
    this.selectAllBtn                = element(by.id('btnSelectAll'));
    this.timeTrackerBtn              = element(by.css('.opTimeTracking_button i'));
    this.calendarIcons               = element.all(by.className('icon-calendar'));
    this.captionBoxes                = element.all(by.className('box-content-container-content-visible'));
    this.canvasElement               = element(by.css('.op-annotable-wrapper canvas'));

    // Methods
    this.openBox = function(index) {
        return this.libraryBoxContainer.get(index).click();
    };
    this.checkLibrarySize = function() {
        return this.libraryBoxContainer.count();
    };

    this.checkHighlightedMediaSize = function() {
        return this.libraryMediaChecked.count();
    };

    this.beforeTestKeyboardNav = function() {
        var _this = this;

        return browser.driver.manage().window().setSize(1700, 1700).then(function() {
            return _this.elements.libraryBoxContainer.first().click();
        }).then(function() {
            return _this.elements.modalMediaCloseBtn.click();
        });
    };

    this.getIdFromMedia = function(index) {
        return this.libraryBoxDataMediaId.get(index).getAttribute('data-media-id');
    };

    this.isMediaPresent = function(index) {
        return element(by.css('[data-media-id="' + index + '"]')).isPresent();
    };

    this.mediaIsNotPresent = function(index) {
        return browser.getPageSource().then(function(source) {
            var isPresent = source.indexOf('data-media-id="' + index + '"');
            return isPresent === -1;
        });
    };

    this.getStreamsByName = function(streamName) {
        return element.all(by.css('[tooltip="' + streamName + '"]'));
    };

    this.getUsername = function(index) {
        return this.libraryBoxDataMediaUsername.get(index).getAttribute('data-media-username');
    };

    this.createHotspot = function (option) {
        switch (option) {
            case "clicking":
                return browser.actions().mouseDown(this.canvasElement).mouseMove({x:100, y:200}).click().perform();
                break;

            case "dragging and dropping":
                var control = this.canvasElement;
                return browser.actions().dragAndDrop(control, {x:75, y:100}).perform();
                break;
        }
    };

};
module.exports = LibraryPage;
