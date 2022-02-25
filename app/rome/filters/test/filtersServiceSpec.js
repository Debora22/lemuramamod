describe("the filters service:", function () {

    var _filters;

    beforeEach(module('op.filters'));

    beforeEach(inject(function(filtersService) {
        _filters = filtersService;
    }));

    it("should return the default settings", function () {
        var testFilters = _filters();
        expect(testFilters.showTotal).not.toBeTruthy();
        expect(testFilters.templatePath).toEqual('');
        expect(testFilters.actions.fill).toEqual(jasmine.any(Function));
        expect(testFilters.actions.clear).toEqual(jasmine.any(Function));
        expect(testFilters.actions.injectFilterCondition).toEqual(jasmine.any(Function));
        expect(testFilters.callbacks.afterApplyFilter).toEqual(jasmine.any(Function));
        expect(testFilters.callbacks.afterSearchPress).toEqual(jasmine.any(Function));
        expect(testFilters.callbacks.afterClearAll).toEqual([]);
        expect(testFilters.callbacks.onChange).toEqual(jasmine.any(Function));
    });

    it("should return the merge settings", function () {
        var testFilters = _filters({
            orderBy: [{title: 'Demo', value: 'demo'}],
            templatePath: '/test/'
        });

        expect(testFilters.showTotal).not.toBeTruthy();
        expect(testFilters.templatePath).toEqual('/test/');
        expect(testFilters.actions.fill).toEqual(jasmine.any(Function));
        expect(testFilters.actions.clear).toEqual(jasmine.any(Function));
        expect(testFilters.actions.injectFilterCondition).toEqual(jasmine.any(Function));
        expect(testFilters.callbacks.afterApplyFilter).toEqual(jasmine.any(Function));
        expect(testFilters.callbacks.afterSearchPress).toEqual(jasmine.any(Function));
        expect(testFilters.callbacks.afterClearAll).toEqual([ ]);
        expect(testFilters.callbacks.onChange).toEqual(jasmine.any(Function));
    });

});
