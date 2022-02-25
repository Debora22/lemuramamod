describe('slider Component', function() {
    var ctrl;
    var scope;
    var $componentController;
    var onChangeSpy;

    beforeEach(function() {
        module('uiComponents');

        inject(function(_$componentController_, $rootScope) {
            onChangeSpy = jasmine.createSpy('onChange');

            var bindings = {
                onChange: onChangeSpy
            };

            $componentController = _$componentController_;
            scope = $rootScope.$new();
            ctrl = $componentController('uicSlider', {
                $scope: scope
            }, bindings);
        });
    });

    it('should properly initialize values', function() {
        // Given

        // When
        ctrl.$onInit();

        // Then
        expect(ctrl.minText).toEqual('min');
        expect(ctrl.maxText).toEqual('max');
    });

    it('should properly call callback on value update', function() {
        // Given
        ctrl.$onInit();
        ctrl.sliderModel.value = 70;

        // When
        ctrl.onSliderChange();

        // Then
        expect(onChangeSpy.calls.count()).toEqual(1);
        expect(onChangeSpy).toHaveBeenCalledWith({value: 0.7});
    });
});
