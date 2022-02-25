'use strict';

/**
 * @ngdoc directive
 * @name op.translate.opTranslate
 * @restrict E
 *
 * @description
 * This directive binds a tag `<div op-translate />` and remplace it for a template.
 *
 * @example
 * Here's an example of how you'd use ui-sref and how it would compile.
 * If you have the following template:
 * <div op-translate="settings" texttotranslate="texttotranslate"
 * texttranslated="texttranslated" texttranslating="texttranslating" showtranslated="showtranslated"
 * showicon="showicon"/>
 * texttotranslate is the text to be translated
 * texttranslated is the translated text
 * texttranslating is the loading flag
 * showtranslated is the showTranslated flag
 * showicon is the showIcon flag
 */
angular
    .module('op.translate')
    .directive('opTranslate', function() {
        var link = function link(scope) {
            var stopWatch = scope.$watch('settings', function(settings) {
                if (angular.isDefined(settings)) {
                    stopWatch();

                    /*
                     * We assumed that if settings is null, it's because you don't want to use the
                     * translate service, it's the way to turn off by default
                     */
                    if (settings === null) {
                        return;
                    }

                    /*
                     * Decide if use the default themplate or a custom template.
                     * If use the default template, add a custom template path
                     */
                    if (angular.isString(settings.templateUrl)) {
                        scope.templateUrl = settings.templatePath + settings.templateUrl;
                    } else {
                        scope.templateUrl = settings.templatePath +
                            'src/statics/partials/translate.html';
                    }

                    scope.showIcon = scope.showIcon || settings.showIcon;
                    scope.showTransitionEffect = settings.showTransitionEffect;
                    scope.showIconWhenTranslated = settings.showIconWhenTranslated;

                    var translateService = settings.translateService;
                    var translateText = function() {
                        if (!scope.textTranslated) {
                            scope.loading = true;
                            translateService
                                .translate(translateService.prepTranslation(scope.textToTranslate))
                                .then(function(translation) {
                                    translation = translation[0].translatedText;
                                    scope.textTranslated = translation;
                                    scope.showTranslated = true;
                                    settings.callbacks.afterTranslate(translation);
                                }).catch(function(err) {
                                    settings.callbacks.translationError(err);
                                }).finally(function() {
                                    scope.loading = false;
                                });
                        } else {
                            scope.showTranslated = !scope.showTranslated;
                        }
                    };

                    /**
                     * @name clickTranslateIcon
                     *
                     * @description
                     * Callback of the click event on the button. If the text is already
                     * translated it will change the showTranslated flag. If not, it will query the
                     * translateService and will display the translated text
                     */
                    scope.clickTranslateIcon = function(event) {
                        event.preventDefault();
                        translateText();
                    };

                    /**
                     * @name afterLoadTemplate
                     *
                     * @description
                     * When the inlude was loaded, call this method
                     */
                    scope.afterLoadTemplate = function() {
                        if (settings.translateOnload) {
                            translateText();
                        }
                    };

                    //Attach the actions
                    settings.actions = {
                        translate: translateText
                    };
                }
            });
        };
        return {
            scope: {
                textToTranslate: '=texttotranslate',
                textTranslated: '=texttranslated',
                loading: '=texttranslating',
                showTranslated: '=showtranslated',
                showIcon: '=showicon',
                settings: '=opTranslate'
            },
            restrict: 'A',
            transclude: true,
            template: '<div><ng-transclude ng-if="!settings"></ng-transclude><ng-include ' +
                'ng-if="settings" src="templateUrl" onload="afterLoadTemplate()"/></div>',
            link: link
        };
    });
