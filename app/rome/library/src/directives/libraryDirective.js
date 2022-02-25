'use strict';

angular
    .module('op.library')
    /*
        Library directive
    */
    .directive('opLibrary', ['$parse', '$compile', function($parse, $compile){

        var controller = function($scope, element, attrs) {

            var stopWatch = $scope.$watch(function(scope){
                return scope[attrs.library] || scope.library || scope.$parent.library;
            }, function(settings){

                if (!angular.isUndefined(settings) && !angular.isUndefined(settings.callbacks)) {

                    stopWatch();

                    // The list of entities to show in the library
                    $scope.entities = [];
                    // Is the first load?
                    $scope.firstLoad = true;
                    // The directive to render the entities
                    $scope.entityView = settings.entityView;
                    // The Library template filename
                    $scope.templateUrl = settings.templatePath + 'src/statics/partials/library.html';

                    $scope.setLoading = function(status){
                        $scope.isLoading = (status) ? true : false;
                        if($scope.isLoading){
                            settings.callbacks.loading.start();
                        } else {
                            settings.callbacks.loading.end();
                        }
                    };

                    $scope.loadMore = function(force){
                        force = angular.isUndefined(force) ? false : force;
                        if((!$scope.isLoading) && (settings.inifinteScroll || force) && !$scope.lastPage){
                            requestMoreContent();
                        }
                    };

                    $scope.clearContent = function(){
                        $scope.entities = [];
                        $scope.lastPage = false;
                    };

                    $scope.fill = function(entityData){
                        $scope.setLoading(true);
                        var current = $scope.entities.map(function(ent) {
                            return ent.id;
                        });
                        var tofill = ((angular.isArray(entityData)) ? entityData : [entityData])
                        .filter(function(ent) {
                            return current.indexOf(ent.id) === -1;
                        });
                        $scope.entities = $scope.entities.concat(tofill);
                        $scope.setLoading(false);
                    };

                    $scope.pushEntity = function(entity){
                        $scope.entities.push(entity);
                    };

                    $scope.popEntity = function(entity){
                        var index = searchEntityInArray(entity.id);
                        if(index >= 0){
                            $scope.entities.splice(index, 1);
                        }
                    };

                    $scope.updateEntity = function(id, entity){
                        var index = searchEntityInArray(id);
                        if(index >= 0){
                            $scope.entities[index] = entity;
                        }
                    };

                    var getItems = function() {
                        return $scope.entities;
                    };

                    $scope.$on('ng-repeat-on-finish-render', function(){
                        settings.callbacks.afterAppendContent();
                    });

                    var searchEntityInArray = function(id){
                        var index = -1;
                        angular.forEach($scope.entities, function(entity, i){
                            if(entity.id === id){
                                index = i;
                            }
                        });
                        return index;
                    };

                    var requestMoreContent = function() {
                        $scope.setLoading(true);
                        settings.callbacks.loadContent(function(){
                            $scope.setLoading(false);
                            $scope.firstLoad = false;
                        });
                    };

                    var compile = function(){
                        element.html(getTemplate());
                        $compile(element.contents())($scope);
                    };

                    var getTemplate = function(){
                        var template = '<div><ng-include src="templateUrl"/></div>';
                        if(settings.template !== ''){
                            template = settings.template;
                        } else if(settings.templateUrl !== ''){
                            $scope.templateUrl = settings.templateUrl;
                        }
                        return template;
                    };

                    var attachActions = function(){
                        settings.actions = {
                            'clear' : $scope.clearContent,
                            'fill' : $scope.fill,
                            'loadMore' : $scope.loadMore,
                            'item': {
                                'push': $scope.pushEntity,
                                'pop': $scope.popEntity,
                                'update': $scope.updateEntity
                            },
                            'items': getItems
                        };
                    };

                    var init = function(){
                        attachActions();
                        compile();
                    };

                    init();
                }

            });

        };

        return {
            link: controller,
            restrict : 'E',
            terminal : true,
            transclude : true
        };

    }]);
