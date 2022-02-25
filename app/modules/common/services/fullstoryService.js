'use strict';

angular
.module('common')
.service('fullstoryService', [
    '$window',
    function($window) {

        /**
        * @name identify
        * @param customerID
        * @param value Object with customer user identifcation
        * @desc Set user data on Fullstory
        */
        this.identify = function(customerID, value) {
            if ($window.FS) {
                $window.FS.identify(customerID, value);
            }
        };

    }]
);
