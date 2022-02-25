'use strict';

angular.module('expressModeration')
.controller('expressModerationController', [
    '$scope',
    '$timeout',
    'loadingService',
    'modalService',
    'notifications',
    'ExpressModerationHelperFactory',
    'sectionService',
    'StaticFiltersService',
    'translateService',
    'translateConfig',
    '$localStorage',
    '$location',
    'EXTERNAL_TRACKING_EVENTS',
    'asyncSettingsService',
    function(
        $scope,
        $timeout,
        loading,
        ModalService,
        growl,
        helperService,
        section,
        StaticFiltersService,
        translateService,
        translateConfig,
        $localStorage,
        $location,
        EXTERNAL_TRACKING_EVENTS,
        asyncSettingsService
    ) {
        loading.on();

        section.in('expressmoderation');

        var masterMind = helperService.masterMind;

        $scope.isLoading = masterMind.scope.isLoading;
        $scope.showFilters = true;

        /*
        * Key Navigation
        * @description
        * Add event to the key when the library is rendered
        */
        var focusOnSelectedElement = function(entity) {
            var boxOffset = entity.offset().top - 0.37 * entity.prop('offsetHeight');
            var boxHeight = entity.outerHeight();
            var bodyScroll = angular.element('body').scrollTop();
            var viewportHeight = angular.element(window).height();
            if (boxOffset < bodyScroll || boxOffset < boxHeight) {
                angular.element('html, body').animate({
                    scrollTop: entity.offset().top - 0.37 * entity.prop('offsetHeight')
                }, 50);
            } else if (boxOffset + boxHeight > bodyScroll + viewportHeight) {
                angular.element('html, body').animate({
                    scrollTop: boxOffset - viewportHeight + boxHeight + 200
                }, 50);
            }
        };

        var buildKeyNavigation = function() {
            $('.box-container').keynavigator({
                cycle: true,
                activeClass: 'box-media-active',
                useCache: false,
                keys:{
                    32: function(ele) {
                        angular.element('.box-media-check', ele[0]).click();
                    },
                    90: function(ele) {
                        angular.element('.box-hover-bg', ele[0]).click();
                    },
                    13: function() {
                        if (!$scope.isLoading) {
                            $scope.bulkAction();
                        }
                    }
                },
                onAfterActive: function() {
                    focusOnSelectedElement(angular.element('.box-media-active'));
                }
            });
            $timeout(function() {
                angular.element('.library-media-container > div > div:first-child').click();
            });
        };

        masterMind.setQuery({
            filters: {
                status_id: {
                    values: [21]
                }
            },
            sort: 'photorank'
        });

        // we use the object 'actions' inside the actions's callbacks for better readability;
        var actions = {};
        actions.approve = masterMind.actions.approve(helperService.approveMedia);
        actions.reject = masterMind.actions.reject(helperService.rejectMedia);
        actions.spam = masterMind.actions.spam(helperService.flagMediaAsSpam);
        actions.blacklist = masterMind.actions.blacklist();
        $scope.actions = [
            actions.approve,
            actions.reject,
            actions.spam,
            actions.blacklist
        ];

        /**
         * @name isLibraryInBulk
         *
         * @description Check if the library has more than one media selected
         *
         * @returns {boolean} returns true when the are more than one media selected and false the other way round.
         */
        $scope.isLibraryInBulk = function() {
            var selectedItemInGallery = [];

            if ($scope.library.actions.items()) {
                selectedItemInGallery = $scope.library.actions.items().filter(function(m) {
                    return m.checked;
                });
            }
            return selectedItemInGallery.length > 1;
        };

        $scope.blacklistBulkAction = function() {
            var media = $scope.library.actions.items().filter(function(m) {
                return m.checked;
            });

            if (media) {
                actions.blacklist.callback(media);
            }
        };

        $scope.checkBlacklistButtonStatus = function() {
            var thereAreInvalid = $scope.library.actions.items() ?
                $scope.library.actions.items().filter(function(media) {
                    return media.checked;
                }).every(function(media) {
                    return media.source.name === 'instagram' || media.source.name === 'twitter';
                }) : false;

            return ($scope.isLibraryInBulk() && thereAreInvalid);
        };

        $scope.reportSpamAction = function() {
            var media = $scope.library.actions.items().filter(function(m) {
                return m.checked;
            });

            if (media && $scope.isLibraryInBulk()) {
                actions.spam.callback(media);
            }
        };

        $scope.bulkAction = function() {
            if (!$scope.library.actions.items().length) {
                return;
            }
            loading.on();
            if ($scope.modal.actions.isOpen()) {
                $scope.modal.actions.close();
            }
            $scope.isLoading = true;
            var entities = $scope.library.actions.items();
            helperService.bulkMedia(entities).then(function(result) {
                growl.addSuccessMessage(
                    ('Approved: {approved}<br/>Removed: {rejected}').assign(result.stats), {enableHtml: true}
                );
                if (result.stats.error) {
                    growl.addErrorMessage(('Error: {error}').assign(result.stats), {enableHtml: true});
                }
            }).catch(function(err) {
                growl.addErrorMessage((err.data && err.data.data && err.data.data.error_long_message) ?
                    err.data.data.error_long_message : 'Something went wrong. Please try again in a few'
                );
            }).finally(function() {
                $scope.library.actions.clear();
                // clean selected items from MM scope
                masterMind.cleanEntitiesList();
                masterMind.refreshFiltersOnBackground();

                if ($scope.library.actions.items().length === 0) {
                    masterMind.loadContent();
                } else {
                    loading.off();
                    $scope.isLoading = false;
                }
            });
        };

        $scope.modal = new ModalService({
            title: 'Media',
            templatePath: 'rome/modal/',
            fullscreen: false,
            zoom: true,
            directives: [{
                selector: '.modal-tools',
                directive: '<op-actions actions="actions" template-path="rome/actions/" ' +
                    'entity="entity"></op-actions>',
                scope: function(settings) {
                    var newScope = $scope.$new();
                    newScope.entity = settings.current[0];
                    return newScope;
                }
            }],
            translate: translateService({
                templatePath: 'rome/translate/'
            })
        });

        var selectCurrent = function(entity) {
            if (entity && entity.id) {
                var selectorBox = $('#box-' + entity.id + ' .box-header')[0];

                if (selectorBox) {
                    $timeout(function() {
                        selectorBox.click();
                    });
                }
            }
        };

        var box = masterMind.getBoxService({
            carousel: undefined,
            translate: translateService({
                templatePath: 'rome/translate/'
            })
        });

        box.headerActions.scope = function(settings) {
            var newScope = $scope.$new();
            newScope.entity = settings.entity;
            return newScope;
        };

        $scope.library = masterMind.getLibraryService({
            entityView: box,
            inifinteScroll: false
        });

        // clean selected items from MM scope
        masterMind.cleanEntitiesList();

        $scope.library.callbacks.afterAppendContent = buildKeyNavigation;

        $scope.filters = masterMind.getFilterService();

        //Set filterValue to its service
        helperService.setFiltersValue($scope.filters);

        $scope.filtersSortingService = masterMind.getSortFilterService({
            data: [
                {title: 'Oldest', value: 'oldest', default: false},
                {title: 'Newest', value: 'newest', default: false},
                {title: 'Photorank', value: 'photorank', default: true}
            ]
        });

        // master mind
        masterMind.setModules({
            modal: $scope.modal,
            box: box,
            library: $scope.library
        });

        // modal callbacks
        $scope.modal.callbacks.afterMove = function(direction, entity) {
            selectCurrent(entity);
        };

        $scope.modal.callbacks.afterOpen = function() {
            $scope.$emit(EXTERNAL_TRACKING_EVENTS.pageView.page, $location.path() + '/media');
        };

        $scope.modal.callbacks.afterClose = function(entities) {
            selectCurrent(entities[0]);
            $scope.$emit(EXTERNAL_TRACKING_EVENTS.pageView.page, $location.path());
        };

        // UX
        $scope.toggleFilters = function() {
            $scope.showFilters = !$scope.showFilters;
        };

        var initialValue = { title: '- Original language -', value: 0 };
        $scope.filtersLanguageService = new StaticFiltersService({
            templatePath: 'rome/filters/',
            data: [initialValue].concat(translateConfig.googleTranslate.languages),
            initialValue: $localStorage.filterTranslateLanguage || initialValue,
            callbacks: {
                onChange: function(item) {
                    if (item.value !== 0) {
                        $localStorage.translateTargetLanguage = item.value;
                    }
                    $localStorage.filterTranslateLanguage = item;
                    masterMind.afterLoadContent({ data: { media: $scope.library.actions.items() }});
                }
            }
        });

        masterMind.afterLoadContent = function(res) {
            var showIcon = $scope.filtersLanguageService.actions.getSelectedItem().value !== 0;
            angular.forEach(res.data.media, function(item) {
                item.captionShowIcon = showIcon;
                item.captionShowTranslated = false;
                item.captionTranslated = false;
            });

            return res;
        };

        var translationError = function() {
            growl.addErrorMessage('Unable to translate due to an error. Please try again. ' +
                'If the issue persists, please contact support@olapic.com');
        };
        $scope.modal.translate.callbacks.translationError = translationError;
        box.translate.callbacks.translationError = translationError;

        $scope.isNSFWEnabled = false;
        asyncSettingsService.isNSFWEnabled().then(function(nsfwSetting) {
            $scope.isNSFWEnabled = nsfwSetting;
        });

        helperService.resetCustomer().then(function() {
            masterMind.loadContent({clearCache: true});
        }).catch(function() {
            $location.path('/logout');
        });
    }]);
