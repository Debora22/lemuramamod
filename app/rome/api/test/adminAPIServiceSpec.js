describe('The Admin API service:', function() {
    var $httpBackend;
    var APIService;
    var AdminAPIService;
    var scope;
    var dummySuggestedStreamResponse = {
        metadata: {
            code: 200,
            message: 'OK'
        },
        data: {
            streams: {
                uncategorized: [{
                    id: 2154621231,
                    name: 'Hank Haney Short Game DVD',
                    base_media: {
                        id: 2222686359
                    }
                },
                {
                    id: 2154597579,
                    name: 'Croc Shoes - Pink',
                    base_media: {
                        id: 2222646764
                    }
                }]
            }
        }
    };
    var dummySuggestedStreamNormalized = {
        uncategorized: [
            {
                id: 2154621231,
                name: 'Hank Haney Short Game DVD',
                base_media: {
                    id: 2222686359
                },
                image: 'https://s3.amazonaws.com/photorank-media/media/5/c/j/5cj9tq3/normal.jpg',
                base_image: 'https://s3.amazonaws.com/photorank-media/media/5/c/j/5cj9tq3/normal.jpg',
                title: 'Hank Haney Short Game DVD'
            },
            {
                id: 2154597579,
                name: 'Croc Shoes - Pink',
                base_media: {
                    id: 2222646764
                },
                image: 'https://s3.amazonaws.com/photorank-media/media/a/y/f/ayf8tq3/normal.jpg',
                base_image: 'https://s3.amazonaws.com/photorank-media/media/a/y/f/ayf8tq3/normal.jpg',
                title: 'Croc Shoes - Pink'
            }
        ]
    };
    var dummyStreamPositionResponse = {
        meta: {},
        data: {
            streams: {
                101: {
                    id: 101,
                    name: 'Awesome product',
                    status: {id: 0, name:'INACTIVE'},
                    base_media: {id: 2245749359},
                    tag_based_key: 'wd91827d1',
                    product: {url: 'https://awesomestore.com/wd91827d1.html', metadata: null}
                },
                102: {id: 102, name: 'Child product'},
                145: {id: 145, name: 'Another product'}
            },
            stream_positions:{
                666: {
                    // the new map does not includes the 100, it was removed by another process
                    // and includes the 101 (parent of 102)
                    streams: [145, 101, 102]
                },
                444: {
                    streams: []
                }
            }
        }
    };
    beforeEach(module('op.api'));

    beforeEach(function() {
        module(function($provide) {
            $provide.constant('appConstant', {
                adminAPI: {
                    url: 'https://admin-api.local.photorank.me'
                },
                adminAPI2: {
                    url: 'https://admin-api-v2.local.photorank.me'
                },
                base_image: {
                    url: 'https://s3.amazonaws.com/photorank-media/media/'
                }
            });
        });
    });

    beforeEach(inject(function(_$httpBackend_, $rootScope, apiService, adminAPIService) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();
        APIService = apiService;
        AdminAPIService = adminAPIService;
    }));

    it('should have public methods', function() {
        expect(AdminAPIService.streamNormalizer).toEqual(jasmine.any(Function));
        expect(AdminAPIService.getMediaWithGivenRights).toEqual(jasmine.any(Function));
        expect(AdminAPIService.getMediaWithRequestedRights).toEqual(jasmine.any(Function));
        expect(AdminAPIService.sendCommentInBulk).toEqual(jasmine.any(Function));
        expect(AdminAPIService.blacklistUser).toEqual(jasmine.any(Function));
        expect(AdminAPIService.getMediaPositions).toEqual(jasmine.any(Function));
        expect(AdminAPIService.hydrateMedia).toEqual(jasmine.any(Function));
        expect(AdminAPIService.postMediaPositions).toEqual(jasmine.any(Function));
        expect(AdminAPIService.getSuggestedStream).toEqual(jasmine.any(Function));
        expect(AdminAPIService.getStreamsPositions).toEqual(jasmine.any(Function));
        expect(AdminAPIService.postStreamsPositions).toEqual(jasmine.any(Function));
        expect(AdminAPIService.linkStatusToMedia).toEqual(jasmine.any(Function));
        expect(AdminAPIService.getCustomer).toEqual(jasmine.any(Function));
        expect(AdminAPIService.extractStreamPositions).toEqual(jasmine.any(Function));
    });

    it('should make a request for the list of media with given rights', function() {
        $httpBackend
            .expectGET(/rights\/given\?direction=asc&limit=20&page=1&sort=given_date/)
            .respond(200);
        AdminAPIService.getMediaWithGivenRights();
        $httpBackend.flush();
    });

    it('should make a request for the list of media with requested rights', function() {
        $httpBackend
            .expectGET(/rights\/requested\?direction=asc&limit=20&page=1&sort=request_date/)
            .respond(200);
        AdminAPIService.getMediaWithRequestedRights();
        $httpBackend.flush();
    });

    it('should blacklist a user', function() {
        // Given
        spyOn(APIService, 'post');

        // When
        AdminAPIService.blacklistUser([{
            user: {
                id: 103287148
            },
            source: {
                name: 'instagram'
            }
        }]);

        // Then
        expect(APIService.post).toHaveBeenCalledWith('https://admin-api-v2.local.photorank.me/users/blacklist', {
            users_list: [
                {
                    user_id: 103287148,
                    source_name: 'instagram'
                }
            ]
        });
    });

    it('should get media positions for a given stream', function() {
        $httpBackend.whenGET(/streams\/666\/media\/positions/, undefined, function(h) {
            return h['X-Filter-Empty'] === 1;
        }).respond(200, {
            1: '111',
            4: '222',
            5: '333'
        });
        AdminAPIService.getMediaPositions(666).then(function(data) {
            expect(data['1']).toEqual('111');
            expect(data['4']).toEqual('222');
            expect(data['5']).toEqual('333');
        });
        $httpBackend.flush();
    });

    it('should get media positions for a given stream when 404', function() {
        $httpBackend.whenGET(/streams\/666\/media\/positions/).respond(404);
        AdminAPIService.getMediaPositions(666).then(function(data) {
            expect(data).toEqual([]);
        });
        $httpBackend.flush();
    });

    it('should save media positions for a given stream', function() {
        $httpBackend.whenPOST(/streams\/666\/media\/positions/).respond(200, {});
        var data = {
            set: {
                1: 111
            },
            unset: [222],
        };
        AdminAPIService.postMediaPositions(666, data).then(function(data) {
            expect(data).toEqual({});
        });
        $httpBackend.flush();
    });

    it('should obtain the streams map for the given media ID', function(done) {
        $httpBackend.expectGET(/\/media\/streams\/positions\?media_ids\=666,444/)
            .respond(200, dummyStreamPositionResponse);
        AdminAPIService.getStreamsPositions([666, 444]).then(function(map) {
            expect(map).toEqual(jasmine.any(Object));
            expect(map[666].length).not.toEqual(0);
            expect(map[666][0].id).toEqual(145);
            expect(map[666][1].id).toEqual(101);
            expect(map[666][2].id).toEqual(102);
            expect(map[444].length).toEqual(0);
            done();
        });
        $httpBackend.flush();
    });

    it('should obtain stream and its positions for a given bulk of media when 404', function() {
        $httpBackend.expectGET(/media\/streams\/positions\?media_ids/)
            .respond(404, {meta: {status: 404}});
        AdminAPIService.getStreamsPositions([]).then(function(data) {
            expect(data).toEqual({});
        });
        $httpBackend.flush();
    });

    it('should save the streams map for the given media in bulk', function(done) {
        var data = {
            link: [102],
            unlink: [555],
            positions: []
        };
        $httpBackend.expectPOST(/\/media\/streams\/positions\?media_ids=666,444/, data)
            .respond(200, dummyStreamPositionResponse);
        AdminAPIService.postStreamsPositions([666, 444], data).then(function(media) {
            expect(media[444]).toEqual([]);
            expect(media[666].length).not.toEqual(0);
            expect(media[666][0].id).toEqual(145);
            expect(media[666][1].id).toEqual(101);
            expect(media[666][2].id).toEqual(102);
            done();
        });
        $httpBackend.flush();
    });

    it('should obtain suggested stream for the given mediaId', function() {
        $httpBackend.expectGET(/\/media\/12345\/streams\/suggestions/)
            .respond(200, dummySuggestedStreamResponse);
        AdminAPIService.getSuggestedStream(12345).then(function(resp) {
            expect(resp).toEqual(jasmine.any(Object));
            expect(resp).toEqual(dummySuggestedStreamNormalized);
        });
        $httpBackend.flush();
    });
});
