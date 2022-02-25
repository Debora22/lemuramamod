describe('trackv2 service:', function() {

    beforeEach(module('op.track'));

    beforeEach(function() {
        module(function($provide) {
            $provide.constant('appConstant', {
                anafrus: {
                    url: 'https://data.photorank.me/'
                }
            });
        });
    });

    var $httpBackend,
        _trackv2;

    var context = 'test-premod';
    var type = 'delete-on-premod';
    var eventMock = {
        type: 'media',
        id: '111'
    };

    beforeEach(inject(function(_$httpBackend_, trackv2) {
        $httpBackend = _$httpBackend_;
        _trackv2 = trackv2;
    }));

    it('should have public methods', function() {
        expect(_trackv2.addEvent).toEqual(jasmine.any(Function));
        expect(_trackv2.flush).toEqual(jasmine.any(Function));
    });

    it('should return 200 and a objet with the tracked data', function() {
        $httpBackend.when('POST').respond(200, dummyResponse);
        _trackv2.addEvent(context, type, eventMock);
        _trackv2.flush().then(function(response) {
            expect(response[0].data.events[0].id).toEqual(dummyResponse.events[0].id);
        });
        $httpBackend.flush();
    });

    var dummyResponse = {
        events: [
            { id: 'e4a938ee-56f8-44d1-984e-18fb0f1f3704' }
        ]
    };

});
