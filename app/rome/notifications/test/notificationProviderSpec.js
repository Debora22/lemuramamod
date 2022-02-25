describe("the Notification provider:", function() {

    var _notifications_;

    var defaultSettings = {
        templateUrl: false,
        position: 'right',
        duration: 8000,
        scope: false
    };

    var notify_config = jasmine.createSpy();
    var notify_main = jasmine.createSpy();

    // Mock notify
    angular.module('cgNotify', []).
        factory('notify', function() {
            var response = notify_main;
            response.config = notify_config;
            return response;
        });

    beforeEach(module('op.notifications', function(notificationsProvider) {
        notificationsProvider.setSettings(defaultSettings);
    }));

    beforeEach(inject(function(notifications) {
        _notifications_ = notifications;
    }));

    it("should fired a success notification", function() {
        _notifications_.addWarnMessage('Warn');
        expect(notify_main).toHaveBeenCalledWith(
            angular.extend({classes: 'alert-warning', message: 'Warn'}, defaultSettings)
        );
    });

    it("should fired a success notification", function() {
        _notifications_.addInfoMessage('Info');
        expect(notify_main).toHaveBeenCalledWith(
            angular.extend({classes: 'alert-info', message: 'Info'}, defaultSettings)
        );
    });

    it("should fired a success notification", function() {
        _notifications_.addSuccessMessage('Success');
        expect(notify_main).toHaveBeenCalledWith(
            angular.extend({classes: 'alert-success', message: 'Success'}, defaultSettings)
        );
    });

    it("should fired a success notification", function() {
        _notifications_.addErrorMessage('Error');
        expect(notify_main).toHaveBeenCalledWith(
            angular.extend({classes: 'alert-danger', message: 'Error'}, defaultSettings)
        );
    });
});
