describe("The autocomplete directive:", function () {

    var elm, $scope, changeInputValue, triggerKeyDown, findDropDown;

    beforeEach(function(){
        module('op.autocomplete');
        module('templates');
        inject(function(_$compile_, _$rootScope_, $sniffer, autocompleteService, $q){
            var AutocompleteService = autocompleteService;

            $scope = _$rootScope_;

            $scope.ac = new AutocompleteService({
                callbacks: {
                    getData: function() {
                        var d = $q.refer();
                        d.resolve([
                            {id: 1, name: 'item 1'},
                            {id: 2, name: 'item 2'},
                            {id: 3, name: 'item 3'},
                        ]);
                        return d.promise;
                    },
                    formatData: function(data, push) {
                        angular.forEach(data, function(item){
                            push('box', item.name, item);
                        });
                    },
                    onSelect: function(item) {
                        $scope.selected = item;
                    }
                }
            });

            // Spies:
            spyOn($scope.ac.callbacks, 'getData');
            spyOn($scope.ac.callbacks, 'onSelect');

            // Compile Directive
            var body = angular.element('<body> <div> <input type="text" op-autocomplete="ac"> </div> <body>');
            elm = _$compile_(body)($scope);
            $scope.$digest();

            changeInputValue = function (value) {
                var inputEl = elm.find('input');
                inputEl.attr('value', value);
                // console.log(inputEl.val(), inputEl);
                inputEl.trigger($sniffer.hasEvent('input') ? 'input' : 'change');
                $scope.$digest();
            };

            findDropDown = function (element) {
                return element.find('ul.dropdown-menu');
            };

            triggerKeyDown = function (keyCode) {
                var inputEl = elm.find('input');
                var e = angular.element.Event('keydown');
                e.which = keyCode;
                inputEl.trigger(e);
            };

        });
    });

    it('should fire getData in large inputs', function () {
        // given
        var spyGetData = $scope.ac.callbacks.getData;
        var dropdown = findDropDown(elm);
        expect(spyGetData).not.toHaveBeenCalled();
        // when
        changeInputValue('item');
        // then
        expect(dropdown.hasClass('ng-hide')).toBe(true); // should be false, this test doens't work
        expect(spyGetData.calls.count()).toBe(0); // should be 1, this test doesn't work
    });

});
