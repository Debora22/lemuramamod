'use strict';

describe('Factory: AccountAccessTrackerHelper', function() {

    var $rootScope;
    var trackv2;
    var AccountAccessTrackerHelper;
    var authService;
    var $q;
    var notifications;

    var fakeCustomer = {
        id: 123,
        name: 'A fake customer',
        settings: {
            tagging: true,
            section_express_moderator: 0
        }
    };
    var tokenInfo = {
        account: {
            name: 'pepe',
            email: 'pepe@olapic.com'
        },
        credential: [fakeCustomer]
    };
    var customerCredentials = {
        customer: fakeCustomer,
        token: 'ca8d9ffa4653e45164982670c3110ab8f2e015ca',
        tokeninfo: {
            scopes: 'public'
        }
    };

    beforeEach(module('ngRoute', 'op.loading', 'appConfig', 'op.auth', 'op.api', 'op.track', 'account'));

    beforeEach(module(function($provide) {
        $provide.factory('notifications', function() {
            return {
                addErrorMessage: function() {}
            };
        });
    }));

    beforeEach(inject(function(
        _$q_,
        _$rootScope_,
        _trackv2_,
        _AccountAccessTrackerHelper_,
        _authService_,
        _notifications_
    ) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        trackv2 = _trackv2_;
        AccountAccessTrackerHelper = _AccountAccessTrackerHelper_;
        authService = _authService_;
        notifications = _notifications_;
    }));

    beforeEach(inject(function($httpBackend) {
        $httpBackend.when('GET', '/auth/api/tokeninfo').respond(tokenInfo);
        $httpBackend.when('GET', '/auth/customer').respond(fakeCustomer);

        spyOn(authService, 'getSelectedCredential').and.returnValue(customerCredentials);
        spyOn(authService, 'isSessionReady').and.returnValue($q.when(true));
        spyOn(authService, 'isCustomerSelected').and.returnValue(true);
        spyOn(trackv2, 'addEvent');
        spyOn(trackv2, 'flush').and.returnValue($q.when(true));
    }));

    it('should provide with the public methods', function() {
        expect(AccountAccessTrackerHelper.trackLogin).toEqual(jasmine.any(Function));
        expect(AccountAccessTrackerHelper.trackLogout).toEqual(jasmine.any(Function));
    });

    it('should track the login action', function() {
        //_WHEN_
        AccountAccessTrackerHelper.trackLogin();
        $rootScope.$digest(); // wait until trackv2 promises got resolved
        //_THEN_
        expect(trackv2.addEvent).toHaveBeenCalledWith('account', 'account.login', {
            id: fakeCustomer.id,
            type: 'Customer'
        });
        expect(authService.getSelectedCredential).toHaveBeenCalled();
        expect(trackv2.flush).toHaveBeenCalled();
    });

    it('should track the logout action', function() {
        //_WHEN_
        AccountAccessTrackerHelper.trackLogout();
        $rootScope.$digest(); // wait until trackv2 promises got resolved
        //_THEN_
        expect(trackv2.addEvent).toHaveBeenCalledWith('account', 'account.logout', {
            id: fakeCustomer.id,
            type: 'Customer'
        });
        expect(authService.getSelectedCredential).toHaveBeenCalled();
        expect(authService.isSessionReady).toHaveBeenCalled();
        expect(authService.isCustomerSelected).toHaveBeenCalled();
        expect(trackv2.flush).toHaveBeenCalled();
    });

    it('shouldn\t track the logout action if there\'s no selected customer', function() {
        //_WHEN_
        authService.isCustomerSelected.and.returnValue(false);

        AccountAccessTrackerHelper.trackLogout();
        $rootScope.$digest(); // wait until trackv2 promises got resolved
        //_THEN_

        expect(authService.isSessionReady).toHaveBeenCalled();
        expect(authService.isCustomerSelected).toHaveBeenCalled();
        expect(authService.getSelectedCredential).not.toHaveBeenCalled();
        expect(trackv2.addEvent).not.toHaveBeenCalled();
        expect(trackv2.flush).not.toHaveBeenCalled();
    });

    it('shouldn\t track the logout action if the sesssion is not ready', function() {
        //_WHEN_
        authService.isSessionReady.and.returnValue($q.reject(false));

        AccountAccessTrackerHelper.trackLogout();
        $rootScope.$digest(); // wait until trackv2 promises got resolved
        //_THEN_

        expect(authService.isSessionReady).toHaveBeenCalled();
        expect(authService.isCustomerSelected).not.toHaveBeenCalled();
        expect(authService.getSelectedCredential).not.toHaveBeenCalled();
        expect(trackv2.addEvent).not.toHaveBeenCalled();
        expect(trackv2.flush).not.toHaveBeenCalled();
    });
});
