describe('Time tracker event subscriber service:', function() {

    var $rootScope;
    var EXTERNAL_TRACKING_EVENTS;
    var sectionService;
    var externalTrackingFactory;

    beforeEach(module(function($provide) {
        $provide.factory('EXTERNAL_TRACKING_EVENTS', function() {
            return {
                timeTracking: {
                    resume: 'rome:externalTracking:timer:resume',
                    pause: 'rome:externalTracking:timer:pause',
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
    }));

    beforeEach(module('op.modal', 'op.tagging', 'eventSubscribers.timeTracker'));

    beforeEach(inject(function(_$rootScope_, _EXTERNAL_TRACKING_EVENTS_,
                               _sectionService_, _externalTrackingFactory_) {
        $rootScope = _$rootScope_;
        EXTERNAL_TRACKING_EVENTS = _EXTERNAL_TRACKING_EVENTS_;
        externalTrackingFactory = _externalTrackingFactory_;
        sectionService = _sectionService_;
    }));

    it('should track time resume action', function() {
        //Given

        //When
        $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.timeTracking.resume);
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent).toHaveBeenCalledWith({
            category: 'tracking_time',
            action: 'timer_resume_button_pressed'
        });
    });

    it('should track time pause action', function() {
        //Given

        //When
        $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.timeTracking.pause);
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackEvent.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackEvent).toHaveBeenCalledWith({
            category: 'tracking_time',
            action: 'timer_pause_button_pressed'
        });
    });
});
