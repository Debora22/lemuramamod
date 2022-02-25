describe('The Internal Tracking Service:', function() {
    beforeEach(module('ngStorage'));
    beforeEach(module('op.internalTracking'));
    var trackingAPIService;
    var internalTrackingService;
    var $q;
    var $rootScope;

    beforeEach(module(function($provide) {
        $provide.factory('trackingAPIService', function() {
            return {};
        });
    }));

    beforeEach(inject(function(_$rootScope_, _$q_, _internalTrackingService_, _trackingAPIService_) {
        $rootScope = _$rootScope_;
        $q = _$q_;
        internalTrackingService = _internalTrackingService_;
        trackingAPIService = _trackingAPIService_;
    }));

    it('should provide the following public methods', function() {
        expect(internalTrackingService.getCountersData).toEqual(jasmine.any(Function));
        expect(internalTrackingService.trackAction).toEqual(jasmine.any(Function));
        expect(internalTrackingService.init).toEqual(jasmine.any(Function));
    });

    it('Should update headerCountersData after track an action', function() {
        //Given
        var expectedValues = {
            approved: 1
        };

        //When
        internalTrackingService.trackAction('approved', 1);
        var headerCountersData = internalTrackingService.getCountersData();

        //Then
        expect(headerCountersData).toEqual(expectedValues);
    });

    it('Should properly initialize tracking data', function() {
        //Given
        trackingAPIService.getActionCounters = jasmine.createSpy('getActionCounters').and.returnValue($q.when({
            TAGGED: 2
        }));
        internalTrackingService.init();
        $rootScope.$apply();
        internalTrackingService.trackAction('approved', 1);

        //When
        internalTrackingService.init();
        $rootScope.$apply();
        var headerCountersData = internalTrackingService.getCountersData();

        //Then
        expect(trackingAPIService.getActionCounters.calls.count()).toEqual(2);
        expect(headerCountersData).toEqual({ tagged: 2, approved: 0, rejected: 0 });
    });

    it('Should call subscribers after track an action', function() {
        //Given
        var callbackSpy = jasmine.createSpy('callbackSpy');
        internalTrackingService.onCounterChange(callbackSpy);

        //When
        internalTrackingService.trackAction('approved', 1);

        //Then
        expect(callbackSpy).toHaveBeenCalledWith({
            approved: 1
        });
        expect(callbackSpy.calls.count()).toEqual(1);
    });

    it('Should add new value to previous one', function() {
        //Given
        internalTrackingService.trackAction('approved', 20);

        //When
        internalTrackingService.trackAction('approved', 10);

        //Then
        var result = internalTrackingService.getCountersData();
        expect(result).toEqual({
            approved: 30
        });
    });

    it('Should properly works after reseting counters', function() {
        //Given
        trackingAPIService.getActionCounters = jasmine.createSpy('getActionCounters').and.returnValue($q.when({}));

        internalTrackingService.trackAction('approved', 20);
        internalTrackingService.trackAction('rejected', 30);
        internalTrackingService.trackAction('tagged', 40);
        internalTrackingService.trackAction('someOtherValue', 50);

        //When
        internalTrackingService.init();
        $rootScope.$apply();
        internalTrackingService.trackAction('approved', 50);

        //Then
        var result = internalTrackingService.getCountersData();
        expect(result).toEqual({ tagged: 0, approved: 50, rejected: 0 });
    });
});
