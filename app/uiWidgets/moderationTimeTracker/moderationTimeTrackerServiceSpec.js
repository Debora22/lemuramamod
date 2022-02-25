describe('The Moderation Time Tracker Service:', function() {
    var moderationTimeTrackerService;

    beforeEach(module('uiWidgets'));

    beforeEach(inject(function(_moderationTimeTrackerService_) {
        moderationTimeTrackerService = _moderationTimeTrackerService_;
    }));

    it('should properly save init callback and the call it on init action', function() {
        //Given
        var onInitSpy = jasmine.createSpy('onInitSpy');

        moderationTimeTrackerService.onTimerAction('init', onInitSpy);

        //When
        moderationTimeTrackerService.init();

        //Then
        expect(onInitSpy.calls.count()).toEqual(1);
    });

    it('should properly save pause callback and the call it on pause action', function() {
        //Given
        var onPauseSpy = jasmine.createSpy('onPauseSpy');

        moderationTimeTrackerService.onTimerAction('pause', onPauseSpy);

        //When
        moderationTimeTrackerService.pause();

        //Then
        expect(onPauseSpy.calls.count()).toEqual(1);
    });

    it('should properly save resume callback and the call it on resume action', function() {
        //Given
        var onResumeSpy = jasmine.createSpy('onResumeSpy');

        moderationTimeTrackerService.onTimerAction('resume', onResumeSpy);

        //When
        moderationTimeTrackerService.resume();

        //Then
        expect(onResumeSpy.calls.count()).toEqual(1);
    });

    it('should properly save stop callback and the call it on stop action', function() {
        //Given
        var onStopSpy = jasmine.createSpy('onStopSpy');

        moderationTimeTrackerService.onTimerAction('stop', onStopSpy);

        //When
        moderationTimeTrackerService.stop();

        //Then
        expect(onStopSpy.calls.count()).toEqual(1);
    });

    it('should ignore pause action when it is already paused', function() {
        //Given
        var onPauseSpy = jasmine.createSpy('onPauseSpy');
        var onResumeSpy = jasmine.createSpy('onResumeSpy');
        moderationTimeTrackerService.onTimerAction('pause', onPauseSpy);
        moderationTimeTrackerService.onTimerAction('resume', onResumeSpy);
        moderationTimeTrackerService.setPauseStatus(true);

        //When
        var resumer = moderationTimeTrackerService.pause();
        resumer();

        //Then
        expect(onPauseSpy.calls.count()).toEqual(0);
        expect(onResumeSpy.calls.count()).toEqual(0);
    });

    it('should properly pause and resume timer on pause and resume actions', function() {
        //Given
        var onPauseSpy = jasmine.createSpy('onPauseSpy');
        var onResumeSpy = jasmine.createSpy('onResumeSpy');
        moderationTimeTrackerService.onTimerAction('pause', onPauseSpy);
        moderationTimeTrackerService.onTimerAction('resume', onResumeSpy);
        moderationTimeTrackerService.setPauseStatus(false);

        //When
        var resumer = moderationTimeTrackerService.pause();
        resumer();

        //Then
        expect(onPauseSpy.calls.count()).toEqual(1);
        expect(onResumeSpy.calls.count()).toEqual(1);
    });
});
