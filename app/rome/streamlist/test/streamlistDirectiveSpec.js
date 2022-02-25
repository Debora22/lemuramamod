describe('The streamlist directive:', function() {

    var element,
        directiveScope,
        $scope,
        $compile;

    var dummyStreams = [{
        id: 1,
        name: 'test'
    },{
        id: 2,
        name: 'hello'
    }];

    var compileElement = function() {
        element = $compile(angular.element('<op-streamlist settings="streamlist"' +
            'streams="streams" loaded="loaded"></op-streamlist>'))($scope);
        $scope.$digest();

        directiveScope = element.scope();
    };

    beforeEach(module('op.streamlist'));
    beforeEach(module('templates'));

    beforeEach(inject(function(_$compile_, _$rootScope_, _streamlistService_) {
        $scope = _$rootScope_;
        $compile = _$compile_;
        $scope.streamlist = _streamlistService_({
            streamActions: {
                selector: '.streambox-actions',
                directive: '<div>{{streamActions.actions}}</div>',
                actions: ['action 1', 'action 2']
            }
        });
    }));

    it('should replace the element with the appropriate content', function() {
        compileElement();
        expect(element.html()).not.toBeUndefined();
    });

    it('should fill and clear streams', function() {
        compileElement();
        expect(directiveScope.streams).toEqual([]);
        $scope.streamlist.actions.fill(dummyStreams);
        directiveScope.$apply();
        expect(directiveScope.streams).toEqual(dummyStreams);
        $scope.streamlist.actions.clear();
        directiveScope.$apply();
        expect(directiveScope.streams).toEqual([]);
    });

    it('should append the actions and the directive in the selector', function() {
        $scope.streams = dummyStreams;
        compileElement();
        expect(directiveScope.streams).toEqual(dummyStreams);

        var actions = element.find('.streambox-actions');
        var actionsHtml = '<div class="ng-binding ng-scope">["action 1","action 2"]</div>';
        expect(actions.length).toBe(2);
        expect(actions.get(0).innerHTML).toBe(actionsHtml);
        expect(actions.get(1).innerHTML).toBe(actionsHtml);
    });
});
