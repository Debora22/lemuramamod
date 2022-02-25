describe('The Moderation Time Tracker Component', function() {
    var ctrl;
    var $timeout;
    var $q;
    var $componentController;
    var trackingAPIService;
    var moderationTimeTrackerService;
    var callbacks = {};

    beforeEach(module('uiWidgets'));

    beforeEach(module(function($provide) {
        var onTimerActionSpy = jasmine.createSpy('onTimerAction').and.callFake(function(action, callback) {
            callbacks[action] = callback;
        });

        var setPauseStatusSpy = jasmine.createSpy('setPauseStatusSpy');

        $provide.factory('moderationTimeTrackerService', function() {
            return {
                onTimerAction: onTimerActionSpy,
                setPauseStatus: setPauseStatusSpy
            };
        });

        var keepAliveTimeSpy = jasmine.createSpy('keepAliveTimeSpy');
        var pauseTimeSpy = jasmine.createSpy('pauseTimeSpy');
        var resumeTimeSpy = jasmine.createSpy('resumeTimeSpy');
        var stopTimeSpy = jasmine.createSpy('stopTimeSpy');

        $provide.factory('trackingAPIService', function() {
            return {
                keepAliveTime: keepAliveTimeSpy,
                pauseTime: pauseTimeSpy,
                resumeTime: resumeTimeSpy,
                stopTime: stopTimeSpy
            };
        });

        $provide.factory('EXTERNAL_TRACKING_EVENTS', function() {
            return {
                timeTracking: {
                    pause: 'testPause',
                    resume: 'testResume'
                }
            };
        });
    }));

    beforeEach(inject(function(_$timeout_, _$q_, _$componentController_, _trackingAPIService_, _moderationTimeTrackerService_) {
        $timeout = _$timeout_;
        $q = _$q_;
        $componentController = _$componentController_;
        trackingAPIService = _trackingAPIService_;
        moderationTimeTrackerService = _moderationTimeTrackerService_;
    }));

    it('Should get current status values on component init', function() {
        //Given
        trackingAPIService.getTimeCurrentValue = jasmine.createSpy('getTimeCurrentValue').and.returnValue($q.when({
            status: 'start',
            time: 1001
        }));

        ctrl = $componentController('opModerationTimeTracker');

        //When
        ctrl.$onInit();
        $timeout.flush();

        //Then
        expect(trackingAPIService.getTimeCurrentValue.calls.count()).toEqual(1);
        expect(moderationTimeTrackerService.onTimerAction).toHaveBeenCalledWith('init', jasmine.any(Function));
        expect(moderationTimeTrackerService.onTimerAction).toHaveBeenCalledWith('pause', jasmine.any(Function));
        expect(moderationTimeTrackerService.onTimerAction).toHaveBeenCalledWith('resume', jasmine.any(Function));
        expect(moderationTimeTrackerService.onTimerAction).toHaveBeenCalledWith('stop', jasmine.any(Function));
        expect(ctrl.timeRunning).toEqual(true);
        expect(ctrl.timeValue).toEqual(1001);
    });

    it('Should properly initialize the time tracker when "init" action is called', function() {
        //Given
        trackingAPIService.getTimeCurrentValue = jasmine.createSpy('getTimeCurrentValue').and.returnValue($q.when({
            status: 'start',
            time: 1002
        }));

        ctrl = $componentController('opModerationTimeTracker');
        ctrl.$onInit();
        $timeout.flush();

        //When
        callbacks.init();

        //Then
        expect(trackingAPIService.getTimeCurrentValue.calls.count()).toEqual(2);
        expect(ctrl.timeRunning).toEqual(true);
        expect(ctrl.timeValue).toEqual(1002);
    });

    it('Should properly retry initialization', function() {
        //Given
        var mockTimeValue = {
            status: 'pause',
            time: 1002
        };

        trackingAPIService.getTimeCurrentValue = jasmine.createSpy('getTimeCurrentValue').and.callFake(function() {
            return $q.when(mockTimeValue);
        });

        ctrl = $componentController('opModerationTimeTracker');
        mockTimeValue = {};
        ctrl.$onInit();
        $timeout.flush();
        $timeout.flush();
        $timeout.flush();

        mockTimeValue = {
            status: 'start',
            time: 1003
        };
        $timeout.flush();

        //When

        //Then
        expect(trackingAPIService.getTimeCurrentValue.calls.count()).toEqual(4);
        expect(trackingAPIService.keepAliveTime.calls.count()).toEqual(1);
        expect(ctrl.timeRunning).toEqual(true);
        expect(ctrl.timeValue).toEqual(1003);
    });

    it('Should properly pause the time tracker when "pause" action is called', function() {
        //Given
        trackingAPIService.getTimeCurrentValue = jasmine.createSpy('getTimeCurrentValue').and.returnValue($q.when({
            status: 'start',
            time: 1004
        }));

        ctrl = $componentController('opModerationTimeTracker');
        ctrl.$onInit();
        $timeout.flush();

        //When
        callbacks.pause();
        $timeout.flush();

        //Then
        expect(trackingAPIService.getTimeCurrentValue.calls.count()).toEqual(2);
        expect(trackingAPIService.pauseTime.calls.count()).toEqual(1);
        expect(ctrl.timeRunning).toEqual(false);
        expect(ctrl.timeValue).toEqual(1004);
    });

    it('Should properly resume the time tracker when "pause" action is called', function() {
        //Given
        trackingAPIService.getTimeCurrentValue = jasmine.createSpy('getTimeCurrentValue').and.returnValue($q.when({
            status: 'start',
            time: 1005
        }));

        ctrl = $componentController('opModerationTimeTracker');
        ctrl.$onInit();
        $timeout.flush();

        //When
        callbacks.pause();
        $timeout.flush();

        callbacks.resume();
        $timeout.flush();

        //Then
        expect(trackingAPIService.getTimeCurrentValue.calls.count()).toEqual(3);
        expect(trackingAPIService.pauseTime.calls.count()).toEqual(1);
        expect(trackingAPIService.resumeTime.calls.count()).toEqual(1);
        expect(ctrl.timeRunning).toEqual(true);
        expect(ctrl.timeValue).toEqual(1005);
    });

    it('Should properly stops the time tracker when "stop" action is called', function() {
        //Given
        trackingAPIService.getTimeCurrentValue = jasmine.createSpy('getTimeCurrentValue').and.returnValue($q.when({
            status: 'start',
            time: 1006
        }));

        ctrl = $componentController('opModerationTimeTracker');
        ctrl.$onInit();
        $timeout.flush();

        //When
        callbacks.stop();

        //Then
        expect(trackingAPIService.getTimeCurrentValue.calls.count()).toEqual(1);
        expect(trackingAPIService.stopTime.calls.count()).toEqual(1);
        expect(ctrl.timeValue).toEqual(0);
    });
});
