describe('Authentication tracker for external tracking', function() {

    var $rootScope;
    var $q;
    var externalTrackingFactory;
    var AUTH_EVENTS;
    var authService;
    var fullstoryService;
    var fakeUser = {
        name: 'fakeuser',
        email: 'fakeuser@olapic.com',
        master: false,
        superadmin: '1'
    };
    var fakeCustomer = {
        id: 111,
        name: 'test account'
    };

    beforeEach(module(function($provide) {
        $provide.factory('AUTH_EVENTS', function() {
            return {
                accountChange: 'rome:accountChange'
            };
        });

        $provide.factory('authService', function($q) {
            var _getSelectedCredential = jasmine.createSpy('getSelectedCredential').and.returnValue({
                customer: fakeCustomer
            });
            var _isSessionReady = function() {
                return $q.when(true);
            };

            return {
                isSessionReady: _isSessionReady,
                getSelectedCredential: _getSelectedCredential,
                getAccount: function() {}
            };
        });

        $provide.factory('fullstoryService', function() {
            return {
                identify: function() {},
            };
        });

        $provide.factory('externalTrackingFactory', function() {
            var _setConfig = jasmine.createSpy('setConfig');

            return {
                setConfig: _setConfig
            };
        });
    }));

    beforeEach(module('eventSubscribers.authenticationTracker'));

    beforeEach(inject(function(
        _$rootScope_,
        _$q_,
        _externalTrackingFactory_,
        _AUTH_EVENTS_,
        _authService_,
        _fullstoryService_
    ) {
        $rootScope = _$rootScope_;
        $q = _$q_;
        externalTrackingFactory = _externalTrackingFactory_;
        AUTH_EVENTS = _AUTH_EVENTS_;
        authService = _authService_;
        fullstoryService = _fullstoryService_;
    }));

    it('should track account change event when session is ready', function() {
        //Given
        spyOn(authService, 'isSessionReady').and.returnValue($q.when(false));
        spyOn(authService, 'getAccount').and.returnValue(fakeUser);
        spyOn(fullstoryService, 'identify');

        //When
        $rootScope.$emit(AUTH_EVENTS.accountChange);
        $rootScope.$digest();

        //Then
        expect(authService.isSessionReady.calls.count()).toEqual(1);
        expect(authService.getSelectedCredential.calls.count()).toEqual(2);
        expect(externalTrackingFactory.setConfig.calls.count()).toEqual(4);
        expect(authService.getAccount.calls.count()).toEqual(2);
        expect(fullstoryService.identify.calls.count()).toEqual(2);
        expect(fullstoryService.identify).toHaveBeenCalledWith(111, {
            email: fakeUser.email,
            displayName: fakeUser.name,
            customerID: fakeCustomer.id,
            customerName: fakeCustomer.name
        });
        expect(externalTrackingFactory.setConfig).toHaveBeenCalledWith('customer', 'test account');
    });

    it('should not track account change event when session is not ready', function() {
        //Given
        var deferred = $q.defer();
        deferred.reject();
        spyOn(authService, 'isSessionReady').and.returnValue(deferred.promise);
        spyOn(authService, 'getAccount').and.returnValue(fakeUser);
        spyOn(fullstoryService, 'identify').and.returnValue(true);

        //When
        $rootScope.$emit(AUTH_EVENTS.accountChange);
        $rootScope.$digest();

        //Then
        expect(authService.isSessionReady.calls.count()).toEqual(1);
        expect(authService.getSelectedCredential.calls.count()).toEqual(1);
        expect(authService.getAccount.calls.count()).toEqual(1);
        expect(fullstoryService.identify.calls.count()).toEqual(1);
        expect(fullstoryService.identify).toHaveBeenCalledWith(111, {
            email: fakeUser.email,
            displayName: fakeUser.name,
            customerID: fakeCustomer.id,
            customerName: fakeCustomer.name
        });
        expect(externalTrackingFactory.setConfig.calls.count()).toEqual(2);
    });
});
