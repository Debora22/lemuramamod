describe("the loading service:", function () {

    var Loading;

    beforeEach(module('op.loading'));

    beforeEach(inject(function(loadingService) {
        Loading = loadingService;
    }));

    it("should exist on and off functions", function () {
        var testLoading = Loading;
        expect(angular.isFunction(testLoading.on)).toEqual(true);
        expect(angular.isFunction(testLoading.off)).toEqual(true);
    });

});
