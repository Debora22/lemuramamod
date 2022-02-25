'use strict';
var EC = protractor.ExpectedConditions;

var ModerationPage = function() {

    this.sortBySelectorMenu = element.all(by.css('.btn.btn-default.btn-select.dropdown-toggle')).get(1);
    this.sortBySelector = element.all(by.css('.sidebar-item .dropdown-menu')).get(1);
    this.orderBySelectorMenu = element.all(by.css('.btn.btn-default.btn-select.dropdown-toggle')).get(2);
    this.orderBySelector = element.all(by.css('.sidebar-item .dropdown-menu')).get(2);
    this.searchBox = element(by.id('filters-search-input'));
    this.searchSubmit = element(by.id('filters-search-submit'));
    this.suggestionList = element.all(by.css('.dropdown-menu .autocomplete-item'));

    this.go = function() {
        browser.preventBrowserAlert();
        return browser.driver.get(browser.baseUrl + '#/moderation');
    };

    this.clickSortByOption = function(option) {
        return this.sortBySelector.element(by.linkText(option)).click();
    };

    this.clickOrderByOption = function(option) {
        return this.orderBySelector.element(by.linkText(option)).click();
    };

    this.searchBy = function(parameter) {
        this.searchBox.sendKeys(parameter);
    };

};
module.exports = ModerationPage;
