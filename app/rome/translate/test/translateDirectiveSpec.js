describe('the translate directive:', function() {
    var $compile;
    var $rootScope;
    var $q;
    var translateService;
    var translateAPIService;
    var element;
    var isolateScope;
    var button;
    var compileElement = function(textToTranslate, config) {
        $rootScope.translate = translateService(config);
        $rootScope.textToTranslate = textToTranslate;
        element = $compile('<div op-translate="translate" texttotranslate="textToTranslate"' +
            'texttranslated="textTranslated" texttranslating="texttranslating" ' +
            'showtranslated="showtranslated" showicon="showicon"></div>')($rootScope);
        $rootScope.$digest();
        isolateScope = element.isolateScope();
        button = element.find('i.translateIcon');
    };

    beforeEach(module('op.translate'));
    beforeEach(module('templates'));
    beforeEach(function() {
        module(function($provide) {
            $provide.constant('appConstant', {
                translate: {
                    url: ''
                }
            });
        });
    });

    beforeEach(inject(function(_$compile_,
        _$rootScope_,
        _$q_,
        _translateService_,
        _translateAPIService_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        translateService = _translateService_;
        translateAPIService = _translateAPIService_;
    }));

    it('should replace the element with the appropriate content', function() {
        compileElement();
        expect(element.html()).not.toBeUndefined();
    });

    it('should perform the translation when the button is clicked', function() {
        var deferred = $q.defer();
        var translatedText = 'Hello';
        spyOn(translateAPIService, 'translate').and.returnValue(deferred.promise);

        compileElement('Hola', {
            showIcon: true,
            translateService: translateAPIService,
            callbacks: {
                afterTranslate: function(translate) {
                    expect(translate).toBe(translatedText);
                    expect(isolateScope.textTranslated).toBe(translate);
                }
            }
        });

        expect(isolateScope.showTranslated).toBeFalsy();
        expect(isolateScope.loading).toBeUndefined();

        button.trigger('click');
        expect(isolateScope.loading).toBeTruthy();
        //The promise is marked as resolved
        deferred.resolve([{translatedText: translatedText}]);
        //The promise is resolved
        isolateScope.$apply();

        expect(isolateScope.showTranslated).toBeTruthy();
        expect(isolateScope.loading).toBeFalsy();
    });

    it('should perform the translation after the template is loaded', function() {
        var deferred = $q.defer();
        var translatedText = 'Bye';
        spyOn(translateAPIService, 'translate').and.returnValue(deferred.promise);

        compileElement('Adios', {
            translateOnload: true,
            translateService: translateAPIService,
            callbacks: {
                afterTranslate: function(translate) {
                    expect(translate).toBe(translatedText);
                    expect(isolateScope.textTranslated).toBe(translate);
                }
            }
        });

        expect(isolateScope.showTranslated).toBeFalsy();
        expect(isolateScope.loading).toBeTruthy();
        //The promise is marked as resolved
        deferred.resolve([{translatedText: translatedText}]);
        //The promise is resolved
        isolateScope.$apply();

        expect(isolateScope.showTranslated).toBeTruthy();
        expect(isolateScope.loading).toBeFalsy();
    });

    it('should show and hide the translated text when the button is clicked', function() {
        var deferred = $q.defer();
        var translatedText = 'Night';
        spyOn(translateAPIService, 'translate').and.returnValue(deferred.promise);

        compileElement('Noche', {
            showIcon: true,
            translateOnload: true,
            translateService: translateAPIService
        });

        expect(isolateScope.showTranslated).toBeFalsy();
        //The promise is marked as resolved
        deferred.resolve([{translatedText: translatedText}]);
        //The promise is resolved
        isolateScope.$apply();

        expect(isolateScope.showTranslated).toBeTruthy();

        button.trigger('click');
        expect(isolateScope.showTranslated).toBeFalsy();

        button.trigger('click');
        expect(isolateScope.showTranslated).toBeTruthy();
    });
});
