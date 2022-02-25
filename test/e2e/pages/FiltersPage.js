'use strict';
var EC = protractor.ExpectedConditions;
chai.config.truncateThreshold = 0; // disable truncating

var FiltersPage = function() {
    // Mapping
    this.filtersContainer = element(by.id('filters-container'));
    this.inputSearch  = element(by.css('.sidebar-container .input-group input'));
    this.buttonSearch = element(by.css('.sidebar-container button.btn-default'));
    this.clearFilterButton = element(by.id('filters-reset-btn'));
    this.filterPanel  = element.all(by.css('#filters-accordion .panel-group'));
    this.filters = element.all(by.css('.panel'));
    this.filtersElements = element.all(by.repeater('(ikey,subfilter) in filter.values'));
    this.filterUncollapsed = element(by.css('.panel-collapse.in'));

    this.expandFilterByName = function(filterName) {
        var filterID = 'filters-accordion-' + (filterName.replace(/[^\d\w.-]/g, '-')).toLowerCase();
        element(by.id(filterID)).click();
    };

    this.getFilterOptionByName = function(filter, optionName) {
        var filterOptionID = 'filters-option-' + (filter.replace(/[^\d\w.-]/g, '-')).toLocaleLowerCase() + '-' +
        (optionName.replace(/[^\d\w.-]/g, '-')).toLocaleLowerCase();
        return element(by.id(filterOptionID));
    };

    this.getFilterOptionByIndex = function(filter, optionIndex) {
        return element.all(by.css('#filters-accordion-' + filter.toLowerCase() + ' li')).get(parseInt(optionIndex) - 1);
    };
};
module.exports = FiltersPage;
