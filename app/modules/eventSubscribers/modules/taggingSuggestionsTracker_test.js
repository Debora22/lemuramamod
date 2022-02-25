describe('Tagging Suggestion event subscriber for external tracking service:', function() {
    var $rootScope;
    var ROME_MODAL_EVENTS;
    var ROME_TAGGING_EVENTS;
    var EXTERNAL_TRACKING_CUSTOM_DIMENSIONS;
    var sectionService;
    var externalTrackingFactory;

    beforeEach(module(function($provide) {
        $provide.factory('AUTH_EVENTS', function() {
            return {
                accountChange: 'accountChange'
            };
        });
        $provide.factory('INTERNAL_TRACKING_EVENTS', function() {
            return {
                media: {
                    approved: 'approved',
                    rejected: 'rejected'
                }
            };
        });
        $provide.factory('EXTERNAL_TRACKING_CUSTOM_DIMENSIONS', function() {
            return {
                taggingSuggestion: {
                    streamId: 'dimension1',
                    streamHasBeenSuggested: 'dimension2',
                    hasHotspot: 'dimension3',
                    taggingFrom: 'dimension4',
                    suggestionsActive: 'dimension5',
                    mediaId: 'dimension6'
                }
            };
        });
        $provide.factory('EXTERNAL_TRACKING_EVENTS', function() {
            return {
                pageView: {
                    search: 'rome:externalTracking:pageView:search'
                }
            };
        });
        $provide.factory('internalTrackingService', function() {
            return {};
        });
        $provide.factory('authService', function($q) {
            var _isSessionReady = jasmine.createSpy('isSessionReady').and.returnValue($q.when());
            var _getSelectedCredential = jasmine.createSpy('getSelectedCredential').and.returnValue({
                customer: {
                    name: 'testCustomer'
                }
            });

            return {
                isSessionReady: _isSessionReady,
                getSelectedCredential: _getSelectedCredential
            };
        });
        $provide.factory('sectionService', function() {
            return {
                current: function() {}
            };
        });
        $provide.factory('externalTrackingFactory', function() {
            var _setConfig = jasmine.createSpy('setConfig');
            var _startTimer = jasmine.createSpy('startTime');
            var _dismissTimer = jasmine.createSpy('dismissTimer');
            var _restartTimer = jasmine.createSpy('restartTimer');
            var _trackEvent = jasmine.createSpy('trackEvent');
            var _trackTimeWithTimer = jasmine.createSpy('trackTimeWithTimer');
            var _setField = jasmine.createSpy('setField');

            return {
                setConfig: _setConfig,
                startTimer: _startTimer,
                dismissTimer: _dismissTimer,
                restartTimer: _restartTimer,
                trackEvent: _trackEvent,
                trackTimeWithTimer: _trackTimeWithTimer,
                setField: _setField
            };
        });
    }));

    beforeEach(module('op.modal', 'op.tagging', 'eventSubscribers.taggingSuggestionTracker'));

    beforeEach(inject(function(
        _$rootScope_,
        _ROME_MODAL_EVENTS_,
        _ROME_TAGGING_EVENTS_,
        _EXTERNAL_TRACKING_CUSTOM_DIMENSIONS_,
        _sectionService_,
        _externalTrackingFactory_
    ) {
        $rootScope = _$rootScope_;
        ROME_MODAL_EVENTS = _ROME_MODAL_EVENTS_;
        ROME_TAGGING_EVENTS = _ROME_TAGGING_EVENTS_;
        EXTERNAL_TRACKING_CUSTOM_DIMENSIONS = _EXTERNAL_TRACKING_CUSTOM_DIMENSIONS_;
        externalTrackingFactory = _externalTrackingFactory_;
        sectionService = _sectionService_;
    }));

    it('should start time tracking on tagging modal open', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('tagging');

        //When
        $rootScope.$emit(ROME_MODAL_EVENTS.opened);
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(1);
        expect(externalTrackingFactory.startTimer.calls.count()).toEqual(1);
        expect(externalTrackingFactory.startTimer).toHaveBeenCalledWith('untilFirstTag');
    });

    it('should start time tracking on moderation modal open', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('moderation');

        //When
        $rootScope.$emit(ROME_MODAL_EVENTS.opened);
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(1);
        expect(externalTrackingFactory.startTimer.calls.count()).toEqual(1);
        expect(externalTrackingFactory.startTimer).toHaveBeenCalledWith('untilFirstTag');
    });

    it('should not start time tracking on invalid section', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('Some Other Section');

        //When
        $rootScope.$emit(ROME_MODAL_EVENTS.opened);
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(1);
        expect(externalTrackingFactory.startTimer.calls.count()).toEqual(0);
    });

    it('should dismiss time tracking on tagging modal close', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('tagging');

        //When
        $rootScope.$emit(ROME_MODAL_EVENTS.closed);
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(1);
        expect(externalTrackingFactory.dismissTimer.calls.count()).toEqual(1);
        expect(externalTrackingFactory.dismissTimer).toHaveBeenCalledWith('untilFirstTag');
    });

    it('should dismiss time tracking on moderation modal close', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('moderation');

        //When
        $rootScope.$emit(ROME_MODAL_EVENTS.closed);
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(1);
        expect(externalTrackingFactory.dismissTimer.calls.count()).toEqual(1);
        expect(externalTrackingFactory.dismissTimer).toHaveBeenCalledWith('untilFirstTag');
    });

    it('should not dismiss time tracking on invalid section', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('Some Other Section');

        //When
        $rootScope.$emit(ROME_MODAL_EVENTS.closed);
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(1);
        expect(externalTrackingFactory.dismissTimer.calls.count()).toEqual(0);
    });

    it('should restart time tracking on tagging modal move', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('tagging');

        //When
        $rootScope.$emit(ROME_MODAL_EVENTS.move);
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(1);
        expect(externalTrackingFactory.restartTimer.calls.count()).toEqual(1);
        expect(externalTrackingFactory.restartTimer).toHaveBeenCalledWith('untilFirstTag');
    });

    it('should restart time tracking on moderation modal move', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('moderation');

        //When
        $rootScope.$emit(ROME_MODAL_EVENTS.move);
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(1);
        expect(externalTrackingFactory.restartTimer.calls.count()).toEqual(1);
        expect(externalTrackingFactory.restartTimer).toHaveBeenCalledWith('untilFirstTag');
    });

    it('should not restart time tracking on invalid section', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('Some Other Section');

        //When
        $rootScope.$emit(ROME_MODAL_EVENTS.move);
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(1);
        expect(externalTrackingFactory.restartTimer.calls.count()).toEqual(0);
    });

    it('should track suggestion available event on tagging section', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('tagging');

        //When
        $rootScope.$emit(ROME_TAGGING_EVENTS.suggestions.available);
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent).toHaveBeenCalledWith({
            category: '_tagging_productivity_suggestions-available-or-not',
            action: '_tagging_modal_tagging_available-suggestions'
        });
    });

    it('should track suggestion available event on moderation section', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('moderation');

        //When
        $rootScope.$emit(ROME_TAGGING_EVENTS.suggestions.available);
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent).toHaveBeenCalledWith({
            category: '_tagging_productivity_suggestions-available-or-not',
            action: '_tagging_modal_tagging_available-suggestions'
        });
    });

    it('should not track suggestion available event on invalid section', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('Some Other section');

        //When
        $rootScope.$emit(ROME_TAGGING_EVENTS.suggestions.available);
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(0);
    });

    it('should track suggestion unavailable event on tagging section', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('tagging');

        //When
        $rootScope.$emit(ROME_TAGGING_EVENTS.suggestions.unavailable);
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent).toHaveBeenCalledWith({
            category: '_tagging_productivity_suggestions-available-or-not',
            action: '_tagging_modal_tagging_unavailable-suggestions'
        });
    });

    it('should track suggestion unavailable event on moderation section', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('moderation');

        //When
        $rootScope.$emit(ROME_TAGGING_EVENTS.suggestions.unavailable);
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent).toHaveBeenCalledWith({
            category: '_tagging_productivity_suggestions-available-or-not',
            action: '_tagging_modal_tagging_unavailable-suggestions'
        });
    });

    it('should not track suggestion unavailable event on invalid section', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('Some Other section');

        //When
        $rootScope.$emit(ROME_TAGGING_EVENTS.suggestions.unavailable);
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(0);
    });

    it('should track stream add to media event on tagging section', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('tagging');

        //When
        $rootScope.$emit(ROME_TAGGING_EVENTS.stream.addAfterSuggestion, {
            stream: {
                type: 'PRODUCT'
            },
            from: 'test'
        });
        $rootScope.$emit(ROME_TAGGING_EVENTS.stream.addAfterSuggestion, {
            stream: {
                type: 'MANUAL'
            },
            from: 'test'
        });
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(2);
        expect(externalTrackingFactory.trackTimeWithTimer.calls.count()).toEqual(2);
        expect(externalTrackingFactory.trackTimeWithTimer).toHaveBeenCalledWith('untilFirstTag', {
            category: '_tagging_productivity_tagging-speed',
            action: '_tagging_modal_add-first-product-tag_from-test'
        });
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(2);
        expect(externalTrackingFactory.trackEvent).toHaveBeenCalledWith({
            category: '_tagging_productivity_suggestions-used-or-not',
            action: '_tagging_modal_add-product-tag_from-test'
        });
    });

    it('should track stream add to media event on moderation section', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('moderation');

        //When
        $rootScope.$emit(ROME_TAGGING_EVENTS.stream.addAfterSuggestion, {
            stream: {
                type: 'PRODUCT'
            },
            from: 'test'
        });
        $rootScope.$emit(ROME_TAGGING_EVENTS.stream.addAfterSuggestion, {
            stream: {
                type: 'MANUAL'
            },
            from: 'test'
        });
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(2);
        expect(externalTrackingFactory.trackTimeWithTimer.calls.count()).toEqual(2);
        expect(externalTrackingFactory.trackTimeWithTimer).toHaveBeenCalledWith('untilFirstTag', {
            category: '_tagging_productivity_tagging-speed',
            action: '_tagging_modal_add-first-product-tag_from-test'
        });
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(2);
        expect(externalTrackingFactory.trackEvent).toHaveBeenCalledWith({
            category: '_tagging_productivity_suggestions-used-or-not',
            action: '_tagging_modal_add-product-tag_from-test'
        });
    });

    it('should not track stream add to media event on invalid section', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('Some Other section');

        //When
        $rootScope.$emit(ROME_TAGGING_EVENTS.stream.addAfterSuggestion, {
            stream: {
                type: 'PRODUCT'
            },
            from: 'test'
        });
        $rootScope.$emit(ROME_TAGGING_EVENTS.stream.addAfterSuggestion, {
            stream: {
                type: 'MANUAL'
            },
            from: 'test'
        });
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(2);
        expect(externalTrackingFactory.trackTimeWithTimer.calls.count()).toEqual(0);
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(0);
    });

    it('should track suggested streams position from the suggested list', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('tagging');

        //When
        $rootScope.$emit(ROME_TAGGING_EVENTS.stream.position, '01');
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent).toHaveBeenCalledWith({
            category: 'EXPERIMENT_TaggingFromSuggestionsOrder',
            action: 'EXPERIMENT_TaggedFromSuggestion01',
            value: 1
        });
    });

    it('Should not track suggested streams position when the section is not valid', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('Some Other section');

        //When
        $rootScope.$emit(ROME_TAGGING_EVENTS.stream.position, '01');
        $rootScope.$digest();

        //Then
        expect(sectionService.current.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(0);
    });

    it('Should set and unset custom dimensions when section is valid', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('tagging');

        //When
        $rootScope.$emit(ROME_TAGGING_EVENTS.stream.add, {
            streamId: '123456',
            hasHotspot: true,
            taggingFrom: 'suggestion_by_crop',
            suggestionsActive: 'suggestion_by_crop',
            mediaId: 123456
        });
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.streamId,
            '123456'
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.hasHotspot,
            'With hotspot'
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.taggingFrom,
            'suggestion_by_crop'
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.suggestionsActive,
            'suggestion_by_crop'
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.mediaId,
            123456
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.hasHotspot,
            null
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.streamId,
            null
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.suggestionsActive,
            null
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.taggingFrom,
            null
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.mediaId,
            null
        );
        expect(externalTrackingFactory.setField.calls.count()).toEqual(10);
    });

    it('Should set custom dimensions value in without hotspot when its value is false', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('tagging');

        //When
        $rootScope.$emit(ROME_TAGGING_EVENTS.stream.add, {
            streamId: '123456',
            hasHotspot: false,
            taggingFrom: 'suggestion_by_crop',
            suggestionsActive: 'suggestion_by_crop',
            mediaId: 123456
        });
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.streamId,
            '123456'
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.hasHotspot,
            'Without hotspot'
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.suggestionsActive,
            'suggestion_by_crop'
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.taggingFrom,
            'suggestion_by_crop'
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.mediaId,
            123456
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.hasHotspot,
            null
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.streamId,
            null
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.suggestionsActive,
            null
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.taggingFrom,
            null
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.mediaId,
            null
        );
        expect(externalTrackingFactory.setField.calls.count()).toEqual(10);
    });

    it('Should not set and unset custom dimension 1 when section is invalid', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('undefinedSection');

        //When
        $rootScope.$emit(ROME_TAGGING_EVENTS.stream.add, '12345678');
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.setField).not.toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.streamId,
            '12345678'
        );
        expect(externalTrackingFactory.setField).not.toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.streamId,
            null
        );
        expect(externalTrackingFactory.setField.calls.count()).toEqual(0);
    });

    it('Should set and unset custom dimension 2 when streamHasBeenSuggested is presented', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('tagging');

        //When
        $rootScope.$emit(ROME_TAGGING_EVENTS.stream.addAfterSuggestion, {
            stream: {
                type: 'PRODUCT'
            },
            from: 'test',
            streamHasBeenSuggested: 'stream already suggested'
        });
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.streamHasBeenSuggested,
            'stream already suggested'
        );
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.streamHasBeenSuggested,
            null
        );
        expect(externalTrackingFactory.setField.calls.count()).toEqual(4);
    });

    it('Should not send set custom dimension events when streamHasBeenSuggested is not presented', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('tagging');

        //When
        $rootScope.$emit(ROME_TAGGING_EVENTS.stream.addAfterSuggestion, {
            stream: {
                type: 'PRODUCT'
            },
            from: 'test'
        });
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.setField.calls.count()).toEqual(3);
        expect(externalTrackingFactory.setField).toHaveBeenCalledWith(
            EXTERNAL_TRACKING_CUSTOM_DIMENSIONS.taggingSuggestion.streamHasBeenSuggested,
            null
        );
    });
});
