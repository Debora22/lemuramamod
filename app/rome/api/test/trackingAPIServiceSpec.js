describe('The tracking API service:', function() {

    var apiServiceMock;
    var trackingAPIService;

    beforeEach(module('op.api'));

    beforeEach(function() {
        module(function($provide) {
            $provide.constant('appConstant', {
                adminAPI2: {
                    url: 'testUrl'
                }
            });

            $provide.factory('apiService', function() {
                var _post = jasmine.createSpy('post');
                var _get = jasmine.createSpy('get');
                var _put = jasmine.createSpy('put');

                return {
                    post: _post,
                    get: _get,
                    put: _put
                };
            });
        });
    });

    beforeEach(inject(function(_apiService_,  _trackingAPIService_) {
        apiServiceMock = _apiService_;
        trackingAPIService = _trackingAPIService_;
    }));

    it('Should POST to pause resource when pause', function() {
        //Given

        //When
        trackingAPIService.pauseTime();

        //Then
        expect(apiServiceMock.post).toHaveBeenCalledWith('testUrl/tracking/time/pause');
        expect(apiServiceMock.post.calls.count()).toEqual(1);
    });

    it('Should POST to resume resource when resume', function() {
        //Given

        //When
        trackingAPIService.resumeTime();

        //Then
        expect(apiServiceMock.post).toHaveBeenCalledWith('testUrl/tracking/time/resume');
        expect(apiServiceMock.post.calls.count()).toEqual(1);
    });

    it('Should POST to stop resource when stop', function() {
        //Given

        //When
        trackingAPIService.stopTime();

        //Then
        expect(apiServiceMock.post).toHaveBeenCalledWith('testUrl/tracking/time/stop');
        expect(apiServiceMock.post.calls.count()).toEqual(1);
    });

    it('Should GET time resource on Get current value', function() {
        //Given

        //When
        trackingAPIService.getTimeCurrentValue();

        //Then
        expect(apiServiceMock.get).toHaveBeenCalledWith('testUrl/tracking/time');
        expect(apiServiceMock.get.calls.count()).toEqual(1);
    });

    it('Should GET action counters', function() {
        //Given

        //When
        trackingAPIService.getActionCounters();

        //Then
        expect(apiServiceMock.get).toHaveBeenCalledWith('testUrl/tracking/actions');
        expect(apiServiceMock.get.calls.count()).toEqual(1);
    });

    it('Should reset action counters', function() {
        //Given

        //When
        trackingAPIService.resetActionCounters();

        //Then
        expect(apiServiceMock.put).toHaveBeenCalledWith('testUrl/tracking/reset_counters');
        expect(apiServiceMock.put.calls.count()).toEqual(1);
    });

    it('Should submit time and actions submitted values', function() {
        //Given

        //When
        trackingAPIService.submitUserReport(2, 1, 2, 230, 'Reason comment');

        //Then
        expect(apiServiceMock.post).toHaveBeenCalledWith(
            'testUrl/tracking/submission',
            {
                approved: 2,
                rejected: 1,
                tagged: 2,
                time: 230,
                comment: 'Reason comment'
            }
        );
        expect(apiServiceMock.post.calls.count()).toEqual(1);
    });
});
