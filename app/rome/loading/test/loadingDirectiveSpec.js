describe("the loading directive:", function () {
    var $compile,
        $rootScope,
        element,
        loading;

    beforeEach(module('op.loading'));

    var compile = function() {
        element = $compile("<op-loading></op-loading>")($rootScope);
        $rootScope.$digest();
    };

    beforeEach(inject(function(_$compile_, _$rootScope_, loadingService){
        loading = loadingService;
        $compile = _$compile_;
        $rootScope = _$rootScope_;

    }));

    it('should replace the element with the appropriate content', function() {
        compile();
        expect(element.html()).not.toBe(undefined);
    });

});
