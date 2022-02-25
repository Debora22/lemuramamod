'use strict';

angular
.module('moderation')
.controller('moderationController', [
    '$scope',
    'actionService',
    'ModerationBackend',
    'API_MEDIA_STATUSES_ID',
    '$q',
    '$location',
    'StaticFiltersService',
    'translateService',
    'translateConfig',
    'notifications',
    '$localStorage',
    'loadingService',
    'sectionService',
    'asyncSettingsService',
    'modalMediaAnnotationService',
    'EXTERNAL_TRACKING_EVENTS',
    function(
        $scope,
        ActionService,
        moderationBackend,
        API_MEDIA_STATUSES_ID,
        $q,
        $location,
        StaticFiltersService,
        translateService,
        translateConfig,
        growl,
        $localStorage,
        loading,
        section,
        asyncSettingsService,
        modalMediaAnnotationService,
        EXTERNAL_TRACKING_EVENTS
    ) {
        loading.on();
        var masterMind = moderationBackend.masterMind;

        // clean selected items from MM scope
        masterMind.cleanEntitiesList();

        section.in('moderation');

        $scope.showFilters = true;
        $scope.isModalInBulk = masterMind.isModalInBulk;

        masterMind.setQuery({
            filters: {
                status_id: {
                    values: [20]
                }
            },
            sort: 'photorank'
        });
        masterMind.pageSize = 30;
        masterMind.bulkLimit = 30;

        $scope.isLoading = masterMind.scope.isLoading;
        $scope.bulkSelection = masterMind.bulkSelection;
        $scope.bulkTooltip = masterMind.bulkTooltip();
        $scope.bulkSelected = function() {
            return masterMind.scope.bulkSelected;
        };

        var spanAction = masterMind.actions.spam(moderationBackend.flagMediaAsSpam);
        var rejectAction = masterMind.actions.reject(moderationBackend.reject);
        var blacklist = masterMind.actions.blacklist();
        var mqPending = masterMind.actions.backToMq(moderationBackend.putOnPending);
        var mqSFL = masterMind.actions.sfl(moderationBackend.putOnSFL);

        var getShowIfEqualsStatus = function(status) {
            return function(media) {
                if (angular.isArray(media)) {
                    return media.all(function(item) {
                        return item.status_id === status;
                    });
                } else {
                    return media.status_id === status;
                }
            };
        };

        mqPending.showIf = getShowIfEqualsStatus(API_MEDIA_STATUSES_ID.SFL);
        mqSFL.showIf = getShowIfEqualsStatus(API_MEDIA_STATUSES_ID.PENDING);

        var box = masterMind.getBoxService({
            translate: translateService({
                templatePath: 'rome/translate/'
            })
        });

        box.headerActions.scope = function(settings) {
            var newScope = $scope.$new();
            newScope.entity = settings.entity;
            newScope.actions = [
                rejectAction,
                mqSFL,
                mqPending,
                spanAction,
                blacklist
            ];
            return newScope;
        };

        var modalScope = $scope.$new(true);

        modalScope.tagging = masterMind.getTaggingService(moderationBackend);

        asyncSettingsService.isSuggestionEnabled().then(function(suggestionToggleValue) {
            modalScope.isSuggestionAvailable = suggestionToggleValue;
        });

        asyncSettingsService.isSuggestionFromCropEnabled().then(function(suggestionFromCropValue) {
            modalScope.isSuggestionFromCropAvailable = suggestionFromCropValue;
        });

        $scope.isNSFWEnabled = false;
        asyncSettingsService.isNSFWEnabled().then(function(nsfwSetting) {
            $scope.isNSFWEnabled = nsfwSetting;
        });

        modalScope.actions = [
            rejectAction,
            mqSFL,
            mqPending,
            spanAction,
            blacklist
        ];

        $scope.modal = masterMind.getModalService(modalScope, ['tagging'], {
            translate: translateService({
                templatePath: 'rome/translate/'
            })
        });

        $scope.modal.callbacks.afterMove = function() {
            if (!$scope.modal.current[0].video_url) {
                // Restore enableAnnotations to true
                modalScope.modal.enableAnnotations.status = true;
                moderationBackend.getAnnotations($scope.modal.current[0].id, $scope.modal.current[0].streams);
            }
        };

        $scope.modal.callbacks.afterOpen = function() {
            // Restore enableAnnotations to true
            modalScope.modal.enableAnnotations.status = true;
            //Check if the media is not a video and is not in bulk mode
            if (!masterMind.isModalInBulk() && !$scope.modal.current[0].video_url) {
                moderationBackend.getAnnotations($scope.modal.current[0].id, $scope.modal.current[0].streams);
            }

            // enables save sorgin
            modalScope.tagging.sorting = !masterMind.isModalInBulk();

            var pagePath = masterMind.isModalInBulk() ? '/bulk' : '/media';
            $scope.$emit(EXTERNAL_TRACKING_EVENTS.pageView.page, $location.path() + pagePath);
        };

        $scope.modal.callbacks.afterClose = function() {
            modalMediaAnnotationService.cleanAnnotationList();
            $scope.$emit(EXTERNAL_TRACKING_EVENTS.pageView.page, $location.path());
        };

        $scope.library = masterMind.getLibraryService({
            entityView: box
        });

        var baseLibraryLoadContent = $scope.library.callbacks.loadContent;
        $scope.library.callbacks.loadContent = function(finish) {
            baseLibraryLoadContent(function(data) {
                masterMind.afterLoadContent({ data: { media: $scope.library.actions.items() }});
                finish(data);
            });
        };

        $scope.filters = masterMind.getFilterService();

        //Set filterValue to its service
        moderationBackend.setFiltersValue($scope.filters);

        $scope.filtersStatusService = masterMind.getStatusFilterService({
            data: [
                {title: 'Pending', value: 20},
                {title: 'Save for Later', value: 23}
            ]
        }, $scope.filters);
        $scope.filtersSortingService = masterMind.getSortFilterService({
            data: [
                {title: 'Oldest', value: 'oldest', default: false},
                {title: 'Newest', value: 'newest', default: false},
                {title: 'Photorank', value: 'photorank', default: true}
            ]
        });

        masterMind.setModules({
            modal: $scope.modal,
            box: box,
            library: $scope.library,
            tagging: modalScope.tagging
        });

        $scope.toggleFilters = function() {
            $scope.showFilters = !$scope.showFilters;
        };

        $scope.actionsOverSelectedItems = masterMind.actionsOverSelectedItems;

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

        moderationBackend.resetCustomer().then(function() {
            masterMind.loadContent();
        }).catch(function() {
            $location.path('/logout');
        });
    }
]);
