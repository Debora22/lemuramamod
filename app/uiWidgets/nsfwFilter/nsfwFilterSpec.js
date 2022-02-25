describe('NSFW Filter Component', function() {
    var ctrl;
    var scope;
    var $componentController;
    var filtersServiceSpy;
    var EXTERNAL_TRACKING_EVENTS;

    beforeEach(module(function($provide) {
        $provide.factory('EXTERNAL_TRACKING_EVENTS', function() {
            return {
                filters: {
                    hit: 'rome:externalTracking:filters:hit'
                }
            };
        });

    }));

    beforeEach(module('uiWidgets'));

    beforeEach(inject(function(
        _$componentController_,
        $rootScope,
        _EXTERNAL_TRACKING_EVENTS_
    ) {
        filtersServiceSpy = {
            query: {
                filters: {}
            },
            callbacks: {
                onChange: jasmine.createSpy('filterUpdatedCallback')
            }
        };

        var bindings = {
            filtersService: filtersServiceSpy
        };

        $componentController = _$componentController_;
        scope = $rootScope.$new();
        EXTERNAL_TRACKING_EVENTS = _EXTERNAL_TRACKING_EVENTS_;

        ctrl = $componentController('uiwNsfwFilter', {
            $scope: scope,
            EXTERNAL_TRACKING_EVENTS: EXTERNAL_TRACKING_EVENTS
        }, bindings);

        spyOn(scope, '$emit');
    }));

    it('should properly update filters', function() {
        // Given

        // When
        ctrl.updateFilter(0.1);

        // Then
        expect(filtersServiceSpy.query.filters.nsfw).toEqual({
            values: {
                range: {
                    min: 0.1,
                    max: 1
                }
            }
        });
        expect(filtersServiceSpy.callbacks.onChange.calls.count()).toEqual(1);
        expect(scope.$emit).toHaveBeenCalledWith(EXTERNAL_TRACKING_EVENTS.filters.hit, 'nsfwFilter');
    });

    it('should remove nsfw filters when value is 0', function() {
        // Given

        // When
        ctrl.updateFilter(0.1);
        ctrl.updateFilter(0);

        // Then
        expect(filtersServiceSpy.query.filters.nsfw).toEqual(undefined);
        expect(filtersServiceSpy.callbacks.onChange.calls.count()).toEqual(2);
        expect(scope.$emit).toHaveBeenCalledWith(EXTERNAL_TRACKING_EVENTS.filters.hit, 'nsfwFilter');
    });
});
