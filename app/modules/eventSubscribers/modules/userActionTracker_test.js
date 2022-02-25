describe('User Action event subscriber for external tracking service:', function() {

    var $rootScope;
    var EXTERNAL_TRACKING_EVENTS;
    var sectionService;
    var externalTrackingFactory;
    var moment;

    beforeEach(module(function($provide) {
        $provide.factory('EXTERNAL_TRACKING_EVENTS', function() {
            return {
                pageView: {
                    page: 'rome:externalTracking:pageView:page',
                    search: 'rome:externalTracking:pageView:search'
                },
                user: {
                    blacklist: 'rome:externalTracking:user:blacklist'
                }
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
        $provide.factory('moment', function() {
            return {
                format: function() {}
            };
        });
    }));

    beforeEach(module('op.modal', 'op.tagging', 'eventSubscribers.userActionTracker'));

    beforeEach(inject(function(_$rootScope_, _EXTERNAL_TRACKING_EVENTS_,
                               _sectionService_, _externalTrackingFactory_,
                               _moment_) {
        $rootScope = _$rootScope_;
        EXTERNAL_TRACKING_EVENTS = _EXTERNAL_TRACKING_EVENTS_;
        externalTrackingFactory = _externalTrackingFactory_;
        sectionService = _sectionService_;
        moment = _moment_;
    }));

    it('should track blacklist user action', function() {
        //Given
        spyOn(sectionService, 'current').and.returnValue('tagging');

        //When
        $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.user.blacklist, 10);
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent).toHaveBeenCalledWith({
            category: 'blacklisting_user',
            action: 'userblacklisted_from_tagging',
            value: 10
        });
    });
});
