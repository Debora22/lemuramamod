describe('the progressbutton directive:', function() {
    var $rootScope;
    var element;
    var input;

    beforeEach(module('op.progressbutton'));
    beforeEach(module('templates'));

    beforeEach(inject(function(_$compile_, _$rootScope_, ProgressbuttonService) {
        $rootScope = _$rootScope_;
        $rootScope.progressButton = new ProgressbuttonService({
            progressButtonStatus: false,
            callbacks: {
                onInputChange: function(scope) {
                    $rootScope.progressButton.progressButtonStatus = scope.bind.progressButtonStatus;
                }
            }
        });

        element = _$compile_('<op-progressbutton></op-progressbutton>')($rootScope);
        $rootScope.$digest();
        input = element.find('input');
    }));

    it('should replace the element with the appropriate content', function() {
        expect(element.html()).not.toBe(undefined);
    });

    it('should change the progressButtonStatus when the input is changed', function() {
        expect($rootScope.progressButton.progressButtonStatus).toBe(false);
        input.trigger('click');
        expect($rootScope.progressButton.progressButtonStatus).toBe(true);
    });

    it('should call the onInputChange function when the input is changed', function() {
        spyOn($rootScope.progressButton.callbacks, 'onInputChange');
        input.trigger('click');
        expect($rootScope.progressButton.callbacks.onInputChange).toHaveBeenCalled();
    });
});
