'use strict';

var BasePage  = function() {
    // Mapping elements
    //Dialogs
    this.confirmationDialog = element.all(by.css('.modal-confirmation-dialog'));
    this.confirmationDialogBox = element(by.css('.modal-dialog .modal-content .modal-body'));
    this.acceptConfirmationDialog = element(by.css('.angular-notification-btn-ok'));
    this.successNotification = element.all(by.css('.cg-notify-message.alert-success.cg-notify-message-right'));
    this.errorNotification = element.all(by.css('.cg-notify-message.alert-danger.cg-notify-message-right'));
    this.notification = element(by.className('cg-notify-message'));
    this.restoredSessionModal = element(by.className('modal fade modal-confirmation-dialog in'));
    this.restoredSessionOkBtn = element(by.className('btn btn-sm btn-primary angular-notification-btn-ok'));

    //library
    this.boxContainer = element.all(by.css('#library-media .box-container'));
    this.mediaLibrary = element(by.id('library-media'));
    this.boxDataMediaId = element.all(by.css('[data-media-id]'));

    //tagging
    this.streamsCarousel = element.all(by.css('#TaggingService .tags-container'));
    this.taggedItems = element.all(by.css('.tags-container .modal-current-tag-box-thumbnail'));
    this.resultItems = element.all(by.css('#search-stream-result-list .modal-tags-search-box .modal-tag-search-box-thumbnail'));

    //filters
    this.panel = element.all(by.css('#filters-accordion .panel-group'));

    //premod
    this.approveSelectedRejectOthersBtn = element(by.id('btn-approve-selected-reject-others'));
    this.flagAsSpamBulkBtn = element(by.id('btn-report-spam'));

    //switch account and log out
    this.brandAvatar = element(by.className('header-customer-avatar'));
    this.logOutOption = element(by.className('dropdown-menu-logout'));
    this.submitAndSwitchAccountSOption = element(by.className('dropdown-menu-switch-account'));
    this.switchAccountOption = element(by.id('idSwitchAccountWithoutSubmit'));

    //spinner
    this.spinnerLoading = element(by.css('.spinner-loading'));

    // Switch account modal
    this.switchAccountButton = element(by.id('idSwitchAccountWithoutSubmitButton'));
    this.switchAccountCancelButton = element(by.id('idSwitchAccountWithoutSubmitCancelButton'));

    // Submission modal
    this.activityApprovedInput = element(by.id('activityApprovedValue'));
    this.activityRejectedInput = element(by.id('activityDeletedValue'));
    this.activityTaggedInput = element(by.id('activityTaggedValue'));
    this.activitySubmitReasonInput = element(by.id('activitySubmitReason'));
    this.submissionCancelButton = element(by.id('btnActivityCancel'));
    this.submitButton = element(by.id('btnActivitySubmit'));
    this.timeModerateHoursInput = element(by.id('timeModeratedHoursValue'));
    this.timeModerateMinutesInput = element(by.id('timeModeratedMinutesValue'));
    this.submissionModal = element(by.className('modal-content'));

    this.elementsSelector = function(element) {
        switch (element) {
            case 'library':
            case 'media box':
            case 'stream carousel in the box':
            case 'media list':
                element = this.boxContainer;
                break;
            case 'list in the tagging tab':
            case 'tagging':
                element = this.resultItems;
                break;
            case 'stream carousel in the tagging tab':
                element = this.taggedItems;
                break;
            case 'list of filters':
                element = this.panel;
                break;
            case 'media library':
                element = this.mediaLibrary;
                break;
            case 'Approve selected and reject all others':
                element = this.approveSelectedRejectOthersBtn;
                break;
            case 'close modal':
                element = this.closeModalBtn;
                break;
            case 'confirm alert':
                element = this.acceptConfirmationDialog;
                break;
            case 'success notification':
                element = this.successNotification;
                break;
            case 'error notification':
                element = this.errorNotification;
                break;
            case 'confirmation alert':
                element = this.confirmationDialog;
                break;
        }

        return element;
    };

    // Methods

    this.findStreamInElement = function(name, condition, index, element) {

        var selector = 'li[tooltip="{name}"]';
        switch (element) {
            case 'stream carousel in the tagging tab':
                element = this.streamsCarousel;
                index = 0;
                selector = 'em[text="{name}"]';
                break;
            default:
                element = this.elementsSelector(element);
                break;
        }

        return element.get(index).then(function(elem) {
            return elem.all(by.css(selector.replace('{name}', name))).count();
        });
    };

    this.selectElement = function(index, element) {
        element = this.elementsSelector(element);

        return element.get(index).then(function(elem) {
            var elemId = elem.getAttribute('id');
            elem.click();
            return elemId;
        });
    };

    this.scrollToBottom = function() {
        browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
    };

    this.scrollToTop = function() {
        browser.executeScript('window.scrollTo(0,0);');
    };

    this.pressKey = function(key) {
        switch (key) {
            case 'spacebar':
                return browser.actions().sendKeys(protractor.Key.SPACE).perform();
                break;
            case 'right':
                return browser.actions().sendKeys(protractor.Key.ARROW_RIGHT).perform();
                break;
        }
    };

    this.validateURL = function(current,page) {
        if (current.match('\(.*\)' + page)) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * Returns T/F if an elements has certain CSS class.
     * @param element
     * @param cls
     * @returns {*}
     */
    this.hasClass = function(element, cls) {
        return element.getAttribute('class').then(function(classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    };

    /**
     * This method verifies Growl Notifications returning it presence status and text
     * Since Growl Notifications use $timeout (which is used by Protractor to syncronize with Angular sites)
     * it is necessary to disable the syncronization (using isAngularSite(false)) while waiting for the notification
     * to appear
     * @param notification
     * @returns notificationObject
     */
    this.checkGrowlNotification = function(notification) {
        var notificationElement = this.elementsSelector(notification);
        // Object to be returned containing the presence status and text (if present) of the notification
        var notificationObject = {
            isPresent: false,
            text: ''
        };
        // Ignores Angular syncronization so we can test the growl notification which use $timeout and $http
        // (variables used by Protractor to syncronize with Angular sites)
        isAngularSite(false);
        // Checks during 12 seconds if the growl notifications is present
        return browser.wait(function() {
            return notificationElement.first().isPresent();
        }, 12000).then(function(elementPresent) {
            notificationElement.all(by.css('div')).first().getText().then(function(notificationText) {
                notificationObject.text = notificationText;
            });
            notificationObject.isPresent = elementPresent;
            // Restores Angular syncronization after getting notification presence status and text
            isAngularSite(true);
            return notificationObject;
        }, function() {
            // Restores Angular syncronization when wait´s timeout expires
            isAngularSite(true);
            return notificationObject;
        });
    };
};

module.exports = BasePage;
