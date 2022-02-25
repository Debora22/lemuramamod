describe('The Streamlist Service:', function() {

    var streamlistService;

    beforeEach(module('op.streamlist'));

    beforeEach(inject(function(_streamlistService_) {
        streamlistService = _streamlistService_;
    }));

    it('should return the default settings', function() {
        var streamlist = streamlistService();
        expect(streamlist.templatePath).toEqual('');
        expect(streamlist.templateUrl).toBeFalsy();
        expect(streamlist.streamActions).toEqual(jasmine.any(Object));
        expect(streamlist.streamActions.selector).toBeNull();
        expect(streamlist.streamActions.directive).toBeNull();
        expect(streamlist.streamActions.actions).toEqual([]);
        expect(streamlist.actions).toEqual(jasmine.any(Object));
        expect(streamlist.actions.clear).toEqual(jasmine.any(Function));
        expect(streamlist.actions.fill).toEqual(jasmine.any(Function));
    });

    it('should return the merged settings', function() {
        var testMock = {
                templatePath: '../../',
                templateUrl: true,
                streamActions: {
                    selector: 'selector',
                    directive: 'directive',
                    actions: ['action']
                },
                actions: {
                    clear: function() {},
                    fill: function() {}
                }
            },
            streamlist = streamlistService(testMock);

        expect(streamlist.templatePath).toEqual(testMock.templatePath);
        expect(streamlist.templateUrl).toEqual(testMock.templateUrl);
        expect(streamlist.streamActions).toEqual(testMock.streamActions);
        expect(streamlist.actions).toEqual(testMock.actions);
    });
});
