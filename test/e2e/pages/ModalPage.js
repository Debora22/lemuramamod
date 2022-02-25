'use strict';
var ModalPage  = function() {
    this.approveAction = element(by.css('.modal-media-header .icon-check'));
    this.rejectAction = element(by.css('.modal-media-header .icon-bin'));
    this.moreOptions = element(by.css('.modal-media-header .icon-more'));
    this.blacklistAction = element(by.css('.modal-media-header .icon-blacklist'));
    this.modalNextArrow = element(by.id('modal-button-next'));
    this.modalPrevArrow = element(by.id('modal-button-prev'));
    this.closeModalBtn = element(by.id('modal-button-close'));
    this.previewMedia = element(by.id('modal-media'));
    this.saveForLaterAction = element(by.css('.modal-media-header .icon-time'));
    this.sendToMQBtn = element.all(by.className('icon-arrow_left')).get(0);
    this.modalHeader = element(by.className('modal-header'));
    this.modalCaption = element(by.className('modal-media-content'));
    this.modalMedia = element(by.id('modal-media-single'));
    this.modalListOfMedias = element.all(by.css('.modal-media-list li'));
    this.modalListOfCloseButtons = element.all(by.css('.modal-media-list li i'));
    this.streamInformation = element.all(by.className('modal-tags-search-box'));
    this.loadMoreBtn = element(by.className('load-more-tagging'));
    this.flagAsSpamAction = element.all(by.id('action-dropdown-block')).first();
    this.addHotspotTooltip = element(by.className('op-annotable-destination-indicator-tooltip'));
    this.annotableSearchStreamInput  = element(by.id('op-annotable-search-stream'));
    this.modalZoomButton = element(by.className('modal-zoom-button'));
    this.hotspots = element.all(by.css('div.op-annotable-wrapper input'));

    this.checkModalMediaListSize = function() {
        return this.modalListOfMedias.count();
    };

    this.taggingStreamHotspotSearch = function(stream) {
        return this.annotableSearchStreamInput.sendKeys(stream);
    };

    this.checkModalMediaListCloseButtonsSize = function() {
        return this.modalListOfCloseButtons.count();
    };

    this.returnHref = function(element) {
        return element.getAttribute('href').then(function(href) {
            return href;
        });
    };

    this.zoomButtonStatus = function (status) {
        return (modalPage.modalZoomButton.getAttribute('class'));
    }

};
module.exports = ModalPage;
