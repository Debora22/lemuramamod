'use strict';

angular
    .module('eventSubscribers', [
        'eventSubscribers.pageViewTracker',
        'eventSubscribers.taggingSuggestionTracker',
        'eventSubscribers.mediaActionTracker',
        'eventSubscribers.authenticationTracker',
        'eventSubscribers.userActionTracker',
        'eventSubscribers.timeTracker',
        'eventSubscribers.syncActionsTracker',
        'eventSubscribers.filterTracker'
    ]);
