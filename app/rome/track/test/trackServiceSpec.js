describe('The Track service:', function(){

    beforeEach(module('op.track'));

    beforeEach(function(){
        module(function($provide){
            $provide.constant('appConstant', {
                modSquadReport: {
                    url: 'https://modsquad.olapic.com/event'
                },
                enviroment: 'live'
            });
        });
    });

    var $httpBackend,
        Track;

    var event_mock = {
        'user': 'test-user',
        'customer':'Luis Demo',
        'action': 'expressmoderationlibrary.deleted-on-premod',
        'media_id': '10234',
        'gallery_id': '12323'
    };

    var event_mock_error = {
        'user': 'test-user',
        'action': 'expressmoderationlibrary.deleted-on-premod',
        'media_id': '10234',
        'gallery_id': '12323'
    };

    beforeEach(inject(function(_$httpBackend_, track){
        $httpBackend = _$httpBackend_;
        Track = track;
    }));

    it('should have public methods', function(){
        expect(Track.event).toEqual(jasmine.any(Function));
    });

    it('should return 200 and a objet with the tracked data', function(){
        $httpBackend.when('POST').respond(200, dummyResponse);
        Track.event(event_mock).then(function(response){
            expect(response.data.customer).toEqual(event_mock.customer);
        });
        $httpBackend.flush();
    });

    it('should fail when the customer param is empty', function(){
        $httpBackend.when('POST').respond(404, dummyResponseError);
        Track.event(event_mock_error).then(function(){}, function(response){
            expect(response.data.error).toEqual(['customer is missing in payload']);
        });
        $httpBackend.flush();
    });

    var dummyResponse = {
        id: 'e4a938ee-56f8-44d1-984e-18fb0f1f3704',
        user: 'test-user',
        customer: 'Luis Demo',
        action: 'expressmoderationlibrary.deleted-on-premod',
        timestamp: '2015-05-08 11:48:26',
        media_id:10234,
        gallery_id: 12323
    };

    var dummyResponseError = {
        error: ['customer is missing in payload']
    };

});
