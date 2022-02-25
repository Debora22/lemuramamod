describe('switchAccountController', function() {
    beforeEach(module('ngRoute', 'op.notifications', 'pascalprecht.translate', 'base'));

    var $httpBackend;
    var $controller;
    var $scope;
    var $q;
    var $timeout;
    var $uibModalInstance;
    var moment;
    var trackingAPIService;
    var EXTERNAL_TRACKING_EVENTS;
    var internalTrackingService;
    var notifications;
    var appConstant;
    var deferredGetActionsCountersResponse;
    var deferredSubmitUserReportResponse;

    beforeEach(module(function($provide) {
        var _asMinutes = jasmine.createSpy('asMinutes').and.returnValue(100);
        var _duration = jasmine.createSpy('duration').and.returnValue({
            asMinutes: _asMinutes
        });
        var _internalTrackingService = {
            getCountersData: function() {}
        };
        var _getTimeCurrentValue = jasmine.createSpy('getCurrentTimeValue').and.returnValue({time: 100});
        $provide.value('internalTrackingService', _internalTrackingService);
        $provide.factory('moment', function() {
            return {
                duration: _duration
            };
        });
        $provide.factory('trackingAPIService', function() {
            return {
                getTimeCurrentValue: _getTimeCurrentValue,
                getActionCounters: function() {},
                submitUserReport: function() {}
            };
        });
        $provide.factory('EXTERNAL_TRACKING_EVENTS', function() {
            return {
                syncActions: {
                    approved: 'rome:externalTracking:syncActions:approved',
                    rejected: 'rome:externalTracking:syncActions:rejected',
                    tagged: 'rome:externalTracking:syncActions:tagged'
                }
            };
        });
        $provide.factory('appConstant', function() {
            return {
                actionCountersWaitingTime: 1000,
                actionCountersRetryTimes: 5
            };
        });
        $provide.factory('actionType', function() {
            return '';
        });
        $provide.factory('$uibModalInstance', function() {
            return {
                dismiss: jasmine.createSpy('dismiss'),
                close: jasmine.createSpy('close')
            };
        });
        $provide.factory('notifications', function() {
            return {
                addSuccessMessage: jasmine.createSpy('addSuccessMessage'),
                addErrorMessage: jasmine.createSpy('addErrorMessage')
            };
        });
    }));

    beforeEach(inject(function(
        _$rootScope_,
        _$q_,
        _$httpBackend_,
        _$controller_,
        _moment_,
        _trackingAPIService_,
        _internalTrackingService_,
        _notifications_,
        _EXTERNAL_TRACKING_EVENTS_,
        _appConstant_,
        _$timeout_,
        _$uibModalInstance_
    ) {
        $scope = _$rootScope_.$new();
        $httpBackend = _$httpBackend_;
        $controller = _$controller_;
        moment = _moment_;
        internalTrackingService = _internalTrackingService_;
        trackingAPIService = _trackingAPIService_;
        notifications = _notifications_;
        EXTERNAL_TRACKING_EVENTS = _EXTERNAL_TRACKING_EVENTS_;
        appConstant = _appConstant_;
        $timeout = _$timeout_;
        $q = _$q_;
        $uibModalInstance = _$uibModalInstance_;
        deferredGetActionsCountersResponse = $q.defer();
        deferredSubmitUserReportResponse = $q.defer();

        $httpBackend.expectGET('core/lenguages/en-us.json').respond(200);
        spyOn(trackingAPIService, 'getActionCounters').and.returnValue(deferredGetActionsCountersResponse.promise);
        spyOn(trackingAPIService, 'submitUserReport').and.returnValue(deferredSubmitUserReportResponse.promise);
        spyOn($scope, '$emit');
    }));

    it('Should check values by default', function() {
        // Given
        // When
        $controller('switchAccountController', { $scope: $scope });

        // Then
        expect($scope.stats.loading).toBe(true);
    });

    it('Should not retry and should show values in 0', function() {
        //Given
        spyOn(internalTrackingService, 'getCountersData').and.returnValue({
            approved: 0,
            rejected: 0,
            tagged: 0
        });

        //When
        $controller('switchAccountController', { $scope: $scope });
        deferredGetActionsCountersResponse.resolve({
            APPROVED: 0,
            REJECTED: 0,
            TAGGED: 0
        });
        $scope.$digest();
        $timeout.flush();

        //Then
        expect($scope.stats.loading).toBe(false);
        expect($scope.stats.approved).toBe(0);
        expect($scope.stats.rejected).toBe(0);
        expect($scope.stats.tagged).toBe(0);
        expect($scope.$emit).not.toHaveBeenCalled();
        expect($scope.stats.hours).toBe(1);
        expect($scope.stats.minutes).toBe(40);
        expect(moment.duration.calls.count()).toBe(1);
        expect(moment.duration().asMinutes.calls.count()).toBe(2);
        expect(trackingAPIService.getTimeCurrentValue.calls.count()).toBe(1);
        expect(trackingAPIService.getActionCounters.calls.count()).toBe(1);
    });

    it('Should not save differences when frontend and backend values are not specified', function() {
        //Given
        spyOn(internalTrackingService, 'getCountersData').and.returnValue(null);

        //When
        $controller('switchAccountController', { $scope: $scope });
        deferredGetActionsCountersResponse.resolve({});
        $scope.$digest();
        $timeout.flush();

        //Then
        expect($scope.stats.loading).toBe(false);
        expect($scope.stats.approved).toBe(0);
        expect($scope.stats.rejected).toBe(0);
        expect($scope.stats.tagged).toBe(0);
        expect($scope.$emit).not.toHaveBeenCalled();
        expect($scope.stats.hours).toBe(1);
        expect($scope.stats.minutes).toBe(40);
        expect(moment.duration.calls.count()).toBe(1);
        expect(moment.duration().asMinutes.calls.count()).toBe(2);
        expect(trackingAPIService.getTimeCurrentValue.calls.count()).toBe(1);
        expect(trackingAPIService.getActionCounters.calls.count()).toBe(1);
    });

    it('Should retry 5 times getting the backend values and show the difference', function() {
        //Given
        spyOn(internalTrackingService, 'getCountersData').and.returnValue({
            approved: 10,
            rejected: 5,
            tagged: 2
        });

        //When
        $controller('switchAccountController', { $scope: $scope });
        deferredGetActionsCountersResponse.resolve({
            APPROVED: 6,
            REJECTED: 3,
            TAGGED: 1
        });
        $scope.$digest();
        $timeout.flush();

        // Retrying 1st time
        deferredGetActionsCountersResponse.resolve();
        $scope.$digest();
        $timeout.flush();

        // Retrying 2nd time
        deferredGetActionsCountersResponse.resolve();
        $scope.$digest();
        $timeout.flush();

        // Retrying 3rd time
        deferredGetActionsCountersResponse.resolve();
        $scope.$digest();
        $timeout.flush();

        // Retrying 4th time
        deferredGetActionsCountersResponse.resolve();
        $scope.$digest();
        $timeout.flush();

        //Then
        expect($scope.stats.loading).toBe(false);
        expect($scope.stats.approved).toBe(6);
        expect($scope.stats.rejected).toBe(3);
        expect($scope.stats.tagged).toBe(1);
        expect($scope.$emit).toHaveBeenCalledWith(EXTERNAL_TRACKING_EVENTS.syncActions.approved, 4);
        expect($scope.$emit).toHaveBeenCalledWith(EXTERNAL_TRACKING_EVENTS.syncActions.rejected, 2);
        expect($scope.$emit).toHaveBeenCalledWith(EXTERNAL_TRACKING_EVENTS.syncActions.tagged, 1);
        expect($scope.stats.hours).toBe(1);
        expect($scope.stats.minutes).toBe(40);
        expect(moment.duration.calls.count()).toBe(1);
        expect(moment.duration().asMinutes.calls.count()).toBe(2);
        expect(trackingAPIService.getTimeCurrentValue.calls.count()).toBe(1);
        //First time and the 4 retrying.
        expect(trackingAPIService.getActionCounters.calls.count()).toBe(6);
    });

    it('Should stop retrying when the backend values are equal to frontend values', function() {
        var deferredEqualGetActionsCountersResponse = $q.defer();

        //Given
        spyOn(internalTrackingService, 'getCountersData').and.returnValue({
            approved: 10,
            rejected: 5,
            tagged: 2
        });

        //When
        $controller('switchAccountController', { $scope: $scope});
        deferredGetActionsCountersResponse.resolve({
            APPROVED: 6,
            REJECTED: 3,
            TAGGED: 1
        });
        $scope.$digest();
        $timeout.flush();

        // Retrying 1st time
        deferredGetActionsCountersResponse.resolve();
        $scope.$digest();
        $timeout.flush();

        trackingAPIService.getActionCounters.and.returnValue(deferredEqualGetActionsCountersResponse.promise);

        // Retrying 2nd time - after this digest cicle the retry mechanisms will stop
        deferredEqualGetActionsCountersResponse.resolve({
            APPROVED: 10,
            REJECTED: 5,
            TAGGED: 2
        });
        $scope.$digest();
        $timeout.flush();

        //Then
        expect($scope.stats.loading).toBe(false);
        expect($scope.stats.approved).toBe(10);
        expect($scope.stats.rejected).toBe(5);
        expect($scope.stats.tagged).toBe(2);
        expect($scope.$emit).not.toHaveBeenCalled();
        expect($scope.stats.hours).toBe(1);
        expect($scope.stats.minutes).toBe(40);
        expect(moment.duration.calls.count()).toBe(1);
        expect(moment.duration().asMinutes.calls.count()).toBe(2);
        expect(trackingAPIService.getTimeCurrentValue.calls.count()).toBe(1);
        //First time and the 4 retrying.
        expect(trackingAPIService.getActionCounters.calls.count()).toBe(4);
    });

    it('Should display a proper button text for switching an account', function() {
        //Given
        var action = 'switchAccount';

        //When
        $controller('switchAccountController', { $scope: $scope, actionType: action});
        $scope.$digest();

        //Then
        expect($scope.confirmText).toBe('SUBMIT & SWITCH ACCOUNTS');
    });

    it('Should display a proper button text for logging out', function() {
        //Given
        var action = 'logout';

        //When
        $controller('switchAccountController', { $scope: $scope, actionType: action});
        $scope.$digest();

        //Then
        expect($scope.confirmText).toBe('SUBMIT & LOGOUT');
    });

    it('Should check if there are difference between the current fields values and the tracked values', function() {
        //Given
        $controller('switchAccountController', { $scope: $scope });
        deferredGetActionsCountersResponse.resolve({
            APPROVED: 0,
            REJECTED: 0,
            TAGGED: 0
        });
        $scope.$digest();
        $timeout.flush();

        //When
        //User modify minutes fields
        $scope.stats.minutes = 20;
        $scope.checkEditions();

        //Then
        expect($scope.hasEdited).toBe(true);
    });

    it('Should show the square edit icon when the current value of the field is modified', function() {
        //Given
        var expectedResult;
        $controller('switchAccountController', { $scope: $scope });
        deferredGetActionsCountersResponse.resolve({
            APPROVED: 0,
            REJECTED: 0,
            TAGGED: 0
        });
        $scope.$digest();
        $timeout.flush();

        //When
        //User modify minutes fields
        $scope.stats.minutes = 20;
        expectedResult = $scope.isFieldEdited('minutes');

        //Then
        expect(expectedResult).toBe(true);
    });

    it('Should not show the square edit icon when the current value of the field is not modified', function() {
        //Given
        var expectedResult;
        $controller('switchAccountController', { $scope: $scope });
        deferredGetActionsCountersResponse.resolve({
            APPROVED: 0,
            REJECTED: 0,
            TAGGED: 0
        });
        $scope.$digest();
        $timeout.flush();

        //When
        //User modify minutes fields
        $scope.stats.approved = 0;
        expectedResult = $scope.isFieldEdited('approved');

        //Then
        expect(expectedResult).toBe(false);
    });

    it('Should dismiss the modal instance when the user click in cancel button', function() {
        //Given
        $controller('switchAccountController', { $scope: $scope });
        $scope.$digest();

        //When
        //User click cancel button
        $scope.closeModal();

        //Then
        expect($uibModalInstance.dismiss).toHaveBeenCalled();
    });

    it('Should submit the submitted info with the tracking service and response successfully', function() {
        //Given
        $controller('switchAccountController', { $scope: $scope });
        $scope.$digest();

        $scope.submitActivity();
        //When
        deferredSubmitUserReportResponse.resolve({ data: {} });
        $scope.$digest();

        //Then
        expect(notifications.addSuccessMessage).toHaveBeenCalledWith('All your work was submitted properly');
        expect($uibModalInstance.close).toHaveBeenCalled();
    });

    it('Should submit the submitted info with the tracking service and response successfully', function() {
        //Given
        $controller('switchAccountController', { $scope: $scope });
        deferredGetActionsCountersResponse.resolve({
            APPROVED: 6,
            REJECTED: 3,
            TAGGED: 1
        });
        $scope.$digest();
        $timeout.flush();
        $scope.stats.reason = 'Reason test';

        //When
        $scope.submitActivity();
        deferredSubmitUserReportResponse.resolve({ data: {} });
        $scope.$digest();

        //Then
        expect(trackingAPIService.submitUserReport.calls.count()).toBe(1);
        expect(trackingAPIService.submitUserReport).toHaveBeenCalledWith(6, 3, 1, 100, 'Reason test');
        expect(notifications.addSuccessMessage).toHaveBeenCalledWith('All your work was submitted properly');
        expect($uibModalInstance.close).toHaveBeenCalled();
    });

    it('Should submit the submitted info with the tracking service and catch a server error', function() {
        //Given
        $controller('switchAccountController', { $scope: $scope });
        $scope.$digest();

        //When
        $scope.submitActivity();
        deferredSubmitUserReportResponse.reject({
            data: {
                data: {
                    message: 'The input contains wrong characters. It only allow numbers.'
                }
            }
        });
        $scope.$digest();

        //Then
        expect(trackingAPIService.submitUserReport.calls.count()).toBe(1);
        expect($scope.error.isError).toBe(true);
        expect($scope.error.message).toBe('The input contains wrong characters. It only allow numbers.');
    });

    it('Should submit the submitted info with the tracking service and get a handled error', function() {
        //Given
        $controller('switchAccountController', { $scope: $scope });
        $scope.$digest();

        //When
        $scope.submitActivity();
        deferredSubmitUserReportResponse.resolve({
            data: {
                message: 'The input contains wrong characters. It only allow numbers.'
            }
        });
        $scope.$digest();

        //Then
        expect(trackingAPIService.submitUserReport.calls.count()).toBe(1);
        expect($scope.error.isError).toBe(true);
        expect($scope.error.message).toBe('The input contains wrong characters. It only allow numbers.');
        expect(notifications.addErrorMessage).not.toHaveBeenCalled();
        expect($uibModalInstance.close).not.toHaveBeenCalled();
    });

    it('Should validate the field hours and show a propper message', function() {
        //Given
        $controller('switchAccountController', { $scope: $scope });
        deferredGetActionsCountersResponse.resolve({
            APPROVED: 6,
            REJECTED: 3,
            TAGGED: 1
        });
        $scope.$digest();
        $timeout.flush();
        $scope.stats.reason = 'Reason test';
        $scope.stats.hours = 99;

        //When
        $scope.submitActivity();
        deferredSubmitUserReportResponse.resolve({ data: {} });
        $scope.$digest();

        //Then
        expect(trackingAPIService.submitUserReport.calls.count()).toBe(0);
        expect($scope.error.isError).toBe(true);
        expect($scope.error.message).toBe('You can\'t send more than 23 hours.');
        expect(notifications.addErrorMessage).not.toHaveBeenCalled();
        expect($uibModalInstance.close).not.toHaveBeenCalled();
    });

    it('Should validate the field minutes and show a propper message', function() {
        //Given
        $controller('switchAccountController', { $scope: $scope });
        deferredGetActionsCountersResponse.resolve({
            APPROVED: 6,
            REJECTED: 3,
            TAGGED: 1
        });
        $scope.$digest();
        $timeout.flush();
        $scope.stats.reason = 'Reason test';
        $scope.stats.minutes = 66;

        //When
        $scope.submitActivity();
        deferredSubmitUserReportResponse.resolve({ data: {} });
        $scope.$digest();

        //Then
        expect(trackingAPIService.submitUserReport.calls.count()).toBe(0);
        expect($scope.error.isError).toBe(true);
        expect($scope.error.message).toBe('You can\'t send more than 59 minutes.');
        expect(notifications.addErrorMessage).not.toHaveBeenCalled();
        expect($uibModalInstance.close).not.toHaveBeenCalled();
    });

    it('Should send number values as INT', function() {
        //Given
        $controller('switchAccountController', { $scope: $scope });
        deferredGetActionsCountersResponse.resolve({
            APPROVED: 6,
            REJECTED: 3,
            TAGGED: 1
        });
        $scope.$digest();
        $timeout.flush();
        $scope.stats.reason = 'Reason test';
        $scope.stats.hours = 1;
        $scope.stats.minutes = 2;
        $scope.stats.approved = 2;
        $scope.stats.rejected = 2;
        $scope.stats.tagged = 3;

        //When
        $scope.submitActivity();
        deferredSubmitUserReportResponse.resolve({ data: {} });
        $scope.$digest();

        //Then
        expect(trackingAPIService.submitUserReport.calls.count()).toBe(1);
        expect(trackingAPIService.submitUserReport).toHaveBeenCalledWith(2, 2, 3, 62, 'Reason test');
        expect($scope.error.isError).toBe(false);
    });

    it('Should proceed without submitting activity', function() {
        //Given
        $controller('switchAccountController', { $scope: $scope });
        $scope.$digest();

        //When
        $scope.proceedWithoutSubmitting();

        //Then
        expect($uibModalInstance.close).toHaveBeenCalled();
    });

    it('Should not allow multiple submissions', function() {
        //Given
        $controller('switchAccountController', { $scope: $scope });
        deferredGetActionsCountersResponse.resolve({
            APPROVED: 6,
            REJECTED: 3,
            TAGGED: 1
        });
        $scope.$digest();
        $timeout.flush();
        $scope.stats.reason = 'Reason test';
        $scope.stats.hours = 1;
        $scope.stats.minutes = 2;
        $scope.stats.approved = 2;
        $scope.stats.rejected = 2;
        $scope.stats.tagged = 3;

        //When
        $scope.submitActivity();

        //Then
        expect($scope.stats.loading).toBe(true);
    });

    it('Should allow submissions after the first try', function() {
        //Given
        $controller('switchAccountController', { $scope: $scope });
        deferredGetActionsCountersResponse.resolve({
            APPROVED: 6,
            REJECTED: 3,
            TAGGED: 1
        });
        $scope.$digest();
        $timeout.flush();
        $scope.stats.reason = 'Reason test';
        $scope.stats.hours = 1;
        $scope.stats.minutes = 2;
        $scope.stats.approved = 2;
        $scope.stats.rejected = 2;
        $scope.stats.tagged = 3;

        //When
        $scope.submitActivity();
        deferredSubmitUserReportResponse.resolve({ data: {} });
        $scope.$digest();

        //Then

        expect($scope.stats.loading).toBe(false);
    });

});
