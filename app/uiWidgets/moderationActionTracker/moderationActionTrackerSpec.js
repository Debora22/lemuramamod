describe('The Moderation Action Tracker Component', function() {
    var ctrl;
    var $timeout;
    var $componentController;
    var internalTrackingService;

    beforeEach(module('uiWidgets'));

    beforeEach(module(function($provide) {
        $provide.factory('internalTrackingService', function() {
            return {
                init: jasmine.createSpy('init'),
                refresh: jasmine.createSpy('refresh'),
                onCounterChange: jasmine.createSpy('onCounterChange'),
                onInit: jasmine.createSpy('onInit')
            };
        });

        $provide.factory('angularPopupBoxes', function() {
            return {
                confirm: jasmine.createSpy('popup')
            };
        });

        $provide.factory('loadingService', function() {
            return {
                loading: true
            };
        });
    }));

    beforeEach(inject(function(_$timeout_, _internalTrackingService_, _$componentController_) {
        $timeout = _$timeout_;
        internalTrackingService = _internalTrackingService_;
        $componentController = _$componentController_;
    }));

    it('Should initialize values on init', function() {
        //Given
        ctrl = $componentController('opModerationActionTracker');

        //When
        ctrl.$onInit();
        $timeout.flush();

        //Then
        expect(internalTrackingService.refresh.calls.count()).toEqual(1);
        expect(internalTrackingService.onCounterChange.calls.count()).toEqual(1);
        expect(internalTrackingService.onInit.calls.count()).toEqual(1);
        expect(ctrl.tagged).toEqual(0);
        expect(ctrl.rejected).toEqual(0);
        expect(ctrl.approved).toEqual(0);

    });

    it('Should properly handle values change event', function() {
        //Given
        var changeHandler;
        internalTrackingService.onCounterChange = jasmine.createSpy('onCounterChange').and.callFake(function(callback) {
            changeHandler = callback;
        });

        ctrl = $componentController('opModerationActionTracker');
        ctrl.$onInit();
        $timeout.flush();

        //When
        changeHandler({
            tagged: 10,
            rejected: 20,
            approved: 30
        });

        //Then
        expect(internalTrackingService.refresh.calls.count()).toEqual(1);
        expect(internalTrackingService.onCounterChange.calls.count()).toEqual(1);
        expect(internalTrackingService.onInit.calls.count()).toEqual(1);
        expect(ctrl.tagged).toEqual(10);
        expect(ctrl.rejected).toEqual(20);
        expect(ctrl.approved).toEqual(30);

    });

    it('Should properly handle values change event when new values are null or undefined', function() {
        //Given
        var changeHandler;
        internalTrackingService.onCounterChange = jasmine.createSpy('onCounterChange').and.callFake(function(callback) {
            changeHandler = callback;
        });

        ctrl = $componentController('opModerationActionTracker');
        ctrl.$onInit();
        $timeout.flush();

        //When
        changeHandler({
            tagged: null,
            rejected: undefined,
            approved: 30
        });

        //Then
        expect(internalTrackingService.refresh.calls.count()).toEqual(1);
        expect(internalTrackingService.onCounterChange.calls.count()).toEqual(1);
        expect(internalTrackingService.onInit.calls.count()).toEqual(1);
        expect(ctrl.tagged).toEqual('0');
        expect(ctrl.rejected).toEqual('0');
        expect(ctrl.approved).toEqual(30);

    });
});
