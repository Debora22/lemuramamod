describe('the translateService:', function() {
    var _translateService;
    var _translateAPIService;
    var mockTranslate;
    var mockOptions;

    beforeEach(module('op.translate'));
    beforeEach(function() {
        module(function($provide) {
            $provide.constant('appConstant', {
                translate: {
                    url: ''
                }
            });
        });
    });

    beforeEach(inject(function(translateService, translateAPIService) {
        _translateService = translateService;
        _translateAPIService = translateAPIService;
    }));

    it('should return the default settings', function() {
        var testTranslate = _translateService();
        mockTranslate = {
            templatePath: '',
            templateUrl: false,
            translateOnload: false,
            showIcon: false,
            showTransitionEffect: false,
            showIconWhenTranslated: false,
            translateService: _translateAPIService,
            actions: {
                translate: function() {}
            },
            callbacks: {
                afterTranslate: function() {},
                translationError: function() {}
            }
        };
        expect(testTranslate.templatePath).toEqual(mockTranslate.templatePath);
        expect(testTranslate.templateUrl).toEqual(mockTranslate.templateUrl);
        expect(testTranslate.translateOnload).toEqual(mockTranslate.translateOnload);
        expect(testTranslate.showIcon).toEqual(mockTranslate.showIcon);
        expect(testTranslate.showTransitionEffect).toEqual(mockTranslate.showTransitionEffect);
        expect(testTranslate.showIconWhenTranslated).toEqual(mockTranslate.showIconWhenTranslated);
        expect(testTranslate.translateService).toEqual(mockTranslate.translateService);
        expect(angular.isFunction(testTranslate.actions.translate))
            .toEqual(angular.isFunction(mockTranslate.actions.translate));
        expect(angular.isFunction(testTranslate.callbacks.afterTranslate))
            .toEqual(angular.isFunction(mockTranslate.callbacks.afterTranslate));
        expect(angular.isFunction(testTranslate.callbacks.translationError))
            .toEqual(angular.isFunction(mockTranslate.callbacks.translationError));
    });

    it('should return the merged settings', function() {
        mockOptions = {
            templatePath: 'mockTemplatePath',
            templateUrl: 'mockTemplateUrl',
            translateOnload: true,
            showIcon: true,
            showTransitionEffect: true,
            showIconWhenTranslated: true,
            translateService: _translateAPIService,
            actions: {
                translate: function() {}
            },
            callbacks: {
                afterTranslate: function() {},
                translationError: function() {}
            }
        };

        var testTranslate = _translateService(mockOptions);

        expect(testTranslate.templatePath).toEqual(mockOptions.templatePath);
        expect(testTranslate.templateUrl).toEqual(mockOptions.templateUrl);
        expect(testTranslate.translateOnload).toEqual(mockOptions.translateOnload);
        expect(testTranslate.showIcon).toEqual(mockOptions.showIcon);
        expect(testTranslate.showTransitionEffect).toEqual(mockOptions.showTransitionEffect);
        expect(testTranslate.showIconWhenTranslated).toEqual(mockOptions.showIconWhenTranslated);
        expect(testTranslate.translateService).toEqual(mockOptions.translateService);
        expect(testTranslate.actions.translate).toEqual(mockOptions.actions.translate);
        expect(testTranslate.callbacks.afterTranslate)
            .toEqual(mockOptions.callbacks.afterTranslate);
        expect(testTranslate.callbacks.translationError)
            .toEqual(mockOptions.callbacks.translationError);
    });
});
