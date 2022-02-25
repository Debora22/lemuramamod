describe('the translateAPIService:', function() {
    var $httpBackend;
    var translateAPIService;
    var response = {
        data: {
            translations: [{
                translatedText: 'Hello',
                detectedSourceLanguage: 'es'
            }]
        }
    };

    beforeEach(module('op.translate'));

    beforeEach(function() {
        module(function($provide) {
            $provide.constant('appConstant', {
                translate: {
                    url: 'translateUrlService/'
                }
            });
        });
    });

    beforeEach(inject(function(_$httpBackend_, translateConfig, _translateAPIService_) {
        $httpBackend = _$httpBackend_;
        translateAPIService = _translateAPIService_;
    }));

    it('should query the translate API', function(done) {
        var regexUrl = new RegExp('translateUrlService\\/');
        $httpBackend.expectPOST(regexUrl).respond(response);

        translateAPIService.translate('Hola').then(function(translation) {
            expect(translation).toEqual(response.data.translations);
            done();
        });

        // Respond to all HTTP requests
        $httpBackend.flush();
    });
});
