describe('the progressbutton service:', function() {
    var _progressbutton;
    var mockProgressbutton;
    var mockOptions;

    beforeEach(module('op.progressbutton'));

    beforeEach(inject(function(ProgressbuttonService) {
        _progressbutton = ProgressbuttonService;
    }));

    it('should return the default settings', function() {
        var testProgressbutton = _progressbutton();
        mockProgressbutton = {
            templatePath: '',
            templateUrl: false,
            progressButtonStatus: false,
            callbacks: {
                onInputChange: function() {}
            }
        };
        expect(testProgressbutton.templatePath).toEqual(mockProgressbutton.templatePath);
        expect(testProgressbutton.templateUrl).toEqual(mockProgressbutton.templateUrl);
        expect(testProgressbutton.progressButtonStatus).toEqual(mockProgressbutton.progressButtonStatus);
        expect(angular.isFunction(testProgressbutton.callbacks.onInputChange))
            .toEqual(angular.isFunction(mockProgressbutton.callbacks.onInputChange));
    });

    it('should return the merged settings', function() {
        mockOptions = {
            templatePath: 'mockTemplatePath',
            templateUrl: 'mockTemplateUrl',
            progressButtonStatus: true,
            callbacks: {
                onInputChange: function() {}
            }
        };

        var testProgressbutton = _progressbutton(mockOptions);

        expect(testProgressbutton.templatePath).toEqual(mockOptions.templatePath);
        expect(testProgressbutton.templateUrl).toEqual(mockOptions.templateUrl);
        expect(testProgressbutton.progressButtonStatus).toEqual(mockOptions.progressButtonStatus);
        expect(angular.isFunction(testProgressbutton.callbacks.onInputChange))
            .toEqual(angular.isFunction(mockOptions.callbacks.onInputChange));
    });
});
