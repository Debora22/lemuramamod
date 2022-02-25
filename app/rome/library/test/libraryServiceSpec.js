describe("The library service:", function () {

    var _library;

    beforeEach(module('op.library'));

    beforeEach(inject(function(libraryService) {
        _library = libraryService;
    }));

    it("should return the default settings", function () {
        var library = _library();
        expect(library.inifinteScroll).toBe(true);
        expect(angular.isObject(library.actions)).toBe(true);
        expect(angular.isFunction(library.actions.clear)).toBe(true);
        expect(angular.isFunction(library.actions.loadMore)).toBe(true);
        expect(angular.isObject(library.callbacks)).toBe(true);
        expect(angular.isObject(library.callbacks.loading)).toBe(true);
        expect(angular.isFunction(library.callbacks.loading.start)).toBe(true);
        expect(angular.isFunction(library.callbacks.loading.end)).toBe(true);
        expect(angular.isFunction(library.callbacks.loadContent)).toBe(true);
    });

    it("should merge correctly the default and customer settings", function () {
        var library = _library({
            template : "HTML",
            templateUrl : '/src/template.html',
            inifinteScroll : false,
            entityView : { directive : {} }
        });
        expect(library.inifinteScroll).toBe(false);
        expect(library.template).toEqual("HTML");
        expect(library.templateUrl).toEqual('/src/template.html');
        expect(library.entityView).toEqual({ directive : {} });
    });

});
