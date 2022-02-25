'use strict';

angular.module('tagging')
.controller('TaggingController', [
    '$scope',
    'TaggingHelperFactory',
    'sectionService',
    'StaticFiltersService',
    'translateService',
    'translateConfig',
    'notifications',
    '$localStorage',
    '$location',
    'asyncSettingsService',
    'modalMediaAnnotationService',
    'EXTERNAL_TRACKING_EVENTS',
    function(
        $scope,
        taggingHelperFactory,
        section,
        StaticFiltersService,
        translateService,
        translateConfig,
        growl,
        $localStorage,
        $location,
        asyncSettingsService,
        modalMediaAnnotationService,
        EXTERNAL_TRACKING_EVENTS
    ) {

        section.in('tagging');

        var masterMind = taggingHelperFactory.masterMind;

        // clean selected items from MM scope
        masterMind.cleanEntitiesList();

        $scope.showFilters = true;

        masterMind.setQuery({
            filters: {
                status_id: {
                    values: [25]
                }
            },
            sort: 'oldest'
        });
        masterMind.pageSize = 30;
        masterMind.bulkLimit = 30;

        $scope.isLoading = masterMind.scope.isLoading;
        $scope.bulkSelection = masterMind.bulkSelection;
        $scope.bulkTooltip = masterMind.bulkTooltip();
        $scope.bulkSelected = function() {
            return masterMind.scope.bulkSelected;
        };

        var actions = {};
        actions.reject = masterMind.actions.reject(taggingHelperFactory.rejectMediaBatch);
        actions.approve = masterMind.actions.approve(taggingHelperFactory.approveMediaBatch);
        actions.spam = masterMind.actions.spam(taggingHelperFactory.flagMediaAsSpamBatch);
        actions.blacklist = masterMind.actions.blacklist();
        $scope.actions = [
            actions.approve,
            actions.reject,
            actions.spam,
            actions.blacklist
        ];

        $scope.bulkTagging = masterMind.actionsOverSelectedItems;

        $scope.isModalInBulk = masterMind.isModalInBulk;

        var modalScope = $scope.$new(true);
        modalScope.actions = $scope.actions;

        modalScope.tagging = masterMind.getTaggingService(taggingHelperFactory);

        asyncSettingsService.isSuggestionEnabled().then(function(suggestionToggleValue) {
            modalScope.isSuggestionAvailable = suggestionToggleValue;
        });

        asyncSettingsService.isSuggestionFromCropEnabled().then(function(suggestionFromCropValue) {
            modalScope.isSuggestionFromCropAvailable = suggestionFromCropValue;
        });

        $scope.modal = masterMind.getModalService(modalScope, ['tagging'], {
            translate: translateService({
                templatePath: 'rome/translate/'
            })
        });

        $scope.modal.callbacks.afterMove = function() {
            if (!$scope.modal.current[0].video_url) {
                // Restore enableAnnotations to true
                modalScope.modal.enableAnnotations.status = true;
                taggingHelperFactory.getAnnotations($scope.modal.current[0].id, $scope.modal.current[0].streams);
            }
        };

        $scope.modal.callbacks.afterOpen = function() {
            // Restore enableAnnotations to true
            modalScope.modal.enableAnnotations.status = true;
            //Check if the media is not a video and is not in bulk mode
            if (!masterMind.isModalInBulk() && !$scope.modal.current[0].video_url) {
                taggingHelperFactory.getAnnotations($scope.modal.current[0].id, $scope.modal.current[0].streams);
            }

            var pagePath = masterMind.isModalInBulk() ? '/bulk' : '/media';
            $scope.$emit(EXTERNAL_TRACKING_EVENTS.pageView.page, $location.path() + pagePath);
        };

        $scope.modal.callbacks.afterClose = function() {
            modalMediaAnnotationService.cleanAnnotationList();
            $scope.$emit(EXTERNAL_TRACKING_EVENTS.pageView.page, $location.path());
        };

        var box = masterMind.getBoxService({
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
            entityView: box
        });

        var baseLibraryLoadContent = $scope.library.callbacks.loadContent;
        $scope.library.callbacks.loadContent = function() {
            baseLibraryLoadContent(function() {});
        };

        $scope.filters = masterMind.getFilterService();

        //Set filterValue to its service
        taggingHelperFactory.setFiltersValue($scope.filters);

        $scope.filtersSortingService = masterMind.getSortFilterService({
            data: [
                {title: 'Photorank', value: 'photorank', default: false},
                {title: 'Oldest', value: 'oldest', default: true},
                {title: 'Newest', value: 'newest', default: true}
            ]
        });

        masterMind.setModules({
            modal: $scope.modal,
            box: box,
            library: $scope.library,
            tagging: modalScope.tagging,
            progressButton: $scope.progressButton
        });

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

        taggingHelperFactory.resetCustomer().then(function() {
            masterMind.loadContent();
        }).catch(function() {
            $location.path('/logout');
        });
    }]);
