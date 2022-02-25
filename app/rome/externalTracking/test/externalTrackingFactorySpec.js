describe('The External Tracking Factory:', function() {
    var externalTrackingFactory;

    beforeEach(module('op.externalTracking'));

    beforeEach(inject(function(_externalTrackingFactory_) {
        externalTrackingFactory = _externalTrackingFactory_;

        window.ga = function() {};
        spyOn(window, 'ga');

        spyOn(Date, 'now').and.callFake(function() {
            return 1475177353736;
        });
    }));

    it('should have public methods', function() {
        expect(externalTrackingFactory.setField).toEqual(jasmine.any(Function));
        expect(externalTrackingFactory.setConfig).toEqual(jasmine.any(Function));
        expect(externalTrackingFactory.getConfig).toEqual(jasmine.any(Function));
        expect(externalTrackingFactory.trackEvent).toEqual(jasmine.any(Function));
        expect(externalTrackingFactory.trackPageView).toEqual(jasmine.any(Function));
        expect(externalTrackingFactory.startTimer).toEqual(jasmine.any(Function));
        expect(externalTrackingFactory.restartTimer).toEqual(jasmine.any(Function));
        expect(externalTrackingFactory.dismissTimer).toEqual(jasmine.any(Function));
        expect(externalTrackingFactory.trackTimeWithTimer).toEqual(jasmine.any(Function));
    });

    it('should track page view with search term', function() {
        //When
        externalTrackingFactory.setConfig('customer', 'crocs');
        externalTrackingFactory.setConfig('customer_id', 1);
        externalTrackingFactory.trackPageView('/tagging', 'test title', true, 'test search');

        //Then
        expect(window.ga.calls.count()).toEqual(2);
        expect(window.ga).toHaveBeenCalledWith('set', 'title', 'test title');
        expect(window.ga).toHaveBeenCalledWith('send', {
            hitType: 'pageview',
            page: '/tagging?customer=crocs&query=test search'
        });
    });

    it('should track productivity tagging speed with GA after tag a media', function() {
        //Given
        var mocktrackTimeWithTimerConfig = {
            category: '_tagging_productivity_tagging-speed',
            action: '_tagging_modal_add-first-product-tag_from-suggestion'
        };

        //When
        externalTrackingFactory.setConfig('customer', 'crocs');
        externalTrackingFactory.setConfig('customer_id', 1);
        externalTrackingFactory.startTimer('untilFirstTag');
        externalTrackingFactory.trackTimeWithTimer('untilFirstTag', mocktrackTimeWithTimerConfig);

        //Then
        expect(window.ga).toHaveBeenCalledWith('send', {
            hitType: 'timing',
            timingCategory: '_tagging_productivity_tagging-speed',
            timingVar: '_tagging_modal_add-first-product-tag_from-suggestion',
            timingValue: 0,
            timingLabel: 'crocs'
        });
    });

    it('should track productivity tagging speed with GA after tag a media with values by default', function() {
        //When
        externalTrackingFactory.setConfig('customer', 'crocs');
        externalTrackingFactory.setConfig('customer_id', 1);
        externalTrackingFactory.startTimer('untilFirstTag');
        externalTrackingFactory.trackTimeWithTimer('untilFirstTag', {});

        //Then
        expect(window.ga).toHaveBeenCalledWith('send', {
            hitType: 'timing',
            timingCategory: 'Undefined Category',
            timingVar: 'Undefined Action',
            timingValue: 0,
            timingLabel: 'crocs'
        });
    });

    it('should not track productivity tagging speed with GA when the time tracked is not available', function() {
        //When
        externalTrackingFactory.setConfig('customer', 'crocs');
        externalTrackingFactory.setConfig('customer_id', 1);
        externalTrackingFactory.trackTimeWithTimer('untilFirstTag', {});

        //Then
        expect(window.ga).not.toHaveBeenCalled();
    });

    it('should track send GA event with a config specified', function() {
        //Given
        var mockTrackEventConfig = {
            category: '_tagging_productivity_suggestions-available-or-not',
            action: '_tagging_modal_tagging_available-suggestions',
            value: 5
        };

        //When
        externalTrackingFactory.setConfig('customer', 'crocs');
        externalTrackingFactory.setConfig('customer_id', 1);
        externalTrackingFactory.trackEvent(mockTrackEventConfig);

        //Then
        expect(window.ga).toHaveBeenCalledWith('send', {
            hitType: 'event',
            eventCategory: '_tagging_productivity_suggestions-available-or-not',
            eventAction: '_tagging_modal_tagging_available-suggestions',
            eventLabel: 'crocs',
            eventValue: 5
        });
    });

    it('should track send GA event with a config by default', function() {
        //When
        externalTrackingFactory.setConfig('customer', 'crocs');
        externalTrackingFactory.setConfig('customer_id', 1);
        externalTrackingFactory.trackEvent({});

        //Then
        expect(window.ga).toHaveBeenCalledWith('send', {
            hitType: 'event',
            eventCategory: 'Undefined Category',
            eventAction: 'Undefined Action',
            eventLabel: 'crocs',
            eventValue: undefined
        });
    });

    it('should restart timer when restartTimer is called', function() {
        //Given
        spyOn(externalTrackingFactory, 'startTimer');

        //When
        externalTrackingFactory.restartTimer('untilFirstTag');

        //Then
        expect(externalTrackingFactory.startTimer.calls.count()).toEqual(1);
    });

    it('should not track GA event when the timer is dismissed', function() {
        //When
        externalTrackingFactory.startTimer('untilFirstTag');
        externalTrackingFactory.dismissTimer('untilFirstTag');
        externalTrackingFactory.trackTimeWithTimer('untilFirstTag', {});

        //Then
        expect(window.ga).not.toHaveBeenCalled();
    });

    it('should not dismisstimer when it was never defined and not track ga event', function() {
        //When
        externalTrackingFactory.dismissTimer('untilFirstTag');
        externalTrackingFactory.trackTimeWithTimer('untilFirstTag', {});

        //Then
        expect(window.ga).not.toHaveBeenCalled();
    });

    it('should not send category when is not required', function() {
        //When
        externalTrackingFactory.setConfig('customer', 'crocs');
        externalTrackingFactory.setConfig('customer_id', 1);
        externalTrackingFactory.trackPageView('/tagging', 'test title', false, 'test search');

        //Then
        expect(window.ga.calls.count()).toEqual(2);
        expect(window.ga).toHaveBeenCalledWith('set', 'title', 'test title');
        expect(window.ga).toHaveBeenCalledWith('send', {
            hitType: 'pageview',
            page: '/tagging?query=test search'
        });
    });

    it('should track page view without customer set and with search term', function() {
        //When
        externalTrackingFactory.setConfig('customer', null);
        externalTrackingFactory.setConfig('customer_id', 1);
        externalTrackingFactory.trackPageView('/tagging', 'test title', true, 'test search');

        //Then
        expect(window.ga.calls.count()).toEqual(2);
        expect(window.ga).toHaveBeenCalledWith('set', 'title', 'test title');
        expect(window.ga).toHaveBeenCalledWith('send', {
            hitType: 'pageview',
            page: '/tagging?query=test search'
        });
    });

    it('should track page view with customer set and without search term', function() {
        //When
        externalTrackingFactory.setConfig('customer', 'crocs');
        externalTrackingFactory.setConfig('customer_id', 1);
        externalTrackingFactory.trackPageView('/tagging', 'test title', true);

        //Then
        expect(window.ga.calls.count()).toEqual(2);
        expect(window.ga).toHaveBeenCalledWith('set', 'title', 'test title');
        expect(window.ga).toHaveBeenCalledWith('send', {
            hitType: 'pageview',
            page: '/tagging?customer=crocs'
        });
    });

    it('should track page view without setting a new page title when it is not specified', function() {
        //When
        externalTrackingFactory.setConfig('customer', 'crocs');
        externalTrackingFactory.setConfig('customer_id', 1);
        externalTrackingFactory.trackPageView('/tagging');

        //Then
        expect(window.ga.calls.count()).toEqual(1);
        expect(window.ga).not.toHaveBeenCalledWith('set', 'title', 'test title');
        expect(window.ga).toHaveBeenCalledWith('send', {
            hitType: 'pageview',
            page: '/tagging'
        });
    });

    it('should set a custom dimension properly', function() {
        //When
        externalTrackingFactory.setField('dimension1', 12345678);

        //Then
        expect(window.ga.calls.count()).toEqual(1);
        expect(window.ga).not.toHaveBeenCalledWith('set', 'dimension', 12345678);
    });
});
