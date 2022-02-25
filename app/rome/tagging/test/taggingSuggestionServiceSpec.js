describe('The Tagging Suggestion Service:', function() {
    var $scope;
    var taggingSuggestionServiceMock;
    var adminAPIServiceMock;
    var $qMock;

    beforeEach(module('op.tagging', function($provide) {
        $provide.provider('adminAPIService', function() {
            this.$get = function() {
                return {
                    getSuggestedStream: function() {}
                };
            };
        });
    }));

    beforeEach(inject(function($q, $rootScope, taggingSuggestionService, adminAPIService) {
        $scope = $rootScope.$new();
        $qMock = $q;
        taggingSuggestionServiceMock = taggingSuggestionService;
        adminAPIServiceMock = adminAPIService;
    }));

    it('should properly return streams for a non cached entity', function() {
        //Arrange
        var entityId = 1;
        var result;

        var getSuggestedStreamSpy = spyOn(adminAPIServiceMock, 'getSuggestedStream')
            .and.returnValue($qMock.when('fakeReturnedData'));

        //Act
        taggingSuggestionServiceMock.getSuggestedStreams(entityId).then(function(data) {
            result = data;
        });
        $scope.$digest();

        //Assert
        expect(result).toEqual('fakeReturnedData');
        expect(getSuggestedStreamSpy).toHaveBeenCalledWith(entityId);
        expect(getSuggestedStreamSpy.calls.count()).toEqual(1);
    });

    it('should properly cache streams for a entity', function() {
        //Arrange
        var entityId = 1;
        var result;

        var getSuggestedStreamSpy = spyOn(adminAPIServiceMock, 'getSuggestedStream')
            .and.returnValue($qMock.when('fakeReturnedData'));

        //Act
        taggingSuggestionServiceMock.getSuggestedStreams(entityId).then(function(data) {
            result = data;
        });
        $scope.$digest();

        taggingSuggestionServiceMock.getSuggestedStreams(entityId).then(function(data) {
            result = data;
        });
        $scope.$digest();

        //Assert
        expect(result).toEqual('fakeReturnedData');
        expect(getSuggestedStreamSpy).toHaveBeenCalledWith(entityId);
        expect(getSuggestedStreamSpy.calls.count()).toEqual(1);
    });

    it('should properly cache up to 20 entities', function() {
        //Arrange
        var result;

        var getSuggestedStreamSpy = spyOn(adminAPIServiceMock, 'getSuggestedStream')
            .and.returnValue($qMock.when('fakeReturnedData'));

        function saveResult(data) {
            result = data;
        }

        //Act
        for (var i = 0; i < 20; i++) {
            taggingSuggestionServiceMock.getSuggestedStreams(i).then(saveResult);

            $scope.$digest();
        }

        taggingSuggestionServiceMock.getSuggestedStreams(0).then(function(data) {
            result = data;
        });

        $scope.$digest();

        //Assert
        expect(result).toEqual('fakeReturnedData');
        expect(getSuggestedStreamSpy.calls.count()).toEqual(20);
    });

    it('should cache no more than 20 entities', function() {
        //Arrange
        var result;

        var getSuggestedStreamSpy = spyOn(adminAPIServiceMock, 'getSuggestedStream')
            .and.returnValue($qMock.when('fakeReturnedData'));

        function saveResult(data) {
            result = data;
        }

        //Act
        for (var i = 0; i < 21; i++) {
            taggingSuggestionServiceMock.getSuggestedStreams(i).then(saveResult);

            $scope.$digest();
        }

        taggingSuggestionServiceMock.getSuggestedStreams(0).then(function(data) {
            result = data;
        });

        $scope.$digest();

        //Assert
        expect(result).toEqual('fakeReturnedData');
        expect(getSuggestedStreamSpy.calls.count()).toEqual(22);
    });

});
