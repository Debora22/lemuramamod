describe('The Tagging Suggestion Component', function() {
    var ctrl;
    var scope;
    var suggestionService;
    var ROME_TAGGING_EVENTS;
    var taggingSuggestionService;
    var deferredSuggestedStreams;
    var $componentController;
    var addSpy = jasmine.createSpy('add');
    var hoverSpy = jasmine.createSpy('hover');
    var removeSpy = jasmine.createSpy('remove');
    var checkIfExistsSpy = jasmine.createSpy('checkIfExists');

    beforeEach(function() {
        module('op.tagging');

        module(function($provide) {
            suggestionService = {
                getSuggestedStreams: function() {},
                getLastestSuggestions: function() {},
                onSuggestionDataChange: function() {},
                onGetSuggestionRequest: function() {},
                getAllSuggestions: function() {},
                setIsAllSuggestionAvailable: function() {}
            };

            $provide.value('taggingSuggestionService', suggestionService);
            $provide.factory('ROME_TAGGING_EVENTS', function() {
                return {
                    suggestions: {
                        available: 'rome:tagging:suggestions:available',
                        unavailable: 'rome:tagging:suggestions:unavailable'
                    }
                };
            });
        });

        inject(function($q, _taggingSuggestionService_, _ROME_TAGGING_EVENTS_) {
            deferredSuggestedStreams = $q.defer();
            taggingSuggestionService = _taggingSuggestionService_;
            ROME_TAGGING_EVENTS = _ROME_TAGGING_EVENTS_;

            spyOn(taggingSuggestionService, 'getSuggestedStreams').and.returnValue(deferredSuggestedStreams.promise);
        });

        inject(function(_$componentController_, $rootScope) {
            var bindings = {
                media: [
                    {
                        id: 12345
                    }
                ],
                showSuggestion: true,
                add: addSpy,
                hover: hoverSpy,
                remove: removeSpy,
                checkIfExists: checkIfExistsSpy,
                isSuggestionAvailable: true
            };

            $componentController = _$componentController_;
            scope = $rootScope.$new();
            ctrl = $componentController('opTaggingSuggestion', {
                $scope: scope,
                ROME_TAGGING_EVENTS: ROME_TAGGING_EVENTS
            }, bindings);
        });

        spyOn(scope, '$emit');
    });

    it('Should render by default', function() {
        expect(angular.isArray(ctrl.suggestions)).toBe(true);
        expect(ctrl.showLoadingSuggestion).toBe(false);
    });

    it('Should fill suggestions with service response and emit the available event', function() {
        var suggestedStreamsResponse = ['Product_1', 'Product_2', 'Product_3'];

        ctrl.$onInit();
        expect(taggingSuggestionService.getSuggestedStreams).toHaveBeenCalled();
        expect(taggingSuggestionService.getSuggestedStreams.calls.count()).toBe(1);
        expect(ctrl.showLoadingSuggestion).toEqual(true);

        deferredSuggestedStreams.resolve(suggestedStreamsResponse);
        scope.$digest();

        expect(ctrl.showLoadingSuggestion).toEqual(false);
        expect(ctrl.suggestions).toEqual(suggestedStreamsResponse);
        expect(scope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.suggestions.available, {
            suggestions: suggestedStreamsResponse
        });
    });

    it('should emit the unavailable event when the service response with an empty set of suggested streams', function() {
        //Given
        var suggestedStreamsResponse = [];
        ctrl.suggestions = ['Product_1', 'Product_2'];

        //Then
        ctrl.$onInit();
        deferredSuggestedStreams.resolve(suggestedStreamsResponse);
        scope.$digest();

        //When
        expect(ctrl.suggestions).toEqual(suggestedStreamsResponse);
        expect(ctrl.showLoadingSuggestion).toEqual(false);
        expect(scope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.suggestions.unavailable, {
            suggestions: suggestedStreamsResponse
        });
    });

    it('Should emit the unavailable event when the service response with an empty array', function() {
        var suggestedStreamsResponse = null;

        ctrl.$onInit();
        deferredSuggestedStreams.reject(suggestedStreamsResponse);
        scope.$digest();

        expect(ctrl.suggestions).toEqual(suggestedStreamsResponse);
        expect(scope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.suggestions.unavailable, {
            suggestions: []
        });
    });

    it('should call the callbacks methods with the correct params', function() {
        scope.hover('in', 'item');
        expect(hoverSpy).toHaveBeenCalledWith({
            action: 'in',
            item: 'item'
        });

        scope.remove('item', 1, true);
        expect(removeSpy).toHaveBeenCalledWith({
            item: 'item',
            $index: 1,
            byId: true
        });

        scope.checkIfExists(12345);
        expect(checkIfExistsSpy).toHaveBeenCalledWith({
            id: 12345
        });
    });

    it('should emit add position event with the position of the stream list', function() {
        scope.add('item', 'suggestion', 1);

        expect(scope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.position, '02');
        expect(addSpy).toHaveBeenCalledWith({
            item: 'item',
            section: 'suggestion',
            position: '2'
        });
    });
});
