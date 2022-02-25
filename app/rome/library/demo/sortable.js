angular.module('appConfig', [])
    .constant('appConstant', {
        enviroment: 'live'
    });

angular
    .module('app', ['ui.sortable', 'ui.sortable.multiselection', 'op.library', 'op.box', 'op.actions'])
    .controller('AppController', ['$scope', '$http', 'libraryService', 'boxService', 'actionService',
        'uiSortableMultiSelectionMethods',
    function($scope, $http, libraryService, boxService, RepositoryFactory, ActionService, uiSortableMultiSelectionMethods) {

        $scope.sortableOptions = uiSortableMultiSelectionMethods.extendOptions({
            cursorAt: { left: 100, top: 120 },
            opacity: 0.7,
            tolerance: 'pointer',
            containment: '.library-media-container'
        });

        //
        // Actions DEMO
        //
        $scope.actions = [
            new ActionService({
                title: 'Action 1',
                iconClass: 'check',
                callback: function(entity) {
                    entity.caption = 'Hello you there!';
                    $scope.library.actions.item.update(entity.id, entity);
                }
            }),
            new ActionService({
                title: 'Action 2',
                iconClass: 'close',
                callback: function(entity) {
                    $scope.library.actions.item.pop(entity);
                }
            })
        ];

        //
        // The Data view
        //
        var viewService = boxService({
            type: null,
            templateUrl: 'sortableItem.html',
            headerActions: {
                directive: '<op-actions actions="actions" template-url="sortableActions.html"' +
                    ' entity="entity"></op-actions>',
                scope: function(settings) {
                    var newScope = $scope.$new();
                    newScope.entity = settings.entity;
                    return newScope;
                }
            }
        });

        //
        // To show the Loading Bar
        //
        $scope.isSectionLoading = true;


        var request = function(url){
            return $http.get(url).then(function(res){

                angular.forEach(res.data.data.media, function(entity) {
                    entity.checked = false;
                });

                return res;
            });
        };
        //
        // Init some actions to the Library
        //
        $scope.loadMoreLibrary = function() {
            request('mocks/mock.json').then(function(res){
                $scope.library.actions.fill(res.data.data.media);
            });
        };

        //
        // Configure the Library App
        //
        $scope.library = libraryService({
            entityView: viewService,
            templateUrl: 'sortableLibrary.html',
            inifinteScroll: false,
            callbacks: {
                loading: {
                    start: function() {
                        $scope.isSectionLoading = true;
                    },
                    end: function() {
                        $scope.isSectionLoading = false;
                    }
                },
            }
        });

        request('mocks/mock.json').then(function(res){
            $scope.library.actions.fill(res.data.data.media);
        });
    }]);
