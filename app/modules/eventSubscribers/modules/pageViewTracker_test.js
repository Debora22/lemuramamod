describe('Page view event tracker for external tracking service:', function() {

    var $rootScope;
    var $location;
    var externalTrackingFactory;
    var EXTERNAL_TRACKING_EVENTS;

    beforeEach(module(function($provide) {
        $provide.factory('EXTERNAL_TRACKING_EVENTS', function() {
            return {
                pageView: {
                    search: 'rome:externalTracking:pageView:search'
                }
            };
        });

        $provide.factory('externalTrackingFactory', function() {
            var _trackPageView = jasmine.createSpy('trackPageView');

            return {
                trackPageView: _trackPageView
            };
        });
    }));

    beforeEach(module('eventSubscribers.pageViewTracker'));

    beforeEach(inject(function(_$rootScope_, _$location_, _externalTrackingFactory_, _EXTERNAL_TRACKING_EVENTS_) {
        $rootScope = _$rootScope_;
        $location = _$location_;
        externalTrackingFactory = _externalTrackingFactory_;
        EXTERNAL_TRACKING_EVENTS = _EXTERNAL_TRACKING_EVENTS_;

        window.trackJs = {
            track: function() {}
        };
        spyOn(window.trackJs, 'track');
    }));

    it('should properly handle page change event', function() {
        //Given
        spyOn($location, 'path').and.returnValue('/tagging');

        //When
        $rootScope.$emit('$routeChangeSuccess');
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackPageView.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackPageView)
        .toHaveBeenCalledWith('/tagging', 'Tagging-Gallery', true);
    });

    it('should properly handle page change event when page has not defined configuration', function() {
        //Given
        spyOn($location, 'path').and.returnValue('/someNewPage');

        //When
        $rootScope.$emit('$routeChangeSuccess');
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackPageView.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackPageView)
        .toHaveBeenCalledWith('/someNewPage', '', false);
    });

    it('should properly handle page change event for pages without customer', function() {
        //Given
        spyOn($location, 'path').and.returnValue('/accounts');

        //When
        $rootScope.$emit('$routeChangeSuccess');
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackPageView.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackPageView)
        .toHaveBeenCalledWith('/accounts', 'AccountSelection', false);
    });

    it('should properly handle search event', function() {
        //Given

        //When
        $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.pageView.search, '/tagging/media', 'test search');
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackPageView.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackPageView)
            .toHaveBeenCalledWith('/tagging/media', 'Tagging-Media', true, 'test search');
    });

    it('should properly handle search event when page has not defined configuration', function() {
        //Given

        //When
        $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.pageView.search, '/tagging/someNewPage', 'test search');
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackPageView.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackPageView)
        .toHaveBeenCalledWith('/tagging/someNewPage', '', false, 'test search');
        expect(window.trackJs.track)
        .toHaveBeenCalledWith('ERROR: No external tracking TITLE defined for the current page: /tagging/someNewPage');
    });

    it('should avoid tracking ignored locations', function() {
        //Given
        spyOn($location, 'path').and.returnValue('/');

        //When
        $rootScope.$emit('$routeChangeSuccess');
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackPageView).not.toHaveBeenCalled();
    });

    it('should properly handle page view event', function() {
        //Given

        //When
        $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.pageView.page, '/moderation/media');
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackPageView.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackPageView)
        .toHaveBeenCalledWith('/moderation/media', 'Moderation-Media', true);
    });

    it('should properly handle page view event when page has not defined configuration', function() {
        //Given

        //When
        $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.pageView.page, '/moderation/someNewPage');
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackPageView.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackPageView)
        .toHaveBeenCalledWith('/moderation/someNewPage', '', false);
    });

    it('should properly handle filter by metadata event', function() {
        //Given

        //When
        $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.pageView.search, '/tagging/filter/metadata', 'somekey');
        $rootScope.$digest();

        //Then
        expect(externalTrackingFactory.trackPageView.calls.count()).toEqual(1);
        expect(externalTrackingFactory.trackPageView)
        .toHaveBeenCalledWith('/tagging/filter/metadata', 'Tagging-Filter', true, 'somekey');
    });
});
