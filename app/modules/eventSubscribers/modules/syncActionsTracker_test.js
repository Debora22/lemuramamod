describe('Sync Actions tracker for external tracking', function() {
    var $rootScope;
    var externalTrackingFactory;
    var EXTERNAL_TRACKING_EVENTS;

    beforeEach(module(function($provide) {
        $provide.factory('EXTERNAL_TRACKING_EVENTS', function() {
            return {
                syncActions: {
                    approved: 'rome:externalTracking:syncActions:approved',
                    rejected: 'rome:externalTracking:syncActions:rejected',
                    tagged: 'rome:externalTracking:syncActions:tagged'
                }
            };
        });
        $provide.factory('externalTrackingFactory', function() {
            var _trackEvent = jasmine.createSpy('trackEvent');

            return {
                trackEvent: _trackEvent
            };
        });
    }));

    beforeEach(module('eventSubscribers.syncActionsTracker'));

    beforeEach(inject(function(
        _$rootScope_,
        _externalTrackingFactory_,
        _EXTERNAL_TRACKING_EVENTS_
    ) {
        $rootScope = _$rootScope_;
        externalTrackingFactory = _externalTrackingFactory_;
        EXTERNAL_TRACKING_EVENTS = _EXTERNAL_TRACKING_EVENTS_;
    }));

    it('should properly handle sync approved event', function() {
        //Given

        //When
        $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.syncActions.approved, 10);
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent).toHaveBeenCalledWith({
            category: 'sync_issue',
            action: 'sync_issue_approved',
            value: 10
        });
    });

    it('should properly handle sync rejected event', function() {
        //Given

        //When
        $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.syncActions.rejected, 5);
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent).toHaveBeenCalledWith({
            category: 'sync_issue',
            action: 'sync_issue_rejected',
            value: 5
        });
    });

    it('should properly handle sync tagged event', function() {
        //Given

        //When
        $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.syncActions.tagged, 1);
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent).toHaveBeenCalledWith({
            category: 'sync_issue',
            action: 'sync_issue_tagged',
            value: 1
        });
    });
});
