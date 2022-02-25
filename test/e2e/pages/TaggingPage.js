'use strict';
var EC = protractor.ExpectedConditions;

var TaggingPage = function() {
    //Mapping elements
    this.modalWrapper = element(by.css('.modal-wrapper'));
    this.searchInput =  element(by.id('search-stream'));
    this.loadingItems = element.all(by.css('[ng-show="loading"]'));
    this.resultItems =  element.all(by.repeater('item in results'));
    this.taggingStreamsCarousel =  element.all(by.css('#TaggingService .tags-container'));
    this.tagBoxRemove =  element.all(by.css('#TaggingService .tags-container .modal-current-tag-box-remove'));
    this.emptyTagMessage = element(by.css('[ng-show="!entities.length"]'));
    this.boxCarousel = element.all(by.repeater('item in carousel'));
    this.streamsCarousel = element.all(by.css('#TaggingService .tags-container'));
    this.taggedItems = element.all(by.css('.tags-container .modal-current-tag-box-thumbnail'));
    this.resultItems = element.all
    (by.css('#search-stream-result-list .modal-tags-search-box .modal-tag-search-box-thumbnail'));
    this.modalImage = element(by.css('.modal-img'));
    this.suggestedProductsTitle = element(by.className('suggested-products-wrapper'));
    this.emptySuggestionMessage = element(by.css('div.modal-empty'));
    this.clearSearchStreamsResults = element(by.css('.clear-search .icon-circle-delete'));
    this.streamsTaggedInTheModal = element.all(by.css('.tags-container h5'));
    this.taggedStreamsCarouselModal = element.all(by.css('#TaggingService .tags-container li'));

    // Main Page Getter
    this.go = function() {
        browser.preventBrowserAlert();
        return browser.driver.get(browser.baseUrl + '#/tagging');
    };

    this.taggingStreamSearch = function(stream) {
        return this.searchInput.sendKeys(stream);
    };

    this.updateTagBoxRemoveReferences = function() {
        this.tagBoxRemove = element.all(by.css('#TaggingService .tags-container .modal-current-tag-box-remove'));
    };

    this.removeAllTaggedStreamsFromMedia = function() {
        this.updateTagBoxRemoveReferences();
        return this.tagBoxRemove.count().then(function(response) {
            if (response) {
                for (var i = 0; i < response; i++) {
                    browser.wait(EC.invisibilityOf(element(by.css('.spinner-loading'))));
                    this.tagBoxRemove.first().click();
                    this.updateTagBoxRemoveReferences();
                }
            }
        }.bind(this));
    };

    this.getElementFromBoxCarousel = function(id) {
        return this.itemsInBoxCarousel = element.all
        (by.css('#box-' + id + ' > div:nth-child(4) > div:nth-child(1) li'));
    };

};
module.exports = TaggingPage;
