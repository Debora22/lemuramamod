describe("the box service:", function () {

    var _box,
        mockBox,
        mockOptions;

    beforeEach(module('op.box'));

    beforeEach(inject(function(boxService) {
        _box = boxService;
    }));

    it("should return the default settings", function () {
        var testBox = _box();
        mockBox = {
            type: 'media',
            carousel: false,
            headerActions: {},
            templatePath: '',
            templateUrl: false,
            translate: null,
            callbacks: {
                afterRender: function() {},
                afterPhotoClick: function() {},
                afterCheckboxChange: function() {}
            }
        };
        expect(testBox.type).toEqual(mockBox.type);
        expect(testBox.carousel).toEqual(mockBox.carousel);
        expect(testBox.headerActions).toEqual(mockBox.headerActions);
        expect(testBox.templatePath).toEqual(mockBox.templatePath);
        expect(testBox.templateUrl).toEqual(mockBox.templateUrl);
        expect(testBox.translate).toEqual(mockBox.translate);
        expect(angular.isFunction(testBox.callbacks.afterRender)).toEqual(angular.isFunction(mockBox.callbacks.afterRender));
        expect(angular.isFunction(testBox.callbacks.afterPhotoClick)).toEqual(angular.isFunction(mockBox.callbacks.afterPhotoClick));
        expect(angular.isFunction(testBox.callbacks.afterCheckboxChange)).toEqual(angular.isFunction(mockBox.callbacks.afterCheckboxChange));
    });

    it("should return the merged settings", function () {
        mockOptions = {
            type: "media",
            carousel: [{title: "demo title", image: "img.jpg"}],
            headerActions: {},
            templatePath: 'components',
            templateUrl: false,
            translate: true,
            callbacks: {
                afterRender: function() {},
                afterPhotoClick: function() {}
            }
        };

        var testBox = _box(mockOptions);

        expect(testBox.type).toEqual(mockOptions.type);
        expect(testBox.carousel).toEqual(mockOptions.carousel);
        expect(testBox.headerActions).toEqual(mockOptions.headerActions);
        expect(testBox.templatePath).toEqual(mockOptions.templatePath);
        expect(testBox.templateUrl).toEqual(mockOptions.templateUrl);
        expect(testBox.translate).toEqual(mockOptions.translate);
        expect(angular.isFunction(testBox.callbacks.afterRender)).toEqual(angular.isFunction(mockBox.callbacks.afterRender));
        expect(angular.isFunction(testBox.callbacks.afterPhotoClick)).toEqual(angular.isFunction(mockBox.callbacks.afterPhotoClick));
    });

});
