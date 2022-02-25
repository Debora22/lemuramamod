describe('filter tracker subscriber for external tracking service:', function() {
    var $rootScope;
    var EXTERNAL_TRACKING_EVENTS;
    var externalTrackingFactory;

    beforeEach(module(function($provide) {
        $provide.factory('EXTERNAL_TRACKING_EVENTS', function() {
            return {
                filters: {
                    hit: 'rome:externalTracking:filters:hit',
                    mediaAction: 'rome:externalTracking:filters:mediaAction',
                }
            };
        });
        $provide.factory('externalTrackingFactory', function() {
            var _trackEvent = jasmine.createSpy('trackEvent');
            var _getConfig = jasmine.createSpy('getConfig').and.returnValue(1);
            return {
                trackEvent: _trackEvent,
                getConfig: _getConfig
            };
        });
    }));

    beforeEach(module('op.modal', 'eventSubscribers.filterTracker'));

    beforeEach(inject(function(
        _$rootScope_,
        _EXTERNAL_TRACKING_EVENTS_,
        _externalTrackingFactory_
    ) {
        $rootScope = _$rootScope_;
        EXTERNAL_TRACKING_EVENTS = _EXTERNAL_TRACKING_EVENTS_;
        externalTrackingFactory = _externalTrackingFactory_;
    }));

    it('should track filters hit action', function() {
        //When
        $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.filters.hit, 'nsfwFilter');
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent).toHaveBeenCalledWith({
            category: 'filters_hit',
            action: 'nsfwFilter',
            label: '{"customer_id":1}',
            value: 1
        });
    });

    it('should track media action when filters are enabled', function() {
        //When
        $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.filters.mediaAction, {
            name: 'media_rejected',
            filters: 'with_labels_food,without_labels_cars',
            value: 5
        });
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent).toHaveBeenCalledWith({
            category: 'filters_hit',
            action: 'media_rejected',
            label: '{"customer_id":1,"filters":"with_labels_food,without_labels_cars"}',
            value: 5
        });
    });
});
