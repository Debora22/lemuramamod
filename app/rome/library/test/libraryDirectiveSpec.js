describe("The library directive:", function () {

    var elm, $scope;

    beforeEach(function(){
        module('op.library');
        module('templates');
        inject(function(_$compile_, _$rootScope_, libraryService){

            $scope = _$rootScope_;

            $scope.library = libraryService({
                entityView: {},
                template: '<div>Id: {{id}}</div> <div>Source: {{source.name}}</div>',
                callbacks: {
                    loading: {
                        start : function(){},
                        end : function(){}
                    },
                    loadContent : function(finish) {
                        finish({
                            id: 19571957,
                            source: {
                                name: 'instagram'
                            },
                            user: {
                                username: 'jhongalt'
                            },
                            images: {
                                mobile: 'mobile.jpg'
                            },
                            date_submitted: '2013-02-21T01:32:07+0000',
                            sonar_place: {
                                name: "New York"
                            },
                            caption: 'Who is Jhon Galt?'
                        });
                    }
                }
            });

            // Spies:
            spyOn($scope.library.callbacks.loading, 'start');
            spyOn($scope.library.callbacks.loading, 'end');
            spyOn($scope.library.callbacks, 'loadContent');

            // Compile Directive
            elm = angular.element('<op-library></op-library>');
            _$compile_(elm)($scope);
            $scope.$digest();
        });
    });

    it('should call the start() loading callback method', function() {
        // GIVEN
        var spyStart = $scope.library.callbacks.loading.start;
        expect(spyStart).not.toHaveBeenCalled();
        // WHEN
        $scope.setLoading(true);
        // THEN
        expect($scope.isLoading).toBe(true);
        expect(spyStart).toHaveBeenCalled();
        expect(spyStart.calls.count()).toBe(1);
    });

    it('should call the end() loading callback method', function() {
        // GIVEN
        var spyEnd = $scope.library.callbacks.loading.end;
        expect(spyEnd).not.toHaveBeenCalled();
        // WHEN
        $scope.setLoading(false);
        // THEN
        expect($scope.isLoading).toBe(false);
        expect(spyEnd).toHaveBeenCalled();
        expect(spyEnd.calls.count()).toBe(1);
    });

    it('should load more items if the force flag is true', function() {
        // GIVEN
        var theSpy = $scope.library.callbacks.loadContent;
        expect(theSpy).not.toHaveBeenCalled();
        // WHEN
        $scope.loadMore(true);
        // THEN
        expect(theSpy).toHaveBeenCalled();
        expect(theSpy.calls.count()).toBe(1);
    });

    it('should not load more items if the force flag is true but it was the last page', function() {
        // GIVEN
        var theSpy = $scope.library.callbacks.loadContent;
        expect(theSpy).not.toHaveBeenCalled();
        $scope.lastPage = true;
        // WHEN
        $scope.loadMore(true);
        // THEN
        expect(theSpy).not.toHaveBeenCalled();
    });

    it('should not load more items if the library is loading', function() {
        // GIVEN
        var theSpy = $scope.library.callbacks.loadContent;
        expect(theSpy).not.toHaveBeenCalled();
        $scope.setLoading(true);
        // WHEN
        $scope.loadMore(false);
        // THEN
        expect(theSpy).not.toHaveBeenCalled();
    });

    it('should not load more items if the library is loading and the force flag is true', function() {
        // GIVEN
        var theSpy = $scope.library.callbacks.loadContent;
        expect(theSpy).not.toHaveBeenCalled();
        $scope.setLoading(true);
        // WHEN
        $scope.loadMore(true);
        // THEN
        expect(theSpy).not.toHaveBeenCalled();
    });

    it('should have some items to show after load some data', function() {
        // GIVEN
        var theSpy = $scope.library.callbacks.loadContent;
        expect(theSpy).not.toHaveBeenCalled();
        expect($scope.entities).toEqual([]);
        // WHEN
        $scope.loadMore(true);
        // THEN
        expect(theSpy).toHaveBeenCalled();
        expect($scope.entities).toEqual([]);
    });

    it('should fill entities on demand on the library', function() {
        // GIVEN
        expect($scope.entities).toEqual([]);
        // WHEN
        $scope.fill([{id:1},{id:2},{id:3}]);
        $scope.fill([{id:4}]);
        $scope.fill([{id:5},{id:6},{id:7}]);
        // THEN
        expect($scope.entities).toEqual([{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:7}]);
    });

    it('should clear all entities on demand on the library', function() {
        // GIVEN
        $scope.fill(['x','y','z']);
        expect($scope.entities).toEqual(['x','y','z']);
        // WHEN
        $scope.clearContent();
        // THEN
        expect($scope.entities).toEqual([]);
    });

    it('should fill a unique entity on demand on the library', function() {
        // GIVEN
        expect($scope.entities).toEqual([]);
        // WHEN
        $scope.fill('i_am_alone');
        // THEN
        expect($scope.entities).toEqual(['i_am_alone']);
    });

});
