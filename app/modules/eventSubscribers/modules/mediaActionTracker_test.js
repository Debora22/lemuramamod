describe('Media Action tracker for internal tracking', function() {
    var $rootScope;
    var sectionService;
    var externalTrackingFactory;
    var internalTrackingService;
    var filterTrackingHelper;
    var INTERNAL_TRACKING_EVENTS;
    var EXTERNAL_TRACKING_EVENTS;

    beforeEach(module(function($provide) {
        $provide.factory('INTERNAL_TRACKING_EVENTS', function() {
            return {
                media: {
                    approved: 'rome:internal:media:approved',
                    rejected: 'rome:internal:media:rejected'
                }
            };
        });
        $provide.factory('EXTERNAL_TRACKING_EVENTS', function() {
            return {
                media: {
                    flagAsSpam: 'rome:externalTracking:media:flagAsSpam'
                }
            };
        });
        $provide.factory('internalTrackingService', function() {
            var _trackAction = jasmine.createSpy('trackAction');

            return {
                trackAction: _trackAction
            };
        });
        $provide.factory('filterTrackingHelper', function() {
            var _trackAction = jasmine.createSpy('trackAction');

            return {
                mediaActionExecuted: _trackAction
            };
        });
        $provide.factory('externalTrackingFactory', function() {
            var _trackEvent = jasmine.createSpy('trackEvent');

            return {
                trackEvent: _trackEvent
            };
        });
        $provide.factory('sectionService', function() {
            return {
                current: function() {}
            };
        });
    }));

    beforeEach(module('eventSubscribers.mediaActionTracker'));

    beforeEach(inject(function(
        _$rootScope_,
        _sectionService_,
        _externalTrackingFactory_,
        _internalTrackingService_,
        _filterTrackingHelper_,
        _INTERNAL_TRACKING_EVENTS_,
        _EXTERNAL_TRACKING_EVENTS_
    ) {
        $rootScope = _$rootScope_;
        sectionService = _sectionService_;
        externalTrackingFactory = _externalTrackingFactory_;
        internalTrackingService = _internalTrackingService_;
        filterTrackingHelper = _filterTrackingHelper_;
        INTERNAL_TRACKING_EVENTS = _INTERNAL_TRACKING_EVENTS_;
        EXTERNAL_TRACKING_EVENTS = _EXTERNAL_TRACKING_EVENTS_;
    }));

    it('should properly handle approve event', function() {
        //Given

        //When
        $rootScope.$emit(INTERNAL_TRACKING_EVENTS.media.approved, 20);
        $rootScope.$digest();

        //Then
        expect(internalTrackingService.trackAction.calls.count()).toEqual(1);
        expect(internalTrackingService.trackAction).toHaveBeenCalledWith('approved', 20);
    });

    it('should properly handle reject event', function() {
        //Given

        //When
        $rootScope.$emit(INTERNAL_TRACKING_EVENTS.media.rejected, 20);
        $rootScope.$digest();

        //Then
        expect(internalTrackingService.trackAction.calls.count()).toEqual(1);
        expect(internalTrackingService.trackAction).toHaveBeenCalledWith('rejected', 20);
    });

    it('should properly handle flagAsSpam event', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('tagging');

        //When
        $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.media.flagAsSpam, 2);
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent).toHaveBeenCalledWith({
            category: 'flagged_as_spam',
            action: 'media_flagged_as_spam_from_tagging',
            value: 2
        });
    });
});
