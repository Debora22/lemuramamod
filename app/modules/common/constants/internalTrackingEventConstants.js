'use strict';

angular.module('common')

.constant('INTERNAL_TRACKING_EVENTS', {
    media: {
        approved: 'media:status:approved',
        rejected: 'media:status:rejected',
        tagged: 'media:status:tagged'
    }
});
