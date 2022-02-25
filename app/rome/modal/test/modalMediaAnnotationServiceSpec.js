describe('The Modal Media Annotation Service:', function() {
    var $scope;
    var $timeout;
    var modalMediaAnnotationService;
    var taggingSuggestionService;

    beforeEach(module('op.modal'));

    beforeEach(module(function($provide) {
        $provide.value('taggingSuggestionService', {
            getSuggestedStreams: function() {},
            getLastestSuggestions: function() {},
            onSuggestionDataChange: function() {},
            onGetSuggestionRequest: function() {},
            getAllSuggestions: function() {}
        });
    }));

    beforeEach(inject(function(_$rootScope_, _$timeout_, _modalMediaAnnotationService_, _taggingSuggestionService_) {
        $scope = _$rootScope_.$new();
        $timeout = _$timeout_;
        modalMediaAnnotationService = _modalMediaAnnotationService_;
        taggingSuggestionService = _taggingSuggestionService_;

    }));

    it('should properly set a pending annotation', function() {
        //Given
        var pendingAnnotation = {
            id: 'pendingannotation'
        };

        //When
        modalMediaAnnotationService.setPendingAnnotation(pendingAnnotation);

        //Then
        var result = modalMediaAnnotationService.getPendingAnnotation();

        expect(result.id).toEqual(pendingAnnotation.id);
    });

    it('should properly set mark pending annotation as used', function() {
        //Given
        var pendingAnnotation = {
            id: 'pendingannotation'
        };

        //When
        modalMediaAnnotationService.setPendingAnnotation(pendingAnnotation);
        modalMediaAnnotationService.markPendingAnnotationAsUsed();

        //Then
        var result = modalMediaAnnotationService.getPendingAnnotation();

        expect(result).toBe(null);
    });

    it('should properly call a callback when marking pending annotation as used', function() {
        //Given
        var pendingAnnotation = {
            id: 'pendingannotation'
        };

        var linkedEntity = {
            id: 'linkedEntity'
        };

        var annotationUsedCallback = jasmine.createSpy('annotationUsedCallback');
        modalMediaAnnotationService.setPendingAnnotation(pendingAnnotation);
        modalMediaAnnotationService.onPendingAnnotationUsed(annotationUsedCallback);

        //When
        modalMediaAnnotationService.markPendingAnnotationAsUsed(linkedEntity);

        //Then
        expect(annotationUsedCallback.calls.count()).toEqual(1);
        expect(annotationUsedCallback).toHaveBeenCalledWith(pendingAnnotation, linkedEntity);
    });

    it('should properly remove the callback for marking pending annotation as used', function() {
        //Given
        var pendingAnnotation = {
            id: 'pendingannotation'
        };

        var linkedEntity = {
            id: 'linkedEntity'
        };

        var annotationUsedCallback = jasmine.createSpy('annotationUsedCallback');
        modalMediaAnnotationService.setPendingAnnotation(pendingAnnotation);
        var removeCallback = modalMediaAnnotationService.onPendingAnnotationUsed(annotationUsedCallback);

        //When
        removeCallback();
        modalMediaAnnotationService.markPendingAnnotationAsUsed(linkedEntity);

        //Then
        expect(annotationUsedCallback).not.toHaveBeenCalled();
    });

    it('should properly add an annotation', function() {
        //Given
        var annotation1 = {
            id: 'testAnnotation 1'
        };

        var annotation2 = {
            id: 'testAnnotation 2'
        };

        //When
        modalMediaAnnotationService.addUpdateAnnotation(annotation1);
        modalMediaAnnotationService.addUpdateAnnotation(annotation2);
        $timeout.flush();

        var list = modalMediaAnnotationService.getAnnotationList();

        //Then
        expect(list.length).toEqual(2);
        expect(list[0].id).toEqual(annotation1.id);
        expect(list[0].onRemove).toEqual(jasmine.any(Function));
        expect(list[1].id).toEqual(annotation2.id);
        expect(list[1].onRemove).toEqual(jasmine.any(Function));
    });

    it('should properly update an annotation', function() {
        //Given
        var annotation1 = {
            id: 'testAnnotation 1'
        };

        var annotation2 = {
            id: 'testAnnotation 2',
            text: 'annotation2'
        };

        var annotation2Edited = {
            id: 'testAnnotation 2',
            text: 'edited'
        };

        //When
        modalMediaAnnotationService.addUpdateAnnotation(annotation1);
        modalMediaAnnotationService.addUpdateAnnotation(annotation2);
        modalMediaAnnotationService.addUpdateAnnotation(annotation2Edited);
        $timeout.flush();

        var list = modalMediaAnnotationService.getAnnotationList();

        //Then
        expect(list.length).toEqual(2);
        expect(list[1].text).toEqual('edited');
    });

    it('should properly update an annotation using external id', function() {
        //Given
        var annotation1 = {
            id: 'testAnnotation 1'
        };

        var annotation2 = {
            id: 'testAnnotation 2',
            externalId: 'externalId',
            text: 'annotation2'
        };

        var annotation2Edited = {
            id: 'testAnnotation 2 edited',
            externalId: 'externalId',
            text: 'edited'
        };

        //When
        modalMediaAnnotationService.addUpdateAnnotation(annotation1);
        modalMediaAnnotationService.addUpdateAnnotation(annotation2);
        modalMediaAnnotationService.addUpdateAnnotation(annotation2Edited);
        $timeout.flush();

        var list = modalMediaAnnotationService.getAnnotationList();

        //Then
        expect(list.length).toEqual(2);
        expect(list[1].id).toEqual(annotation2Edited.id);
    });

    it('should properly set onRemove handler for new annotations', function() {
        //Given
        var annotation1 = {
            id: 'testAnnotation 1'
        };

        modalMediaAnnotationService.addUpdateAnnotation(annotation1);
        $timeout.flush();

        //When
        annotation1.onRemove(annotation1);
        $timeout.flush();

        var list = modalMediaAnnotationService.getAnnotationList();

        //Then
        expect(list.length).toEqual(0);
    });

    it('should properly remove pending annotation when it is removed', function() {
        //Given
        var annotation1 = {
            id: 'testAnnotation 1'
        };

        modalMediaAnnotationService.addUpdateAnnotation(annotation1);
        modalMediaAnnotationService.setPendingAnnotation(annotation1);
        $timeout.flush();

        //When
        annotation1.onRemove(annotation1);
        $timeout.flush();

        var list = modalMediaAnnotationService.getAnnotationList();
        var pendingAnnotation = modalMediaAnnotationService.getPendingAnnotation();

        //Then
        expect(list.length).toEqual(0);
        expect(pendingAnnotation).toBe(null);
    });

    it('should properly manage onRemove handler calls when the parameter is not valid', function() {
        //Given
        var annotation1 = {
            id: 'testAnnotation 1'
        };

        var annotation2 = {
            id: 'testAnnotation 2'
        };

        modalMediaAnnotationService.addUpdateAnnotation(annotation1);
        $timeout.flush();

        //When
        annotation1.onRemove(annotation2);

        var list = modalMediaAnnotationService.getAnnotationList();

        //Then
        expect(list.length).toEqual(1);
    });

    it('should properly manage onRemove handler calls when annotation is not sent as parameter', function() {
        //Given
        var annotation1 = {
            id: 'testAnnotation 1'
        };

        var annotation2 = {
            id: 'testAnnotation 2'
        };

        modalMediaAnnotationService.addUpdateAnnotation(annotation1);
        modalMediaAnnotationService.addUpdateAnnotation(annotation2);
        $timeout.flush();

        //When
        annotation1.onRemove(null);

        var list = modalMediaAnnotationService.getAnnotationList();

        //Then
        expect(list.length).toEqual(2);
    });

    it('should properly call onRemove callback when an annotation is removed', function() {
        //Given
        var annotation1 = {
            id: 'testAnnotation 1'
        };

        var annotationRemovedCallback = jasmine.createSpy('annotationRemovedCallback');

        modalMediaAnnotationService.onRemoveAnnotation(annotationRemovedCallback);

        modalMediaAnnotationService.addUpdateAnnotation(annotation1);
        $timeout.flush();

        //When
        annotation1.onRemove(annotation1);
        $timeout.flush();

        var list = modalMediaAnnotationService.getAnnotationList();

        //Then
        expect(list.length).toEqual(0);
        expect(annotationRemovedCallback.calls.count()).toEqual(1);
        expect(annotationRemovedCallback).toHaveBeenCalledWith(annotation1);
    });

    it('should properly call onRemove callback using externalId when an annotation is removed', function() {
        //Given
        var annotation1 = {
            id: 'testAnnotation 1',
            externalId: 'externalId'
        };

        var annotationRemovedCallback = jasmine.createSpy('annotationRemovedCallback');

        modalMediaAnnotationService.onRemoveAnnotation(annotationRemovedCallback);

        modalMediaAnnotationService.addUpdateAnnotation(annotation1);
        $timeout.flush();

        //When
        annotation1.onRemove({
            externalId: 'externalId'
        });
        $timeout.flush();

        var list = modalMediaAnnotationService.getAnnotationList();

        //Then
        expect(list.length).toEqual(0);
        expect(annotationRemovedCallback.calls.count()).toEqual(1);
        expect(annotationRemovedCallback).toHaveBeenCalledWith(annotation1);
    });

    it('should properly cancel onRemove callback', function() {
        //Given
        var annotation1 = {
            id: 'testAnnotation 1'
        };

        var annotationRemovedCallback = jasmine.createSpy('annotationRemovedCallback');

        var cancelCallback = modalMediaAnnotationService.onRemoveAnnotation(annotationRemovedCallback);

        modalMediaAnnotationService.addUpdateAnnotation(annotation1);
        $timeout.flush();

        cancelCallback();

        //When
        annotation1.onRemove(annotation1);
        $timeout.flush();

        var list = modalMediaAnnotationService.getAnnotationList();

        //Then
        expect(list.length).toEqual(0);
        expect(annotationRemovedCallback.calls.count()).toEqual(0);
    });

    it('should properly remove an annotation by id', function() {
        //Given
        var annotation1 = {
            id: 'testAnnotation 1'
        };

        var annotation2 = {
            id: 'testAnnotaton 2'
        };

        modalMediaAnnotationService.addUpdateAnnotation(annotation1);
        modalMediaAnnotationService.addUpdateAnnotation(annotation2);
        $timeout.flush();

        //When
        modalMediaAnnotationService.removeAnnotation(annotation1.id);
        $timeout.flush();

        var list = modalMediaAnnotationService.getAnnotationList();

        //Then
        expect(list.length).toEqual(1);
        expect(list[0].id).toEqual(annotation2.id);
    });

    it('should properly remove an annotation by external id', function() {
        //Given
        var annotation1 = {
            id: 'testAnnotation 1',
            externalId: 'externalId'
        };

        var annotation2 = {
            id: 'testAnnotaton 2'
        };

        modalMediaAnnotationService.addUpdateAnnotation(annotation1);
        modalMediaAnnotationService.addUpdateAnnotation(annotation2);
        $timeout.flush();

        //When
        modalMediaAnnotationService.removeAnnotation(annotation1.externalId);
        $timeout.flush();

        var list = modalMediaAnnotationService.getAnnotationList();

        //Then
        expect(list.length).toEqual(1);
        expect(list[0].id).toEqual(annotation2.id);
    });

    it('should properly handle an invalid annotation id when removing', function() {
        //Given
        var annotation1 = {
            id: 'testAnnotation 1'
        };

        var annotation2 = {
            id: 'testAnnotaton 2'
        };

        modalMediaAnnotationService.addUpdateAnnotation(annotation1);
        modalMediaAnnotationService.addUpdateAnnotation(annotation2);
        $timeout.flush();

        //When
        modalMediaAnnotationService.removeAnnotation('someinvalidid');

        var list = modalMediaAnnotationService.getAnnotationList();

        //Then
        expect(list.length).toEqual(2);
        expect(list[0].id).toEqual(annotation1.id);
        expect(list[1].id).toEqual(annotation2.id);
    });

    it('should properly clean the annotation list', function() {
        //Given
        var annotation1 = {
            id: 'testAnnotation 1'
        };

        var annotation2 = {
            id: 'testAnnotaton 2'
        };

        var annotation3 = {
            id: 'testAnnotaton 3'
        };

        modalMediaAnnotationService.addUpdateAnnotation(annotation1);
        modalMediaAnnotationService.addUpdateAnnotation(annotation2);
        modalMediaAnnotationService.setPendingAnnotation(annotation3);

        $timeout.flush();

        //When
        modalMediaAnnotationService.cleanAnnotationList();
        $timeout.flush();

        var list = modalMediaAnnotationService.getAnnotationList();
        var pending = modalMediaAnnotationService.getPendingAnnotation();

        //Then
        expect(list.length).toEqual(0);
        expect(pending).toBe(null);
    });
});
