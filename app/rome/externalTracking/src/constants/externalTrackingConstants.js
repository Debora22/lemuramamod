'use strict';

angular.module('op.externalTracking')
    .constant('EXTERNAL_TRACKING_CUSTOM_DIMENSIONS', {
        taggingSuggestion: {
            streamId: 'dimension1',
            streamHasBeenSuggested: 'dimension2',
            hasHotspot: 'dimension3',
            taggingFrom: 'dimension4',
            suggestionsActive: 'dimension5',
            mediaId: 'dimension6'
        }
    })
    .constant('EXTERNAL_TRACKING_EVENTS', {
        pageView: {
            page: 'rome:externalTracking:pageView:page',
            search: 'rome:externalTracking:pageView:search'
        },
        user: {
            blacklist: 'rome:externalTracking:user:blacklist'
        },
        media: {
            flagAsSpam: 'rome:externalTracking:media:flagAsSpam'
        },
        timeTracking: {
            resume: 'rome:externalTracking:timer:resume',
            pause: 'rome:externalTracking:timer:pause',
        },
        syncActions: {
            approved: 'rome:externalTracking:syncActions:approved',
            rejected: 'rome:externalTracking:syncActions:rejected',
            tagged: 'rome:externalTracking:syncActions:tagged'
        },
        filters: {
            hit: 'rome:externalTracking:filters:hit',
            mediaAction: 'rome:externalTracking:filters:mediaAction'
        }
    });
