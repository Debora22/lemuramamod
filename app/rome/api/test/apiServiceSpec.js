describe('The API service:', function() {

    beforeEach(module('op.api'));

    var $httpBackend,
        APIService;

    beforeEach(inject(function(_$httpBackend_, apiService) {
        $httpBackend = _$httpBackend_;
        APIService = apiService;
    }));

    it('should have public methods', function() {
        expect(APIService.get).toEqual(jasmine.any(Function));
        expect(APIService.post).toEqual(jasmine.any(Function));
        expect(APIService.link).toEqual(jasmine.any(Function));
        expect(APIService.unlink).toEqual(jasmine.any(Function));
    });

    it('should fail because the token is not defined', function() {
        $httpBackend.expectGET(dummyURLRegex).respond(200, dummyResponse);
        APIService.get(dummyURL, {}).then(function() {}, function(error) {
            expect(error).toEqual('Invalid Access Token');
        });
        $httpBackend.flush();
    });

    it('should can do simple GET request', function() {
        $httpBackend.expectGET(dummyURLRegex).respond(200, dummyResponse);
        APIService.get(dummyURL, {}).then(function(response) {
            expect(response.metadata.status).toEqual(200);
        });
        $httpBackend.flush();
    });

    it('should can do simple POST request', function() {
        $httpBackend.expectPOST(dummyURLRegex).respond(200, dummyResponse);
        APIService.post(dummyURL, {}).then(function(response) {
            expect(response.metadata.status).toEqual(200);
        });
        $httpBackend.flush();
    });

    it('should can do simple LINK request', function() {
        $httpBackend.expect('LINK', dummyURLRegex, {}, dummyLinkHeaders)
        .respond(200, dummyResponse, dummyHeader);

        APIService.link(dummyURL, {}, dummyHeader).then(function(response) {
            expect(response.metadata.status).toEqual(200);
        });
        $httpBackend.flush();
    });

    it('should can do simple UNLINK request', function() {
        $httpBackend.expect('UNLINK', dummyURLRegex, {}, dummyLinkHeaders)
        .respond(200, dummyResponse, dummyHeader);

        APIService.unlink(dummyURL, {}, dummyHeader).then(function(response) {
            expect(response.metadata.status).toEqual(200);
        });
        $httpBackend.flush();
    });

    var dummyURL = 'http://rest.local.photorank.me';
    var dummyURLRegex = /rest\.local\.photorank\.me/i;

    var dummyResponse = {
        data: {},
        metadata: {
            status: 200
        }
    };

    var dummyLinkHeaders = {
        Accept: 'application/json',
        Link: '<{http://rest.local.photorank.me} http://rest.local.photorank.me/media/1>; rel=relation',
    };

    var dummyHeader = {
        Link: ('<{http://rest.local.photorank.me} http://rest.local.photorank.me/media/1>; rel=relation')
    };

});
