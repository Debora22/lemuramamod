describe('The Modal Service:', function() {

    var Modal, compile, rootScope;

    beforeEach(module('op.modal'));

    beforeEach(inject(function(modalService, $compile, $rootScope) {
        Modal = modalService;
        compile = $compile;
        rootScope = $rootScope;
    }));

    it('should return the default settings', function() {
        var testModal = new Modal();
        expect(testModal.template).toEqual('media');
        expect(testModal.templatePath).toEqual('');
        expect(testModal.templateUrl).toBe(false);
        expect(testModal.fullscreen).toEqual(true);
        expect(testModal.showTabs).toEqual(true);
        expect(testModal.navigation).toEqual(true);
        expect(testModal.size).toEqual('medium');
        expect(testModal.extras).toEqual([]);
        expect(testModal.translate).toBeNull();
        expect(testModal.actions).toEqual(jasmine.any(Object));
        expect(testModal.actions.open).toEqual(jasmine.any(Function));
        expect(testModal.actions.close).toEqual(jasmine.any(Function));
        expect(testModal.actions.navigation).toEqual(jasmine.any(Function));
        expect(testModal.callbacks).toEqual(jasmine.any(Object));
        expect(testModal.callbacks.afterOpen).toEqual(jasmine.any(Function));
        expect(testModal.callbacks.afterClose).toEqual(jasmine.any(Function));
        expect(testModal.preview.update).toEqual(jasmine.any(Function));
        expect(testModal.preview.show).toEqual(jasmine.any(Function));
        expect(testModal.preview.hide).toEqual(jasmine.any(Function));
    });

    it('should return the merged settings', function() {
        var testMock = {
                templatePath: './statics/html/',
                templateUrl: './statics/html/custom.html',
                fullscreen: false,
                showTabs: false,
                navigation: false,
                size: 'large',
                translate: true,
                callbacks: {
                    afterOpen: function() {
                        console.log('do something');
                    }
                }
            },
            testModal = new Modal(testMock);
        expect(testModal.templatePath).toEqual(testMock.templatePath);
        expect(testModal.templateUrl).toEqual(testMock.templateUrl);
        expect(testModal.fullscreen).toEqual(testMock.fullscreen);
        expect(testModal.showTabs).toEqual(testMock.showTabs);
        expect(testModal.navigation).toEqual(testMock.navigation);
        expect(testModal.size).toEqual(testMock.size);
        expect(testModal.translate).toEqual(testMock.translate);
        expect(testModal.callbacks.afterOpen).toEqual(testMock.callbacks.afterOpen);
    });
});
