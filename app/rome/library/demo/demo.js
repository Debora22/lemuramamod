angular.module('appConfig', [])
    .constant('appConstant', {
        enviroment: 'live'
    });

angular
    .module('app', ['op.library', 'op.box', 'op.actions'])
    .controller('AppController', ['$scope', '$http', 'libraryService', 'boxService', 'actionService',
    function($scope, $http, libraryService, boxService, ActionService) {
        //
        // Actions DEMO
        //
        $scope.actions = [
            new ActionService({
                title : 'Action 1',
                iconClass : 'check',
                callback: function(entity){
                    entity.caption = 'Hello you there!';
                    $scope.library.actions.item.update(entity.id, entity);
                }
            }),
            new ActionService({
                title : 'Action 2',
                iconClass : 'close',
                callback: function(entity){
                    $scope.library.actions.item.pop(entity);
                }
            })
        ];

        //
        // Key Navigation DEMO !!
        //
        var focusOnSelectedElement = function(entity){
            angular.element('html, body').animate({
                scrollTop: entity.offset().top - 0.15 * entity.prop('offsetHeight')
            }, 100);
        };
        var buildKeyNavigation = function(){
            $('.box-container').keynavigator({
                cycle: false,
                activeClass: 'library-active-element',
                useCache: false,
                keys:{
                    32: function(ele){
                        console.log('Spacebar on ', ele);
                    }
                },
                onAfterActive : function(){
                    console.log('OK');
                    focusOnSelectedElement(angular.element('.library-active-element'));
                }
            });
        };
        $scope.reloadKeys = buildKeyNavigation;

        // //
        // // Create the Data Gateway
        // //
        var nextPage = false;
        var request = function(url){
            return $http.get(url).then(function(res){
                nextPage = true;

                angular.forEach(res.data.data.media, function(entity) {
                    entity.checked = false;
                });

                console.log(res);
                return res;
            });
        };


        //
        // The Data view
        //
        var viewService = boxService({
            type: 'media',
            templatePath: '/box/',
            headerActions: {
                directive: '<op-actions actions="actions" template-path="../../actions/" entity="entity"></op-actions>',
                scope: function(settings){
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

        $scope.addMockEntity = function(){
            var entity_demo = {
                id: 19571957,
                source: {
                    name: 'instagram'
                },
                user: {
                    username: 'mock_user'
                },
                images: {
                    mobile: 'mobile.jpg'
                },
                date_submitted: '2013-02-21T01:32:07+0000',
                sonar_place: {
                    name: "Mock New York"
                },
                caption: 'Mock caption'+Math.random(),
                checked: true
            };
            $scope.library.actions.fill([entity_demo]);
        };

        //
        // Init some actions to the Library
        //
        $scope.clearLibrary = function(){
            $scope.library.actions.clear();
        };
        $scope.loadMoreLibrary = function(){
            $scope.library.actions.loadMore();
        };

        //
        // Configure the Library App
        //
        $scope.library = libraryService({
            entityView: viewService,
            templateUrl : 'demo_template.html',
            inifinteScroll : true,
            callbacks: {
                loading : {
                    start: function(){
                        $scope.isSectionLoading = true;
                    },
                    end  : function(){
                        $scope.isSectionLoading = false;
                    }
                },
                loadContent : function(finish) {
                    if(nextPage){
                        request('mocks/mock.json').then(function(res) {
                            nextPage = false;
                            finish([res.data.data.media[0]]);
                        });
                    }
                },
                afterAppendContent : function(){
                    console.log('afterAppendContent');
                    buildKeyNavigation();
                }
            }
        });

        request('mocks/mock.json');


    }]);
