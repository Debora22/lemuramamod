describe('The tagging directive:', function() {

    var elem;
    var $scope;
    var $location;
    var $q;
    var directiveScope;
    var externalTrackingEvents;
    var taggingSuggestionService;
    var ROME_TAGGING_EVENTS;
    var deferredAddItem;
    //Mock data
    var loadContentResponse = {
        batch: ['1', '2'],
        nextPage: true
    };
    var mockStream = {
        id: 123456,
        name: 'Stream Name 1'
    };

    beforeEach(module('op.tagging', 'templates', 'op.rome'));

    beforeEach(module(function($provide) {
        $provide.factory('EXTERNAL_TRACKING_EVENTS', function() {
            return {
                pageView: {
                    search: 'rome:externalTracking:pageView:search'
                }
            };
        });
        $provide.factory('ROME_TAGGING_EVENTS', function() {
            return {
                stream: {
                    add: 'rome:tagging:stream:add'
                }
            };
        });
        $provide.value('taggingSuggestionService', {
            getSuggestedStreams: function() {},
            getLastestSuggestions: function() {},
            onSuggestionDataChange: function() {},
            onGetSuggestionRequest: function() {},
            getAllSuggestions: function() {},
            isTagSuggestionFromCrop: function() {}
        });
    }));

    beforeEach(inject(function(
        _$compile_,
        _$q_,
        _$rootScope_,
        _$location_,
        taggingService,
        _taggingSuggestionService_,
        _EXTERNAL_TRACKING_EVENTS_,
        _ROME_TAGGING_EVENTS_
    ) {
        $scope = _$rootScope_;
        $q = _$q_;
        $location = _$location_;
        taggingSuggestionService = _taggingSuggestionService_;
        externalTrackingEvents = _EXTERNAL_TRACKING_EVENTS_;
        ROME_TAGGING_EVENTS = _ROME_TAGGING_EVENTS_;

        $scope.tagging = taggingService({
            callbacks: {
                itemAdded: function() {},
                itemRemoved: function() {}
            }
        });
        $scope.tagging.searchLimit = 213;
        $scope.streamsForTagging = [];
        $scope.entity = [];
        $scope.media = [];
        $scope.showSuggestion = false;
        $scope.bind = {
            searchText: ''
        };
        elem = angular.element('<op-tagging streams="streamsForTagging" media="entity"' +
            'is-suggestion-available="isSuggestionAvailable"></op-tagging>');
        elem = _$compile_(elem)($scope);
        $scope.$digest();
        directiveScope = elem.isolateScope();

        deferredAddItem = $q.defer();
        spyOn($scope.tagging.callbacks, 'itemAdded').and.returnValue(deferredAddItem.promise);
        spyOn($scope.tagging.callbacks, 'itemRemoved');
        spyOn($scope.tagging.callbacks, 'loadContent');
        spyOn(directiveScope, '$emit');
    }));

    it('should be able to fill entities', function() {
        $scope.streamsForTagging = [1, 2, 3, 4];
        $scope.$digest();
        expect(directiveScope.entities).toEqual([1, 2, 3, 4]);
    });

    it('should be able to clear entities', function() {
        $scope.streamsForTagging = [];
        $scope.$digest();
        expect(directiveScope.entities).toEqual([]);
    });

    it('should itemAdded be fired when an entitiy is added', function() {
        var spyStart = $scope.tagging.callbacks.itemAdded;
        expect(spyStart).not.toHaveBeenCalled();
        expect(directiveScope.entities).toEqual([]);
        directiveScope.add(mockStream);
        expect(spyStart).toHaveBeenCalled();
        expect(directiveScope.entities).toEqual([mockStream]);
    });

    it('should itemRemoved be fired when an entity is removed', function() {
        var spyStart = $scope.tagging.callbacks.itemRemoved;
        expect(spyStart).not.toHaveBeenCalled();
        directiveScope.add(mockStream);
        expect(directiveScope.entities).toEqual([mockStream]);
        directiveScope.remove(mockStream, 0);
        expect(spyStart).toHaveBeenCalled();
        expect(directiveScope.entities).toEqual([]);
    });

    it('should show suggestions when the search input is empty', function() {
        directiveScope.showSuggestion = false;
        directiveScope.bind.searchText = '';
        directiveScope.media = [];
        directiveScope.search();

        expect(directiveScope.showSuggestion).toEqual(true);
    });

    it('should hide suggestions when the search result is not empty and the other way round', function() {
        var loadContentCallback;
        var loadContentResponseWithoutResults = angular.extend({}, loadContentResponse, {batch: []});
        var spyLoadContent = $scope.tagging.callbacks.loadContent;

        directiveScope.showSuggestion = true;
        directiveScope.bind.searchText = 'Shorts';
        directiveScope.media = [];
        directiveScope.search();

        expect(spyLoadContent).toHaveBeenCalledWith({q: 'Shorts', size: 213}, jasmine.any(Function));

        // Get the second param of the loadContectCallback
        loadContentCallback = spyLoadContent.calls.allArgs()[0][1];
        // Execute callback function with a mockResponse
        loadContentCallback(loadContentResponse);

        expect(directiveScope.showSuggestion).toEqual(false);

        loadContentCallback(loadContentResponseWithoutResults);

        expect(directiveScope.showSuggestion).toEqual(true);
    });

    it('should emit search text event when the user search', function() {
        spyOn($location, 'path').and.returnValue('/tagging');
        directiveScope.bind.searchText = 'Shirts';
        directiveScope.media = [];

        directiveScope.search();

        expect(directiveScope.$emit).toHaveBeenCalledWith(
            externalTrackingEvents.pageView.search,
            '/tagging/media/search',
            'Shirts'
        );
    });

    it('should emit search text event when the user search in bulk', function() {
        spyOn($location, 'path').and.returnValue('/tagging');
        directiveScope.bind.searchText = 'Shirts';
        directiveScope.media = [{}, {}];

        directiveScope.search();

        expect(directiveScope.$emit).toHaveBeenCalledWith(
            externalTrackingEvents.pageView.search,
            '/tagging/bulk/search',
            'Shirts'
        );
    });

    it('should not emit search text event when the user search a string less than 3 characters', function() {
        directiveScope.bind.searchText = 'Sh';
        directiveScope.media = [];

        directiveScope.search();

        expect(directiveScope.$emit).not.toHaveBeenCalled();
    });

    it('Should set custom dimensions when customer has only general suggestion enabled without hotspot', function() {
        // Given
        // customer has suggestion toggle available
        directiveScope.isSuggestionAvailable = true;
        // single media opened in the modal
        directiveScope.media = [{id: 111}];
        // tagging without the hotspot creation
        spyOn(taggingSuggestionService, 'isTagSuggestionFromCrop').and.returnValue(false);

        // When
        directiveScope.add(mockStream, 'suggestion');

        // Then
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.addAfterSuggestion,
            {
                from: 'suggestion',
                stream: mockStream
            },
            false
        );
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.add, {
            streamId: '123456',
            hasHotspot: false,
            taggingFrom: 'suggestion_regular',
            suggestionsActive: 'general_suggestion',
            mediaId: '111'
        });
        expect(directiveScope.$emit.calls.count()).toEqual(2);
    });

    it('Should set custom dimensions when customer has both suggestions enabled with hotspot', function() {
        // Given
        // customer has suggestion toggle available
        directiveScope.isSuggestionAvailable = true;
        // customer has crop suggestion toggle available
        directiveScope.isSuggestionFromCropAvailable = true;
        // single media opened in the modal
        directiveScope.media = [{id: 111}];
        // tagging with the hotspot creation
        spyOn(taggingSuggestionService, 'isTagSuggestionFromCrop').and.returnValue(true);

        // When
        directiveScope.add(mockStream, 'suggestion');

        // Then
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.addAfterSuggestion,
            {
                from: 'suggestion',
                stream: mockStream
            },
            false
        );
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.add, {
            streamId: '123456',
            hasHotspot: false,
            taggingFrom: 'suggestion_by_crop',
            suggestionsActive: 'both',
            mediaId: '111'
        });
        expect(directiveScope.$emit.calls.count()).toEqual(2);
    });

    it('Should set custom dimensions when customer has only crop suggestion enabled without hotspot', function() {
        // Given
        // customer has crop suggestion toggle available
        directiveScope.isSuggestionFromCropAvailable = true;
        // single media opened in the modal
        directiveScope.media = [{id: 111}];
        // tagging with the hotspot creation
        spyOn(taggingSuggestionService, 'isTagSuggestionFromCrop').and.returnValue(true);

        // When
        directiveScope.add(mockStream, 'suggestion');

        // Then
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.addAfterSuggestion,
            {
                from: 'suggestion',
                stream: mockStream
            },
            false
        );
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.add, {
            streamId: '123456',
            hasHotspot: false,
            taggingFrom: 'suggestion_by_crop',
            suggestionsActive: 'suggestion_by_crop',
            mediaId: '111'
        });
        expect(directiveScope.$emit.calls.count()).toEqual(2);
    });

    it('Should set custom dimensions when customer has both suggestions enabled without hotspot', function() {
        // Given
        // customer has suggestion toggle available
        directiveScope.isSuggestionAvailable = true;
        // customer has crop suggestion toggle available
        directiveScope.isSuggestionFromCropAvailable = true;
        // single media opened in the modal
        directiveScope.media = [{id: 111}];
        // tagging without the hotspot creation
        spyOn(taggingSuggestionService, 'isTagSuggestionFromCrop').and.returnValue(false);

        // When
        directiveScope.add(mockStream, 'suggestion');

        // Then
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.addAfterSuggestion,
            {
                from: 'suggestion',
                stream: mockStream
            },
            false
        );
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.add, {
            streamId: '123456',
            hasHotspot: false,
            taggingFrom: 'suggestion_regular',
            suggestionsActive: 'both',
            mediaId: '111'
        });
        expect(directiveScope.$emit.calls.count()).toEqual(2);
    });

    it('Should set custom dimensions when customer has both suggestions enabled and perform a search', function() {
        // Given
        // customer has suggestion toggle available
        directiveScope.isSuggestionAvailable = true;
        // customer has crop suggestion toggle available
        directiveScope.isSuggestionFromCropAvailable = true;
        // single media opened in the modal
        directiveScope.media = [{id: 111}];
        // tagging without the hotspot creation
        spyOn(taggingSuggestionService, 'isTagSuggestionFromCrop').and.returnValue(false);
        spyOn(taggingSuggestionService, 'getLastestSuggestions').and.returnValue({
            uncategorized: [{
                    id: 999999, //Different Id than mockStream
                    name: 'Stream Name 1'
                },
                {
                    id: 654321,
                    name: 'Stream Name 2'
                }
            ]
        });

        // When
        directiveScope.add(mockStream, 'search-result');

        // Then
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.addAfterSuggestion,
            {
                from: 'search-result',
                stream: mockStream,
                streamHasBeenSuggested: 'stream not suggested'
            },
            false
        );
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.add, {
            streamId: '123456',
            hasHotspot: false,
            taggingFrom: 'search',
            suggestionsActive: 'both',
            mediaId: '111'
        });
        expect(directiveScope.$emit.calls.count()).toEqual(2);
    });

    it('Should set custom dimensions when customer has both suggestions disabled without hotspot', function() {
        // Given
        // customer has suggestion toggle disabled
        directiveScope.isSuggestionAvailable = false;
        // customer has crop suggestion toggle disabled
        directiveScope.isSuggestionFromCropAvailable = false;
        // single media opened in the modal
        directiveScope.media = [{id: 111}];

        // When
        directiveScope.add(mockStream, 'search-result');

        // Then
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.add, {
            streamId: '123456',
            hasHotspot: false,
            taggingFrom: 'search',
            suggestionsActive: 'no',
            mediaId: '111'
        });
        expect(directiveScope.$emit.calls.count()).toEqual(1);
    });

    it('Should not emit tagging suggestion events when modal is opened in bulk', function() {
        // Given
        // customer has suggestion toggle available
        directiveScope.isSuggestionAvailable = true;
        // modal opened in bulk
        directiveScope.media = [{id: 111}, {id: 222}];

        // When
        directiveScope.add(mockStream, 'suggestion');

        // Then
        expect(directiveScope.$emit).not.toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.addAfterSuggestion,
            {
                from: 'suggestion',
                stream: mockStream
            }
        );
        expect(directiveScope.$emit).not.toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.addAfterSuggestion,
            {
                from: 'search-result',
                stream: mockStream,
                streamHasBeenSuggested: 'stream already suggested'
            },
            false
        );
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.add, {
            streamId: '123456',
            hasHotspot: false,
            taggingFrom: 'search',
            suggestionsActive: 'general_suggestion',
            mediaId: '111'
        });
        expect(directiveScope.$emit.calls.count()).toEqual(2);
    });

    it('Should not emit tagging suggestion event when the customer has suggestions toggle off', function() {
        // Given
        // customer has not suggestion toggle available
        directiveScope.isSuggestionAvailable = false;
        // single media opened in the modal
        directiveScope.media = [{id: 111}];

        // When
        directiveScope.add(mockStream, 'suggestion');

        // Then
        expect(directiveScope.$emit).not.toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.addAfterSuggestion,
            {
                from: 'suggestion',
                stream: mockStream
            },
            false
        );
        expect(directiveScope.$emit).not.toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.addAfterSuggestion,
            {
                from: 'search-result',
                stream: mockStream,
                streamHasBeenSuggested: 'stream already suggested'
            },
            false
        );
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.add, {
            streamId: '123456',
            hasHotspot: false,
            taggingFrom: 'search',
            suggestionsActive: 'no',
            mediaId: '111'
        });
        expect(directiveScope.$emit.calls.count()).toEqual(1);
    });

    it('should emit the correct suggested event when the searched stream was in the suggested list', function() {
        // Given
        // customer has suggestion toggle available
        directiveScope.isSuggestionAvailable = true;
        // single media opened in the modal
        directiveScope.media = [{id: 111}];
        spyOn(taggingSuggestionService, 'getLastestSuggestions').and.returnValue({
            uncategorized: [{
                    id: 123456, //Same id than mockStream
                    name: 'Stream Name 1'
                },
                {
                    id: 654321,
                    name: 'Stream Name 2'
                }
            ]
        });

        // When
        directiveScope.add(mockStream, 'search-result');

        // Then
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.addAfterSuggestion,
            {
                from: 'search-result',
                stream: mockStream,
                streamHasBeenSuggested: 'stream already suggested'
            }, false
        );
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.add, {
            streamId: '123456',
            hasHotspot: false,
            taggingFrom: 'search',
            suggestionsActive: 'general_suggestion',
            mediaId: '111'
        });
        expect(directiveScope.$emit.calls.count()).toEqual(2);
    });

    it('should emit the correct suggested event when the searched stream was not in the suggested list', function() {
        // Given
        // customer has suggestion toggle available
        directiveScope.isSuggestionAvailable = true;
        // single media opened in the modal
        directiveScope.media = [{id: 111}];
        spyOn(taggingSuggestionService, 'getLastestSuggestions').and.returnValue({
            uncategorized: [{
                    id: 999999, //Different Id than mockStream
                    name: 'Stream Name 1'
                },
                {
                    id: 654321,
                    name: 'Stream Name 2'
                }
            ]
        });
        // When
        directiveScope.add(mockStream, 'search-result');

        // Then
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.addAfterSuggestion,
            {
                from: 'search-result',
                stream: mockStream,
                streamHasBeenSuggested: 'stream not suggested'
            },
            false
        );
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.add, {
            streamId: '123456',
            hasHotspot: false,
            taggingFrom: 'search',
            suggestionsActive: 'general_suggestion',
            mediaId: '111'
        });
        expect(directiveScope.$emit.calls.count()).toEqual(2);
    });

    it('should not emit any suggested events if the section does not correspond', function() {
        // Given
        // customer has suggestion toggle available
        directiveScope.isSuggestionAvailable = true;
        // single media opened in the modal
        directiveScope.media = [{id: 111}];

        // When
        directiveScope.add(mockStream, 'undefined-section');

        // Then
        expect(directiveScope.$emit).not.toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.add,
            {
                from: 'suggestion',
                stream: mockStream
            },
            false
        );
        expect(directiveScope.$emit).not.toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.add,
            {
                from: 'search-result',
                stream: mockStream,
                streamHasBeenSuggested: 'stream already suggested'
            },
            false
        );
        expect(directiveScope.$emit).not.toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.add,
            {
                from: 'search-result',
                stream: mockStream,
                streamHasBeenSuggested: 'stream not suggested'
            },
            false
        );
        expect(directiveScope.$emit).toHaveBeenCalledWith(ROME_TAGGING_EVENTS.stream.add, {
            streamId: '123456',
            hasHotspot: false,
            taggingFrom: 'search',
            suggestionsActive: 'general_suggestion',
            mediaId: '111'
        });
        expect(directiveScope.$emit.calls.count()).toEqual(1);
    });
});
