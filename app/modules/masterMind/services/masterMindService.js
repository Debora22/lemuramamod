'use strict';

angular
.module('op.masterMind')
.service('MasterMind', [
    '$q',
    '$timeout',
    '$rootScope',
    'BackendService',
    'angularPopupBoxes',
    'loadingService',
    'notifications',
    'sectionService',
    'actionService',
    'filtersService',
    'StaticFiltersService',
    'AutocompleteHelperFactory',
    'boxService',
    'libraryService',
    'taggingService',
    'modalService',
    'appConstant',
    'AUTH_EVENTS',
    'API_MEDIA_STATUSES_ID',
    'apiService',
    'adminAPIService',
    'blacklistUserService',
    'mediaChangeStatusService',
    'EXTERNAL_TRACKING_EVENTS',
    'asyncSettingsService',
    'filterTrackingHelper',
    function(
        $q,
        $timeout,
        $rootScope,
        BackendService,
        popup,
        loading,
        growl,
        sectionService,
        ActionService,
        FiltersService,
        StaticFiltersService,
        AutocompleteHelperFactory,
        BoxService,
        LibraryService,
        TaggingService,
        ModalService,
        appConstant,
        AUTH_EVENTS,
        API_MEDIA_STATUSES_ID,
        apiService,
        adminAPIService,
        blacklistUserService,
        mediaChangeStatusService,
        EXTERNAL_TRACKING_EVENTS,
        asyncSettingsService,
        filterTrackingHelper
    ) {
        return function(settings) {

            // library next/prev page
            var nextPage;

            var metadataFiltersPreviousSelection;

            // public
            var exports = {};

            settings = angular.extend({
                bucket: 'mediaWithStreams',
                sectionName: null,
                extraAggs: [],
                photorankIframe: false,
                aggsSize: undefined,
                cleanLibraryOnLoad: true,
                preloadContent: false
            }, settings);

            if (settings.photorankIframe) {
                $rootScope.$on(AUTH_EVENTS.logoutSuccess, function() {
                    if (window !== top) {
                        top.postMessage('logoutFromLemurama', appConstant.photorank.url);
                    }
                });
            }

            var endpoints = {
                mediaWithStreams: '/search/media/stream/positions',
                mediaSearch: '/search/media',
                predeleted: '/search/predeleted',
                streamSearch: '/search/streams?phrase={phrase}&items_per_page={size}&from=moderation'
            };

            /**
             * @name bind
             * @type function
             * @param f {Function} f-function
             * @param g {Function} g-function
             * @returns {Function}
             * @desc This function, returns a new function that when is called, it will calls to
             *       f-function and then synchronously will calls to g-function with it's result of f-function
             *       binded to this.result;
             */
            var bind = function(f, g) {
                return function() {
                    return g.apply({result: f.apply(null, arguments)}, arguments);
                };
            };

            /**
            * @name bind
            * @type function
            * @returns {Function}
            * @desc This function receives an amount undefined of functions that will be chained each other
            *       with bind()
            *       e.g., calling to chain(a,b,c,d) would be equivalent to call bind(a, bind(b, bind(c, d)))
            */
            var chain = function() {
                var args = Array.prototype.slice.call(arguments);
                var f = args.shift();
                while (args.length > 0) {
                    f = bind(f, args.shift());
                }
                return f;
            };

            var modules = {};
            var genericBackend = new BackendService(settings);
            var allowToLoadMoreContent = false;
            var entitiesList = [];
            var mmScope = {
                isLoading: false,
                bulkSelected: false,
                entitiesList: entitiesList
            };
            var autocompleteHelper = new AutocompleteHelperFactory();
            var toArray = function(arg) {
                if (angular.isDefined(arg)) {
                    return (angular.isArray(arg)) ? arg : [arg];
                }
                return [];
            };

            var extractResponse = function(response) {
                var stats = {
                    ok: 0,
                    failed: 0,
                    errors: [],
                    exclude: []
                };
                var media = response.data.media;
                Object.keys(media).map(function(key) {
                    if (angular.isObject(media[key])) {
                        if (media[key].status !== 200) {
                            stats.failed++;
                            stats.errors.push(media[key].message);
                            stats.exclude.push(key);
                        } else if (media[key].status === 200) {
                            stats.ok++;
                        }
                    } else {
                        if (media[key] !== 200) {
                            stats.failed++;
                            stats.errors.push('Something was wrong with this media id [' + key + ']');
                        } else if (media[key] === 200) {
                            stats.ok++;
                        }
                    }
                });
                return stats;
            };

            var removeEntities = function(entities, result) {
                var batch = [];
                var exclude = toArray(result.exclude);
                angular.copy(entities, batch);

                batch.map(function(entity) {
                    if (exclude.indexOf(Number(entity.id)) === -1) {
                        modules.library.actions.item.pop(entity);
                    }
                });

                // close or move to the next media if the modal is open
                if (modules.modal && modules.modal.actions.isOpen()) {
                    if (modalWasOpenInBulk || !modules.library.actions.items().length) {
                        // it's in bluk or there is no mode items on library: close
                        modules.modal.actions.close();
                    } else {
                        // it's on single action and there are items left on library: move next
                        modules.modal.actions.next();
                        modules.modal.actions.navigation(modules.library.actions.items());
                    }
                }

                // remove the entity from library
                batch.map(function(entity) {
                    if (exclude.indexOf(Number(entity.id)) === -1) {
                        var index = genericBackend.findMediaById(entitiesList, entity.id);
                        if (index >= 0) {
                            entitiesList.splice(index, 1);
                        }
                    }
                });

                // if there's no more media on the list, reload the libray
                if (modules.filters) {
                    if (!modules.library.actions.items().length) {
                        // action just performed, so, this timeout gives time to impact on ES
                        loading.on();
                        $timeout(function() {
                            exports.loadContent();
                        }, 500);
                    } else {
                        refreshFiltersOnBackground();
                    }
                }

                exports.scope.bulkSelected = false;

                return {batch: batch, result: result};
            };

            var showMsg = function(result, batch, msg) {
                if (result.ok) {
                    var message = (!angular.isObject(msg) ? msg : (result.ok > 1 ? msg.plural : msg.singular));
                    growl.addSuccessMessage(message.assign({ ok: result.ok, total: batch.length}));
                }
                if (result.failed) {
                    var errorList = {};
                    angular.forEach(result.errors, function(error) {
                        var key = JSON.stringify(error);
                        errorList[key] = (errorList[key] || 0) + 1;
                    });

                    angular.forEach(errorList, function(cant, msg) {
                        growl.addErrorMessage('{i} of {n} failed: {msg}'.assign({i: cant, n: batch.length, msg: msg}));
                    });
                }
            };

            var promiseErrorHandler = function(err) {
                loading.off();
                // if the user cancel the request, err is null;
                err = err || {};
                var msg = err.statusText || err.message || '';
                if (err.data && err.data.data && err.data.data.error_long_message) {
                    msg = err.data.data.error_long_message;
                } else if (err.data && err.data.metadata && err.data.metadata.message) {
                    msg = err.data.metadata.message;
                }
                growl.addErrorMessage(msg);
            };

            /**
             * A dictionary with all the possible sorting options the Olapic currently supports.
             * @type {Object}
             */
            var sortingPresets = {
                ctr: {
                    title: 'Click Through Rate',
                    value: [{key: 'ctr', order: 'desc'}]
                },
                oldest: {
                    title: 'Oldest',
                    value: [{key: 'date', order: 'asc'}]
                },
                newest: {
                    title: 'Newest',
                    value: [{key: 'date', order: 'desc'}]
                },
                oldest_updated: {
                    title: 'Oldest',
                    value: [{key: 'date_updated', order: 'asc'}]
                },
                newest_updated: {
                    title: 'Newest',
                    value: [{key: 'date_updated', order: 'desc'}]
                },
                photorank: {
                    title: 'Photorank',
                    value: [{key: 'score', order: 'desc'}]
                }
            };

            /**
             * @name getSortingPreset
             *
             * @description
             * Given a sorting key, it wil try to return the value from the sorting presets, if
             * the key is not in the sortingPresets it will return the key and throw an error to
             * inform that an invalid key was used.
             *
             * @param  {String} key The name of the sorting preset: ctr, oldest, newest or
             *                      photorank.
             * @return {Object|String} Object if the preset exists, or the name if it doesn't.
             */
            var getSortingPreset = function(key) {
                var result;
                if (sortingPresets[key]) {
                    result = sortingPresets[key];
                } else {
                    throw new Error('Invalid sorting key: ', key);
                }

                return result || key;
            };

            var prepareAggreations = function(aggs) {
                var unique_aggs = [];
                var final_aggs = [];
                aggs.forEach(function(item){
                    unique_aggs[item.key] = item;
                });
                exports.query.aggs.forEach(function(item) {
                    unique_aggs[item.key] = item;
                });
                for(var agg in unique_aggs){
                    final_aggs.push(unique_aggs[agg]);
                }
                return final_aggs;
            };

            exports.getDefaultQueryAggregations = function() {
                return [
                    {key: 'mentioned_username'},
                    {key: 'rights_programmatic'},
                    {key: 'hashtag'},
                    {key: 'rights'},
                    {key: 'stream'},
                    {key: 'keywords_raw'},
                    {key: 'user'},
                    {key: 'source'},
                    {key: 'source_group'},
                    {key: 'media_type'},
                    {key: 'place'},
                    {key: 'country'},
                    {key: 'state'},
                    {key: 'city'}
                ];
            };

            // Default query
            exports.query = {
                aggs: exports.getDefaultQueryAggregations(),
                filters: {},
                staticFilters: {
                    phrase: ''
                },
                // This is later parsed after getSortingPreset is defined
                sort: ['newest'],
            };

            $rootScope.$on(AUTH_EVENTS.accountChange, function() {
                exports.query.aggs = exports.getDefaultQueryAggregations();
            });

            exports.setQuery = function(q) {
                if(q.sort){
                    q.sort = getSortingPreset(q.sort).value;
                }
                if(q.aggs){
                    q.aggs = prepareAggreations(q.aggs);
                }
                exports.query = angular.extend(exports.query, q);
            };

            exports.pageSize = 30;
            exports.bulkLimit = 30;

            exports.getProfile = genericBackend.getProfile;

            exports.scope = mmScope;

            // Parse the sorting of the default query.
            exports.query.sort = getSortingPreset(exports.query.sort).value;

            exports.backend = genericBackend;

            exports.chain = chain;

            exports.isModalInBulk = function() {
                return entitiesList.length > 1;
            };

            exports.actions = {};

            var basicAction = function(args) {
                return new ActionService({
                    title: args.title,
                    iconClass: args.icon,
                    callback: function(batch) {
                        batch = toArray(batch);
                        var action = function() {
                            loading.on();
                            args.backend(batch).then(function(response) {
                                loading.off();
                                var result = extractResponse(response);
                                showMsg(result, batch, args.message);
                                return removeEntities(batch, result);
                            }, function(error) {
                                promiseErrorHandler(error);
                            }).then(args.callback);
                        };

                        if (args.confirm) {
                            popup.confirm(args.confirm.assign({n: batch.length})).result.then(action);
                        } else {
                            action();
                        }
                    }
                });
            };

            var defaultArg = function(args, key) {
                return angular.isFunction(args[key]) ? args[key] : args;
            };

            exports.actions.reject = function(args, extras) {
                return basicAction(angular.extend({
                    title: 'Reject',
                    icon: 'bin',
                    backend: defaultArg(args, 'backend'),
                    callback: args.thenCallback,
                    message: {
                        singular: 'Media was successfully rejected',
                        plural: '{ok} of {total} media has been successfully rejected'
                    },
                    confirm: 'Are you sure you want to reject {n} media?'
                }, extras));
            };

            exports.actions.approve = function(args, extras) {
                return basicAction(angular.extend({
                    title: 'Approve',
                    icon: 'check',
                    backend: defaultArg(args, 'backend'),
                    callback: args.thenCallback,
                    message: {
                        singular: 'Media was successfully approved',
                        plural: '{ok} of {total} media has been successfully approved'
                    }
                }, extras));
            };

            exports.actions.spam = function(args, extras) {
                return basicAction(angular.extend({
                    title: 'Flag as spam',
                    icon: 'block',
                    backend: defaultArg(args, 'backend'),
                    callback: args.thenCallback,
                    message: '{ok} of {total} media has been successfully flagged as spam.',
                    confirm: 'Are you sure you want to flag {n} media as spam?'
                }, extras));
            };

            exports.actions.backToMq = function(args, extras) {
                return basicAction(angular.extend({
                    title: 'Send to moderation queue',
                    icon: 'arrow_left',
                    backend: defaultArg(args, 'backend'),
                    callback: args.thenCallback,
                    message: {
                        singular: 'Media was successfully sent back to Moderation Queue',
                        plural: '{ok} of {total} media has been successfully sent back to Moderation Queue'
                    },
                    confirm: 'Are you sure you want to send {n} media back to Moderation Queue?'
                }, extras));
            };

            exports.actions.blacklist = function(args, extras) {
                var successMessage = {
                    singular: 'Media was successfully rejected',
                    plural: '{ok} of {total} media has been successfully rejected'
                };

                return new ActionService(angular.extend({
                    title: 'Blacklist user',
                    iconClass: 'blacklist',
                    showIf: function(media) {
                        media = toArray(media);

                        if (media.length > 0) {
                            return media.every(function(media) {
                                return media.source.name === 'instagram' || media.source.name === 'twitter';
                            });
                        }
                    },
                    callback: function(media) {
                        var selectedMedia = toArray(media);

                        popup.confirm('Are you sure you want to add the given user(s) to the blacklist?')
                            .result.then(function() {
                                loading.on();

                                blacklistUserService.blacklistUser(selectedMedia)
                                    .then(function(blackListResponse) {
                                        var mediaData = {
                                            toReject: [],
                                            alreadyExists: [],
                                            failed: []
                                        };

                                        blackListResponse.data.user_blacklist.forEach(function(user) {
                                            selectedMedia.forEach(function(media) {
                                                if (parseInt(user.user_id) === media.user.id &&
                                                    (user.status === 200 || user.status === 409)) {
                                                    mediaData.toReject.push(media);
                                                }
                                            });
                                        });

                                        blackListResponse.data.user_blacklist.forEach(function(user) {
                                            if (user.status === 409) {
                                                mediaData.alreadyExists.push(user.user_id);
                                            } else if (user.status !== 409 && user.status !== 200) {
                                                mediaData.failed.push(user.user_id);
                                            }
                                        });

                                        // Show success message when no error is presented
                                        if (mediaData.alreadyExists.isEmpty()) {
                                            growl.addSuccessMessage('The user(s) has been successfully added to the ' +
                                                'blacklist. It may take up to 24hrs for our system to blacklist any ' +
                                                'existing content.');
                                        }

                                        // Show errors if exists
                                        if (!mediaData.alreadyExists.isEmpty()) {
                                            growl.addErrorMessage('{n} of {total} users are already blacklisted.'
                                                .assign({
                                                    n: mediaData.alreadyExists.length,
                                                    total: blackListResponse.data.user_blacklist.length
                                                }));
                                        }

                                        if (!mediaData.failed.isEmpty()) {
                                            growl.addErrorMessage('Some errors occurred from the blacklist service.');
                                        }

                                        if (!mediaData.toReject.isEmpty()) {
                                            // Just reject media which were blacklisted
                                            mediaChangeStatusService.rejectMedia(mediaData.toReject)
                                                .then(function(rejectResponse) {
                                                    loading.off();
                                                    var result = extractResponse(rejectResponse);

                                                    selectedMedia.forEach(function(media) {
                                                        if (Object.keys(rejectResponse.data.media)
                                                            .indexOf(media.id.toString()) === -1) {
                                                            result.exclude.push(media.id);
                                                        }
                                                    });
                                                    showMsg(result, selectedMedia, successMessage);

                                                    return removeEntities(selectedMedia, result);
                                                }, function() {
                                                    loading.off();
                                                    growl.addErrorMessage('We could not reject the selected media.');
                                                }
                                            );
                                        } else {
                                            loading.off();
                                        }
                                    });
                            });
                    }
                }, extras));
            };

            exports.actions.sfl = function(args, extras) {
                return basicAction(angular.extend({
                    title: 'Save for Later',
                    icon: 'time',
                    backend: defaultArg(args, 'backend'),
                    callback: args.thenCallback,
                    message: {
                        singular: 'Media was successfully moved to Save for Later',
                        plural: '{ok} of {total} media was successfully moved to Save for Later.'
                    }
                }, extras));
            };

            exports.actions.syndicationBadge = function(extras) {
                return new ActionService(angular.extend({
                    title: 'syndication',
                    iconClass: 'rss',
                    showIf: function() {
                        //TODO find out when to show this badge
                        return false;
                    }
                }, extras));
            };

            exports.actions.rightsRequestedBadge = function(extras) {
                return new ActionService(angular.extend({
                    title: 'rights-requested',
                    iconClass: 'thumbs-o-up',
                    showIf: function(media) {
                        if (angular.isArray(media)) {
                            return media.some(function(item) {
                                return item.rights === 'REQUESTED';
                            });
                        } else {
                            return media.rights === 'REQUESTED';
                        }
                    }
                }, extras));
            };

            exports.actions.rightsGivenBadge = function(extras) {
                return new ActionService(angular.extend({
                    title: 'rights-given',
                    iconClass: 'thumbs-o-up',
                    showIf: function(media) {
                        if (angular.isArray(media)) {
                            return media.some(function(item) {
                                return item.rights === 'GIVEN';
                            });
                        } else {
                            return media.rights === 'GIVEN';
                        }
                    }
                }, extras));
            };

            exports.actions.reportedBadge = function(extras) {
                return new ActionService(angular.extend({
                    title: 'reported',
                    iconClass: 'exclamation-circle',
                    showIf: function(media) {
                        if (angular.isArray(media)) {
                            return media.some(function(item) {
                                return item.status_id === API_MEDIA_STATUSES_ID.REPORTED;
                            });
                        } else {
                            return media.status_id === API_MEDIA_STATUSES_ID.REPORTED;
                        }
                    }
                }, extras));
            };

            exports.setModules = function(m) {
                allowToLoadMoreContent = false;
                var modal = m.modal;
                var box = m.box;
                var library = m.library;
                modules = angular.extend(modules, m);

                if (angular.isDefined(modal)) {
                    modal.callbacks.afterMove = chain(
                        modal.callbacks.afterMove,
                        function(direction, entity) {
                            entitiesList = toArray(entity);
                        }
                    );

                    modal.callbacks.afterClose = chain(
                        modal.callbacks.afterClose,
                        function() {
                            // Very tricky. Check inline comment on box.callbacks.afterPhotoClick
                            mmScope.isLoading = false;
                            mmScope.bulkSelected = false;
                            entitiesList = [];
                            angular.forEach(library.actions.items(), function(entity) {
                                entity.checked = false;
                            });
                            if (settings.photorankIframe) {
                                if (window !== top) {
                                    top.postMessage('showMenu', appConstant.photorank.url);
                                }
                            }

                        }
                    );
                }

                if (angular.isDefined(box)) {
                    box.callbacks.afterPhotoClick = chain(
                        box.callbacks.afterPhotoClick,
                        function(entity) {
                            exports.openModal([entity]);
                            return this.result;
                        }
                    );
                }
            };

            /**
             * Empty the entities list and unset the bulk action flag.
             */
            exports.cleanEntitiesList = function() {
                entitiesList = [];
                mmScope.bulkSelected = false;
                filterTrackingHelper.clear();
            };

            exports.getStreamsForTagging = function(media) {
                var streams = [];
                if (angular.isArray(media)) {
                    if (media.length === 1) {
                        streams = media[0].streams;
                    } else {
                        streams = genericBackend.extractStreamsFromMediaBatch(media);
                    }
                } else {
                    streams = media.streams;
                }
                return streams;
            };

            var modalWasOpenInBulk = false;
            exports.openModal = function(entities, options) {
                // entities[1].id = 123129831928; // uncomment to force backend error for testing purposes
                var modal = modules.modal;
                var library = modules.library;

                modalWasOpenInBulk = exports.isModalInBulk();
                options = options || {};
                entitiesList = toArray(entities);

                // Very tricky For some reason, when you open the modal and you have
                // enabled the inifinescroll on library, a loadMore is triggered on it.
                // this put the library on "isLoading" status to prevent the loadMore be
                // triggered. Check modal.calbacks.afterClose also.
                mmScope.isLoading = true;

                if (exports.isModalInBulk()) {
                    modal.actions.setTitle('Edit Selected Media');
                } else {
                    modal.actions.setTitle('Edit Media');
                }

                if (settings.photorankIframe) {
                    if (window !== top) {
                        top.postMessage('hideMenu', appConstant.photorank.url);
                    }
                }

                modal.actions.navigation(library.actions.items());
                modal.actions.open(entities, options);
            };

            // Return a new array without the empty filters
            var claenEmptyFilters = function(filters) {
                return filters.filter(function(item) {
                    return item.values.length;
                });
            };
            /**
             * @name loadFiltersInfo
             *
             * @description
             * Loads the aggs for the filters component and fills it with the corresponding data.
             *
             * @param filters  {filtersService}  Filters instance
             *
             * @return {Promise}
             */
            var loadFiltersInfo = function() {
                var promises = [];
                promises.push(
                    asyncSettingsService.isPhotoFiltersEnabled().then(function(enabled) {
                        if(enabled){
                              exports.setQuery({
                                  aggs: [
                                      {key: 'with_labels'},
                                      {key: 'without_labels'},
                                  ]
                              });
                        }
                    })
                );
                promises.push(
                  asyncSettingsService.isLanguageDetectionEnabled().then(function(enabled) {
                      if(enabled){
                          exports.setQuery({
                            aggs: [
                                {key: 'detected_languages'},
                            ]
                          });
                      }
                  })
                );

                $q.all(promises).then(function() {
                    var q = angular.copy(exports.query);
                    var url = appConstant.adminAPI2.url + endpoints.mediaSearch + '?count=0';
                    modules.filters.isLoading = true;
                    return apiService.post(url, q).then(genericBackend.prepareAggs).then(function(res) {
                        modules.filters.actions.fill(claenEmptyFilters(res.data.aggs));
                        if (angular.isDefined(res.data.pagination.total)) {
                            modules.filters.actions.fillTotal(res.data.pagination.total);
                        }
                        return res;
                    }).catch(function() {
                        growl.addErrorMessage('Uh Oh! There was an error when trying to load filters information.');
                    }).finally(function() {
                        modules.filters.isLoading = false;
                    });
                });
            };

            exports.loadFiltersInfo = loadFiltersInfo;

            var stopRefreshingFilters;
            var refreshFiltersOnBackground = function() {
                $timeout.cancel(stopRefreshingFilters);
                stopRefreshingFilters = $timeout(function() {
                    loadFiltersInfo();
                }, 2000);
            };
            exports.refreshFiltersOnBackground = refreshFiltersOnBackground;

            /**
             * @name emitFilterSearchEvent
             *
             * @description Emit page view event to external tracking service with the filter search term and
             * the current section.
             *
             * @param {string} searchQuery to send
             */
            var emitFilterSearchEvent = function(searchQuery) {
                var page = '/' + sectionService.current() + '/search';

                $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.pageView.search, page, searchQuery);
            };

            /**
             * @name emitFilterSelectedEvent
             *
             * @description Emit page view event to external tracking service with the selected filter as search term
             * and the current section.
             *
             * @param {string} group the filter belongs to
             * @param {string} item selected
             */
            var emitFilterSelectedEvent = function(group, item) {
                var page = '/' + sectionService.current() + '/filter/' + group;

                $rootScope.$emit(EXTERNAL_TRACKING_EVENTS.pageView.search, page, item);
            };

            /**
             * @name emitLastSelectedMetadataFilter
             *
             * @description Since the 'filterService' service returns the whole list of selected filters when the user
             * clicks on some of them, It compares the previous selection and discovers which one is the new selected one.
             *
             * @param {Array} selectedFilters the list of selected filters
             */
            var emitLastSelectedMetadataFilter = function(selectedFilters) {
                var selectedMetadataFilters;
                var lastMetadataSelected;

                if (selectedFilters && selectedFilters.keywords_raw) {
                    selectedMetadataFilters = selectedFilters.keywords_raw.values;

                    if (!metadataFiltersPreviousSelection) {
                        lastMetadataSelected = selectedMetadataFilters[0];
                    } else {
                        selectedMetadataFilters.forEach(function(item) {
                            if (metadataFiltersPreviousSelection.indexOf(item) < 0) {
                                lastMetadataSelected = item;
                            }
                        });
                    }
                }

                metadataFiltersPreviousSelection = selectedMetadataFilters;

                if (lastMetadataSelected) {
                    emitFilterSelectedEvent('metadata', lastMetadataSelected);
                }
            };

            autocompleteHelper.onSelect = function() {
                //After select an autocomplete option, send a page view event with the search term.
                emitFilterSearchEvent(exports.query.staticFilters.phrase.title);
                exports.query.staticFilters.phrase = '';
            };
            autocompleteHelper.onSelectStream = function(stream) {
                exports.query.staticFilters.phrase = '';
                modules.filters.actions.injectFilterCondition('stream', parseInt(stream.key));
            };
            autocompleteHelper.onSelectUser = function(user) {
                exports.query.staticFilters.phrase = '';
                modules.filters.actions.injectFilterCondition('user', user.key);
            };
            autocompleteHelper.onSelectPlace = function(place) {
                exports.query.staticFilters.phrase = '';
                modules.filters.actions.injectFilterCondition('place', place.name);
            };
            autocompleteHelper.onSelectHashtag = function(hashtag) {
                exports.query.staticFilters.phrase = '';
                modules.filters.actions.injectFilterCondition('hashtag', hashtag.key);
            };
            exports.getFilterService = function(data) {
                exports.query.aggs.forEach(function(agg) {
                    if (angular.isUndefined(agg.values)) {
                        agg.values = [];
                    }
                });
                exports.query.staticFilters.phrase = '';

                modules.filters = new FiltersService(angular.extend({
                    query: exports.query,
                    templatePath: 'rome/filters/',
                    autocompleteService: autocompleteHelper.service,
                    showTotal: {position: 2},
                    loading: exports.query.aggs,
                    callbacks: {
                        onChange: function() {
                            // If phrase is a empty string means there are suggestion in the autocomplete.
                            if (exports.query.staticFilters.phrase) {
                                //send a page view event with the search term.
                                emitFilterSearchEvent(exports.query.staticFilters.phrase);
                            }

                            //keywords_raw (metadata) filter triggers an event to be externally tracked
                            emitLastSelectedMetadataFilter(exports.query.filters);
                            //Send filter tracking data.
                            filterTrackingHelper.filterApplied(exports.query.filters);

                            // clear selection and reload filters and media
                            entitiesList = [];
                            loadFiltersInfo();
                            exports.loadContent({clearCache: true});
                        },
                        afterClearAll : [
                            filterTrackingHelper.clear
                        ]
                    },
                    itemsOrder: {
                        with_labels: 15,
                        without_labels: 16,
                        detected_languages: 17,
                        rights_programmatic: 18,
                        status: 19,
                        mentioned_username: 20,
                        video: 21,
                        photo: 22,
                        tagged: 23,
                        'not tagged': 24,
                        hashtag: 25,
                        stream: 26,
                        keywords_raw: 27,
                        rights: 28,
                        source: 29,
                        user: 30,
                        place: 40,
                        country: 41,
                        state: 42,
                        city: 43,
                        source_group: 51,
                        media_type: 52
                    }
                }, data));

                loadFiltersInfo();
                metadataFiltersPreviousSelection = null;

                return modules.filters;
            };

            exports.getStatusFilterService = function(settings, filtersService) {
                return new StaticFiltersService(angular.extend({
                    templatePath: 'rome/filters/',
                    label: 'Status',
                    position: 5,
                    data: [
                        {title: 'Pending', value: 20},
                        {title: 'Save for Later', value: 23},
                        {title: 'Reported', value: 22}
                    ],
                    callbacks: {
                        onChange: function(item) {
                            filtersService.actions.replaceFilterCondition('status_id', item.value);
                            loadFiltersInfo();
                        }
                    }
                }, settings));
            };

            /**
             * Return the selected option for the filter Data option.
             */
            var getDefaultFilterOption = function(item) {
                return item.default === true;
            };

            exports.getSortFilterService = function(settings) {
                settings = settings || {};
                settings.data = settings.data || [
                    {title: 'Click Through Rate', value: 'ctr', default: false},
                    {title: 'Oldest', value: 'oldest', default: false},
                    {title: 'Newest', value: 'newest', default: false},
                    {title: 'Photorank', value: 'photorank', default: true}
                ];

                return new StaticFiltersService(angular.extend({
                    templatePath: 'rome/filters/',
                    position: 4,
                    label: 'Sorting',
                    initialValue: settings.data.find(getDefaultFilterOption),
                    data: settings.data,
                    callbacks: {
                        onChange: function(item) {
                            exports.query.sort = getSortingPreset(item.value).value;
                            exports.loadContent({clearCache: true});
                        }
                    }
                }, settings));
            };

            exports.getBoxService = function(data) {
                data = data || {};
                var bulkLimit = exports.getBulkLimit();

                return new BoxService(angular.extend({
                    type: 'media',
                    templatePath: 'rome/box/',
                    showCheckbox: true,
                    headerActions: {
                        directive: '<op-actions actions="actions" template-path="rome/actions/"' +
                            'entity="entity" list-limit="' + (data.listLimit || 3) + '"></op-actions>'},
                    callbacks: {
                        afterCheckboxChange: function(entity) {
                            if (entitiesList.indexOf(entity) >= 0) {
                                entitiesList.splice(entitiesList.indexOf(entity), 1);
                            } else {
                                if (entitiesList.length >= bulkLimit) {
                                    entity.checked = false;
                                    growl.addErrorMessage(
                                        'You\'ve reached the maximum of {limit} selected items'
                                        .assign({limit: bulkLimit})
                                    );
                                } else {
                                    entitiesList.push(entity);
                                }
                            }
                        }
                    },
                    carousel: genericBackend.extractAllStreamsFromMedia
                }, data));
            };

            exports.getMediaNextPage = function(finish) {
                if (allowToLoadMoreContent && nextPage) {
                    exports.requestContent(nextPage, exports.query).then(function(data) {
                        finish(data);
                    });
                }
            };

            exports.getLibraryService = function(data) {
                return new LibraryService(angular.extend({
                    templatePath: 'rome/library/',
                    inifinteScroll: true,
                    callbacks: {
                        loadContent: exports.getMediaNextPage
                    },
                }, data));
            };

            var linkStreamToMedia = function(data, backend, metadataValue) {
                loading.on();
                data = angular.extend({streamsToLink: [], streamsToUnlink: []}, data);
                var entities = !exports.isModalInBulk() ? entitiesList[0] : entitiesList;
                return genericBackend.linkStreamsToMedia(
                    entities,
                    data.streamsToLink,
                    data.streamsToUnlink
                ).then(function(result) {
                    backend.trackAssing(entities, data, metadataValue);
                    growl.addSuccessMessage('The stream has been added update.');
                    return result;
                }, promiseErrorHandler).finally(function() {
                    loading.off();
                });
            };

            exports.getTaggingService = function(backend, extras) {
                var next;
                var getStreams = function(url) {
                    return apiService.get(url).then(function(response) {
                        next = response.data.pagination.next;
                        var batch = response.data.streams.map(adminAPIService.streamNormalizer);
                        return {batch: batch, nextPage: next};
                    })
                    .catch(function(err) {
                        if (err.data && err.data.metadata.code !== 404) {
                            promiseErrorHandler(err);
                        }
                        return {batch: [], nextPage: false};
                    });
                };
                return new TaggingService(angular.extend({
                    templatePath: 'rome/tagging/',
                    sorting: true,
                    callbacks: {
                        itemRemoved: function(stream) {
                            return linkStreamToMedia({streamsToUnlink: [stream]}, backend);
                        },
                        itemAdded: function(stream, scope, metadataValue) {
                            return linkStreamToMedia({streamsToLink: [stream]}, backend, metadataValue);
                        },
                        emptyField: function() {
                            modules.modal.preview.hide();
                        },
                        loadContent: function(query, finish) {
                            modules.modal.preview.hide();
                            getStreams(
                                appConstant.adminAPI2.url + endpoints.streamSearch.assign({
                                    phrase: encodeURIComponent(query.q),
                                    size: query.size
                                })
                            ).then(finish);
                        },
                        loadMoreContent: function(finish) {
                            if (!next) {
                                finish({batch: []});
                            } else {
                                getStreams(next).then(finish);
                            }
                        },
                        resultItemOnHover: function(entity) {
                            modules.modal.preview.update(entity.base_image);
                            modules.modal.preview.show();
                        },
                        resultItemOnOut: function() {
                            modules.modal.preview.hide();
                        },
                        saveSorting: function() {
                            // we're not going to track streams position changes
                            return linkStreamToMedia({streamsToLink: [], streamsToUnlink: []}, backend);
                        }
                    }
                }, extras));
            };

            exports.getModalService = function(modalScope, extras, data) {
                data = data || {};
                modalScope.modal = new ModalService(angular.extend({
                    title: 'Media',
                    templatePath: 'rome/modal/',
                    enableAnnotations: {
                        status: true
                    },
                    fullscreen: true,
                    zoom: true,
                    directives: [{
                        selector: '.modal-tools',
                        directive: '<op-actions actions="actions" template-path="rome/actions/"' +
                            'entity="entity" list-limit="' + (data.listLimit || 3) + '"></op-actions>',
                        scope: function() {
                            modalScope.entity = entitiesList;
                            return modalScope;
                        }
                    }],
                    callbacks: {
                        afterRemovingItem: function() {
                            if (exports.isModalInBulk()) {
                                modalScope.streamsForTagging = exports.getStreamsForTagging(entitiesList);
                            }
                        }
                    },
                    extras: extras.map(function(extra) {
                        extra = toArray(extra);
                        switch (extra[0]) {
                            case 'tagging': return angular.extend({
                                    title: 'Tagging',
                                    role: 'TaggingService',
                                    tabIcon: 'tag',
                                    directive: '<op-tagging streams="streamsForTagging"' +
                                        'media="entity"' +
                                        'is-suggestion-available="isSuggestionAvailable"' +
                                        'is-suggestion-from-crop-available="isSuggestionFromCropAvailable"' +
                                        '></op-tagging>',
                                    scope: modalScope,
                                    before: function() {
                                        modalScope.streamsForTagging = [];
                                    },
                                    after: function(data) {
                                        modalScope.streamsForTagging = exports.getStreamsForTagging(data);
                                    }
                                }, extra[1]);
                        }
                    })
                }, data));
                return modalScope.modal;
            };

            // to be overwrite on the application
            exports.afterLoadContent = function(data) {
                return data;
            };

            // please don't remove the console logs, the asynchronicisyt of this method it's pretty hard to debug
            var cache;
            exports.requestContent = function(url, query, paginate, options) {
                options = options || {};
                var deferred = $q.defer();
                if (!cache || options.clearCache || !settings.preloadContent) {
                    cache = apiService.post(url, query);
                }
                $q.all([
                    // 1. differ library clearing due its impact on performance
                    $timeout(function() {
                        // console.log(1, 'loading ON & clearing library');
                        loading.on();
                        if (!!paginate) {
                            modules.library.actions.clear(paginate);
                        }
                    }),
                    // while it triggers the request at the same time
                    cache
                ]).then(function(result) {
                    // at this point, we have the response back (either from the cache or from backend)
                    // AND the library has been cleaned
                    return result[1]; // we're only intrested on the result of `requestData`
                })
                .then(genericBackend.fillMediaData)
                .then(genericBackend.addProperties)
                .then(function(res) {
                    modules.library.actions.fill(res.data.media);
                    allowToLoadMoreContent = true;
                    nextPage = res.data.pagination.next;
                    if (settings.preloadContent) {
                        if (!nextPage) {
                            cache = $q.when({data:{media: [], pagination: {}, aggs: []}});
                        } else {
                            cache = $timeout(function() {
                                var secondPage = angular.copy(nextPage);
                                return apiService.post(secondPage, query);
                            });
                        }
                    }
                    deferred.resolve(res);
                    return res;
                })
                .then(exports.afterLoadContent)
                .catch(function() {
                    growl.addErrorMessage('Uh Oh! There was an error when trying to load media.');
                })
                .finally(function() {
                    // 3. stopping the loading after the first 15th elements have been linked
                    // console.log(3, 'loading OFF');
                    mmScope.isLoading = false;
                    loading.off();
                });
                return deferred.promise;
            };

            exports.loadContent = function(options) {
                var query = angular.copy(exports.query);
                delete query.aggs;
                return exports.requestContent(
                    endpoints[settings.bucket] + '?count=' +  exports.pageSize,
                    query,
                    settings.cleanLibraryOnLoad,
                    options
                );
            };

            exports.actionsOverSelectedItems = function() {
                exports.openModal(entitiesList);
            };

            exports.bulkTooltip = function() {
                var message = '';

                if (mmScope.bulkSelected) {
                    message = 'Unselect all the items';
                } else {
                    message = 'Select up to {limit} items'.assign({limit: exports.getBulkLimit()});
                }
                return message;
            };

            exports.bulkSelection = function() {
                var bulkLimit = 0;
                entitiesList = [];
                mmScope.bulkSelected = !mmScope.bulkSelected;

                if (!mmScope.bulkSelected) {
                    // let's clean the whole selection
                    angular.forEach(modules.library.actions.items(), function(item) {
                        item.checked = false;
                    });
                } else {
                    // let's select the first `bulkLimit` items
                    bulkLimit = exports.getBulkLimit();
                    angular.forEach(modules.library.actions.items(), function(item, i) {
                        if (i < bulkLimit) {
                            item.checked = mmScope.bulkSelected;
                            if (item.checked) {
                                entitiesList.push(item);
                            }
                        }
                    });
                }
                mmScope.entitiesList = entitiesList;
            };

            exports.getBulkLimit = function() {
                return (exports.bulkLimit) ? exports.bulkLimit : exports.pageSize;
            };

            return exports;
        };
    }
]);
