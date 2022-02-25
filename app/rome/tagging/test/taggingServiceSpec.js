describe('The Tagging Service:', function(){

    var TaggingService;

    beforeEach(module('op.tagging'));

    beforeEach(inject(function(taggingService){
        TaggingService = taggingService;
    }));

    it('should return the default settings', function(){
        var testTagging = new TaggingService();
        expect(testTagging.templatePath).toEqual('');
        expect(testTagging.searchLimit).toEqual(15);
        expect(testTagging.zoomOnHover).toBe(false);
        expect(testTagging.sorting).toBe(false);
        expect(testTagging.callbacks).toEqual(jasmine.any(Object));
        expect(testTagging.callbacks.loadContent).toEqual(jasmine.any(Function));
        expect(testTagging.callbacks.itemAdded).toEqual(jasmine.any(Function));
        expect(testTagging.callbacks.itemRemoved).toEqual(jasmine.any(Function));
        expect(testTagging.callbacks.resultItemOnHover).toEqual(jasmine.any(Function));
        expect(testTagging.callbacks.resultItemOnOut).toEqual(jasmine.any(Function));
        expect(testTagging.callbacks.saveSorting).toEqual(jasmine.any(Function));
    });

    it('should return the merged settings', function(){
        var testMock = {
                templatePath: '../../',
                zoomOnHover: true,
                callbacks: {
                    loadContent: function(finish){
                        finish();
                    }
                }
            },
            testTagging = new TaggingService(testMock);

        expect(testTagging.templatePath).toEqual(testMock.templatePath);
        expect(testTagging.zoomOnHover).toBe(testMock.zoomOnHover);
        expect(testTagging.callbacks.loadContent).toEqual(testMock.callbacks.loadContent);
    });

});
