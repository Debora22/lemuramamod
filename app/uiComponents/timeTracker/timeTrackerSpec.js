describe('The Time Tracker Component', function() {
    var ctrl;
    var $componentController;
    var momentMock;

    beforeEach(module('uiComponents'));

    beforeEach(module(function($provide) {
        var _format = jasmine.createSpy('format').and.returnValue('formattedValue');

        var _duration = jasmine.createSpy('duration').and.returnValue({
            format: _format
        });

        $provide.factory('momentMock', function() {
            return {
                duration: _duration
            };
        });
    }));

    beforeEach(inject(function(_$componentController_, _momentMock_) {
        $componentController = _$componentController_;
        momentMock = _momentMock_;
    }));

    it('Should render with "running" status by default', function() {
        //Given
        var bindings = {
            title: '',
            value: 20
        };

        ctrl = $componentController('opTimeTracker', {
            moment: momentMock
        }, bindings);

        //When
        ctrl.$onInit();

        //Then
        expect(ctrl.running).toBe(true);
        expect(momentMock.duration).toHaveBeenCalledWith(20, 'milliseconds');
        expect(momentMock.duration().format.calls.count()).toEqual(1);
    });

    it('Should properly update its displayed value', function() {
        //Given
        var bindings = {
            title: '',
            value: 20
        };

        ctrl = $componentController('opTimeTracker', {
            moment: momentMock
        }, bindings);

        ctrl.$onInit();

        //When
        ctrl.$onChanges({
            value: {
                currentValue: 30
            }
        });

        //Then
        expect(ctrl.running).toBe(true);
        expect(momentMock.duration).toHaveBeenCalledWith(30, 'milliseconds');
        expect(momentMock.duration().format.calls.count()).toEqual(2);
    });

    it('Should not update its displayed value when there are no changes in value', function() {
        //Given
        var bindings = {
            title: '',
            value: 20
        };

        ctrl = $componentController('opTimeTracker', {
            moment: momentMock
        }, bindings);

        ctrl.$onInit();

        //When
        ctrl.$onChanges({});

        //Then
        expect(momentMock.duration().format.calls.count()).toEqual(1);
    });

    it('Should call onPause callback on pause event', function() {
        //Given
        var bindings = {
            title: '',
            value: 20,
            onPause: jasmine.createSpy('onPause')
        };

        ctrl = $componentController('opTimeTracker', {
            moment: momentMock
        }, bindings);

        //When
        ctrl.$onInit();
        ctrl.toggle();

        //Then
        expect(ctrl.running).toBe(false);
        expect(bindings.onPause.calls.count()).toEqual(1);
    });

    it('Should call onResume callback on resume event', function() {
        //Given
        var bindings = {
            title: '',
            value: 20,
            onPause: jasmine.createSpy('onPause'),
            onResume: jasmine.createSpy('onResume')
        };

        ctrl = $componentController('opTimeTracker', {
            moment: momentMock
        }, bindings);

        //When
        ctrl.$onInit();
        ctrl.toggle();
        ctrl.toggle();

        //Then
        expect(ctrl.running).toBe(true);
        expect(bindings.onPause.calls.count()).toEqual(1);
        expect(bindings.onResume.calls.count()).toEqual(1);
    });
});
