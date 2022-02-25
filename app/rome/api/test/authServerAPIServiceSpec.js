describe('The Auth Server API service:', function() {

    beforeEach(module('op.api'));

    beforeEach(function() {
        module(function($provide) {
            $provide.constant('appConstant', {
                authServer: {
                    url: 'https://oauth.local.photorank.me'
                }
            });
        });
    });

    var $httpBackend,
        AuthServerAPIService;

    beforeEach(inject(function(_$httpBackend_, authServerAPIService) {
        $httpBackend = _$httpBackend_;
        AuthServerAPIService = authServerAPIService;
    }));

    it('should have public methods', function() {
        expect(AuthServerAPIService.login).toEqual(jasmine.any(Function));
    });

    it('should can login', function() {
        $httpBackend.when('POST').respond(200, dummyResponse);
        AuthServerAPIService.login('olapic', 'olapic').then(function(response) {
            expect(response.status).toEqual(200);
        });
        $httpBackend.flush();
    });

    var dummyResponse = {
        data: {},
        metadata: {
            status: 200
        }
    };

});
