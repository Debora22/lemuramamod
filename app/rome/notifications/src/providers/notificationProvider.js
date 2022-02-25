angular.module('op.notifications')
    .provider('notifications', function() {

        var defaultSettings = {
            classes: false,
            templateUrl: false,
            position: false,
            duration: false,
            scope: false
        };

        var setSettings = function(settings) {
            defaultSettings = angular.extend(defaultSettings, settings);
        };

        return {
            setSettings: setSettings,
            $get: ['notify', function(notify) {
                var exports = {};

                notify.config(defaultSettings);

                var dispatcher = function(message, options) {
                    var messageConfig = angular.extend(angular.copy(defaultSettings), options);
                    if (options.enableHtml) {
                        messageConfig.messageTemplate = '<span>{message}</span>'.assign({message: message});
                    } else {
                        messageConfig.message = message;
                    }
                    return notify(messageConfig);
                };

                exports.addWarnMessage = function(message, config) {
                    return dispatcher(message, angular.extend({classes: 'alert-warning'}, config));
                };

                exports.addInfoMessage = function(message, config) {
                    return dispatcher(message, angular.extend({classes: 'alert-info'}, config));
                };

                exports.addSuccessMessage = function(message, config) {
                    return dispatcher(message, angular.extend({classes: 'alert-success'}, config));
                };

                exports.addErrorMessage = function(message, config) {
                    return dispatcher(message, angular.extend({classes: 'alert-danger'}, config));
                };

                return exports;
            }]
        };
    });
