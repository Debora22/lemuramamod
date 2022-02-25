'use strict';

/**
 * @ngdoc object
 * @name op.box
 * @description
 *
 * This is the main script for this module, only init the module
 *
 */
angular
    .module('op.filters', ['ui.bootstrap']);

angular
    .module('op.filters')
    /**
     @name opIncludeReplace
     @desc this directive "extends" to ngInclude to replace it's place node.

     For example, if you want to do
        <div style="display: flex">
            <div style="order: 5">Flex item 5<div>
            <op-include-replace src="'template.html'"></op-include-replace>
        </div>

     where template.html contains
        <div style="order: 2">Flex item 2<div>
        <div style="order: 1">Flex item 1<div>

     "<op-include-replace>" will be removed from dom leaving all the flex-items under the same parent node
        <div style="display: flex">
            <div style="order: 5">Flex item 5<div>
            <div style="order: 2">Flex item 2<div>
            <div style="order: 1">Flex item 1<div>
        </div>

     Otherwise, it you were using ng-transclude for this, the flexbox would become broken due additional nodes
    */
    .directive('opIncludeReplace', function($http, $templateCache, $compile, $timeout) {
        return {
            restrict: 'EA',
            link: function(scope, element, attributes) {
                $timeout(function() {
                    var templateUrl = scope.$eval(attributes.src);
                    $http.get(templateUrl, {cache: $templateCache}).success(
                        function(tplContent) {
                            element.replaceWith($compile(tplContent)(scope));
                        }
                    );
                });
            }
        };
    })

    /**
     @name opTranscludeReplace
     @desc this directive "extends" to ngTransclude to replace it's transclusion node by the transcluded content

     For example, if you have a directive `opParent` that allow transclusion with the following template:
            <div style="order: 2">Flex item 2<div>
            <div style="order: 5">Flex item 5<div>
            <op-transclude-replace></op-transclude-replace>
        </div>

     And a directive `opChild` with the following template:
        <div style="order: 1">Flex item 1<div>

     Then, at your main template:
        <op-parent style="display: flex">
            <op-child></op-child>
            <op-child></op-child>
        <op-parent>

     Since transclude insert point it's removed when child directive it's rendered, you'll end up having:
        <op-parent style="display: flex">
            <div style="order: 2">Flex item 2<div>
            <div style="order: 5">Flex item 5<div>
            <div style="order: 1">Flex item 1<div>
            <div style="order: 1">Flex item 1<div>
        </op-parent>

     Otherwise, it you were using ng-transclude for this, the flexbox would become broken due additional nodes
    */
    .directive('opTranscludeReplace', function() {
        return {
            terminal: true,
            restrict: 'EA',
            link: function($scope, $element, $attr, ctrl, transclude) {
                if (transclude) {
                    transclude(function(clone) {
                        if (clone.length) {
                            $element.replaceWith(clone);
                        } else {
                            $element.remove();
                        }
                    });
                }
            }
        };
    });
