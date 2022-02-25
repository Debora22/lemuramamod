'use strict';
/**
 * @ngdoc directive
 * @name  opScrollSwitch.directive:opScrollSwitch
 * @resitrct E
 *
 * @element op-scrollSwitch
 *
 * @description
 * Set a CSS class to be added or removed based on the page scroll position.
 *
 * @example
 *
 * <op-scrollSwitch className="myClass" limit="80"></op-scrollSwitch>
 *
 */
angular
.module('base')
.directive('opScrollSwitch', [function(){
    /**
     * Read and save the directive attributes (className and limit), and set
     * the listener on the page scroll that will toggle the class.
     *
     * @param  {Object} scope   The Angular scope
     * @param  {Array}  element The jQuery (or jQLite) object for the directive template
     * @param  {Object} attrs   The directive attributes
     */
    var controller = function(scope, element, attrs){
            // The name of the class to be added or removed.
        var className = attrs.classname || 'scrollSwitch',
            // The scroll position where the class will be added.
            limit = parseInt(attrs.limit) || 80,
            // A reference to the jQuery window element.
            win = angular.element(window),
            // A reference to the jQuery body element.
            body = angular.element('body');
        // Set the listener to start when the DOM is ready.
        angular.element(function(){
            win.scroll(function(){
                // If the scroll position is bigger than the limit...
                if(win.scrollTop() > limit){
                    // add the class
                    body.addClass(className);
                }else{
                    // otherwise, remove it
                    body.removeClass(className);
                }
            });
        });
    };
    /**
     * Return the directive information.
     */
    return {
        restrict: 'E',
        replace: true,
        link: controller
    };
}]);
