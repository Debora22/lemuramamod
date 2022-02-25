describe('The Modal Directive:', function(){

    var elem,
        $scope,
        dummyEntity = {
            "id": 1796021987,
            "caption": "#asado #olapic #starting",
            "key": "qoygwe3",
            "images": {
                "bthumbnail": "https://s3.amazonaws.com/photorank-media/media/q/o/y/qoygwe3/bthumbnail.jpg",
                "masonry": "https://s3.amazonaws.com/photorank-media/media/q/o/y/qoygwe3/masonry.jpg",
                "mini": "https://s3.amazonaws.com/photorank-media/media/q/o/y/qoygwe3/mini.jpg",
                "mobile": "https://s3.amazonaws.com/photorank-media/media/q/o/y/qoygwe3/mobile.jpg",
                "normal": "https://s3.amazonaws.com/photorank-media/media/q/o/y/qoygwe3/normal.jpg",
                "slideshow": "https://s3.amazonaws.com/photorank-media/media/q/o/y/qoygwe3/slideshow.jpg",
                "square": "https://s3.amazonaws.com/photorank-media/media/q/o/y/qoygwe3/square.jpg",
                "thumbnail": "https://s3.amazonaws.com/photorank-media/media/q/o/y/qoygwe3/thumbnail.jpg"
            },
            "date_submitted": "2013-08-06T19:06:49+0000",
            "type": "IMAGE",
            "status": "OK",
            "status_id": 40,
            "source": {
                "name": "instagram",
                "url": "http://instagram.com/p/cRb9FzAfIU/",
                "data": {
                    "id": "509311178237932052_183470123",
                    "url": "http://instagram.com/p/cRb9FzAfIU/",
                    "filter": "",
                    "comments": 1,
                    "likes": {
                        "count": 7
                    },
                    "user_ids": null,
                    "usernames": null
                }
            },
            "user": {
                "id": 1143184,
                "name": "Horacio Oliva",
                "email": "horacioliva@fake.instagram.com",
                "language": "en_US",
                "username": "horacioliva",
                "source": "INSTAGRAM_UPLOAD",
                "partner_id": null
            },
            "streams": [
                {
                    "id": 1975619675,
                    "name": "Olapic Gallery",
                    "tag_based_key": null,
                    "$$hashKey": "00Y"
                }
            ],
            "rights": "NOT-REQUESTED",
            "video_url": null,
            "zoolander_ads": {},
            "sonar_place": {},
            "$$hashKey": "005"
        };

    beforeEach(module('op.modal'));
    beforeEach(module('templates'));

    beforeEach(inject(function(_$compile_, _$rootScope_, modalService){
        $scope = _$rootScope_;
        $scope.modal = modalService({
            callbacks: {
                itemAdded: function(){},
                itemRemoved: function(){}
            }
        });

        spyOn($scope.modal.callbacks, 'afterOpen');
        spyOn($scope.modal.callbacks, 'afterClose');

        elem = angular.element('<op-modal></op-modal>');
        _$compile_(elem)($scope);
        $scope.$digest();
    }));

    it('should change the current entity when is single', function(){
        expect($scope.modal.current).toEqual([]);
        $scope.modal.actions.open([dummyEntity]);
        expect($scope.modal.current).toEqual([dummyEntity]);
    });

    it('should change the current entity when is bulk', function(){
        expect($scope.modal.current).toEqual([]);
        $scope.modal.actions.open([dummyEntity, dummyEntity]);
        expect($scope.modal.current).toEqual([dummyEntity, dummyEntity]);
    });

    it('should set the entities as navigaton', function(){
        expect($scope.modal.entities).toEqual([]);
        $scope.modal.actions.navigation([dummyEntity, dummyEntity]);
        expect($scope.modal.entities).toEqual([dummyEntity, dummyEntity]);
    });

    it('should trigger callbacks on afterOpen', function(){
        var spyStart = $scope.modal.callbacks.afterOpen;
        expect(spyStart).not.toHaveBeenCalled();
        $scope.modal.actions.open([]);
        expect(spyStart).toHaveBeenCalled();
    });

    it('should trigger callbacks on afterClose', function(){
        var spyStart = $scope.modal.callbacks.afterClose;
        expect(spyStart).not.toHaveBeenCalled();
        $scope.modal.actions.open([]);
        $scope.modal.actions.close();
        expect(spyStart).toHaveBeenCalled();
    });

});
