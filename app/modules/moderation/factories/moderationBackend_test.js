'use strict';

describe('Factory: ModerationBackend', function() {

    var $rootScope;
    var ModerationBackend;
    var authService;
    var adminAPIService;
    var $q;
    var EXTERNAL_TRACKING_EVENTS;
    var INTERNAL_TRACKING_EVENTS;
    var trackingService;
    var blacklistUserService;
    var deferredAnnotationResponse;
    var modalMediaAnnotationService;
    var sectionService;
    var fakeCustomer = {
        id: 123,
        name: 'A fake customer',
        settings: {
            tagging: true,
            section_express_moderator: 0
        }
    };
    var tokenInfo = {
        account: {
            name: 'pepe',
            email: 'pepe@olapic.com'
        },
        credential: [fakeCustomer]
    };
    var fakeEntity = {
        id: 111,
        user: {
            id: 1234
        },
        source: {
            name: 'fakeSource',
            data: {
                id: 123
            }
        }
    };
    var fakeStreamList = [
        {id: 1, name: 'Stream 1'},
        {id: 2, name: 'Stream 2'}
    ];

    beforeEach(module('appConfig', 'op.masterMind', 'op.auth', 'common'));
    beforeEach(module('ngRoute'));
    beforeEach(module('moderation'));

    beforeEach(module(function($provide) {
        var _trackingService = {
            event: function() {},
            flush: function() {},
            getFilterMetadata: function() {}
        };
        var _blacklistUserService = {
            blacklistUser: function() {},
            rejectMediaAfterBlacklist: function() {}
        };
        var _modalMediaAnnotationService = {
            cleanAnnotationList: jasmine.createSpy('cleanAnnotationList'),
            translateAndSetNewAnnotations: jasmine.createSpy('translateAndSetNewAnnotations')
        };

        $provide.value('trackingService', _trackingService);
        $provide.value('blacklistUserService', _blacklistUserService);
        $provide.value('modalMediaAnnotationService', _modalMediaAnnotationService);
        $provide.factory('EXTERNAL_TRACKING_EVENTS', function() {
            return {
                media: {
                    flagAsSpam: 'rome:externalTracking:media:flagAsSpam'
                }
            };
        });
        $provide.factory('INTERNAL_TRACKING_EVENTS', function() {
            return {
                media: {
                    approved: 'approved',
                    rejected: 'rejected'
                }
            };
        });
        $provide.factory('sectionService', function() {
            return {
                current: function() {}
            };
        });
    }));

    beforeEach(inject(function(
        _$q_,
        _$rootScope_,
        _authService_,
        _adminAPIService_,
        _EXTERNAL_TRACKING_EVENTS_,
        _INTERNAL_TRACKING_EVENTS_,
        _trackingService_,
        _blacklistUserService_,
        _modalMediaAnnotationService_,
        _sectionService_
    ) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        authService = _authService_;
        adminAPIService = _adminAPIService_;
        EXTERNAL_TRACKING_EVENTS = _EXTERNAL_TRACKING_EVENTS_;
        INTERNAL_TRACKING_EVENTS = _INTERNAL_TRACKING_EVENTS_;
        trackingService = _trackingService_;
        blacklistUserService = _blacklistUserService_;
        modalMediaAnnotationService = _modalMediaAnnotationService_;
        sectionService = _sectionService_;
    }));
    beforeEach(inject(function($httpBackend) {
        $httpBackend.when('GET', '/auth/api/tokeninfo').respond(tokenInfo);
        $httpBackend.when('GET', '/auth/customer').respond(fakeCustomer);
        deferredAnnotationResponse = $q.defer();

        // fake the api response
        spyOn(adminAPIService, 'linkStatusToMedia').and.callFake(function(media) {
            var result = {data:{media: {}}};
            angular.forEach(media, function(m) {
                result.data.media[m.id] =  {
                    status: 200,
                    message: 'OK'
                };
            });
            return $q.when(result);
        });
        spyOn(adminAPIService, 'getAnnotations').and.returnValue(
            deferredAnnotationResponse.promise
        );
        spyOn(adminAPIService, 'getCustomer').and.returnValue($q.when({data:fakeCustomer}));
        spyOn(trackingService, 'event');
        spyOn(trackingService, 'flush');
        spyOn(blacklistUserService, 'blacklistUser');
        spyOn(blacklistUserService, 'rejectMediaAfterBlacklist');
    }));

    beforeEach(inject(function(
        _ModerationBackend_
    ) {
        ModerationBackend = _ModerationBackend_;
    }));

    describe('Actions tracking', function() {

        it('should provide tracking object', function() {
            expect(ModerationBackend.trackAssing).toEqual(jasmine.any(Function));
        });

        it('should track an move to SFL action', function() {
            var entity = angular.copy(fakeEntity);
            ModerationBackend.resetCustomer();
            $rootScope.$digest();
            // When
            ModerationBackend.putOnSFL([entity]);
            $rootScope.$digest();
            // Then
            expect(trackingService.event).toHaveBeenCalledWith('media.saved-for-later', {
                id: fakeEntity.id + '',
                type: 'media'
            });
            expect(trackingService.flush).toHaveBeenCalled();
            expect(adminAPIService.linkStatusToMedia.calls.count()).toEqual(1);
        });

        it('should track a reject action', function() {
            // Given
            var entity = angular.copy(fakeEntity);
            ModerationBackend.setFiltersValue({
                query: {
                    filters: {
                        nsfw: undefined
                    }
                }
            });
            ModerationBackend.resetCustomer();
            $rootScope.$digest();
            // Set filters values
            ModerationBackend.setFiltersValue({
                query: {
                    filters: { }
                }
            });
            spyOn(trackingService, 'getFilterMetadata').and.returnValue(undefined);

            // When
            ModerationBackend.reject([entity]);
            $rootScope.$digest();
            // Then
            expect(trackingService.event).toHaveBeenCalledWith(
                'media.rejected',
                {
                    id: fakeEntity.id + '',
                    type: 'media'
                },
                undefined,
                undefined,
                undefined
            );
            expect(trackingService.flush).toHaveBeenCalled();
            expect(adminAPIService.linkStatusToMedia.calls.count()).toEqual(1);
        });

        it('should track a report as spam action', function() {
            var entity = angular.copy(fakeEntity);
            ModerationBackend.resetCustomer();
            $rootScope.$digest();
            // When
            ModerationBackend.flagMediaAsSpam([entity]);
            $rootScope.$digest();
            // Then
            expect(trackingService.event).toHaveBeenCalledWith('media.flagged-as-spam', {
                id: fakeEntity.id + '', // due the method use the mediaID from the response which is an String
                type: 'media'
            });
            expect(trackingService.flush).toHaveBeenCalled();
            expect(adminAPIService.linkStatusToMedia.calls.count()).toEqual(1);
        });

        it('should track a send to pending action', function() {
            var entity = angular.copy(fakeEntity);
            ModerationBackend.resetCustomer();
            $rootScope.$digest();
            // When
            ModerationBackend.putOnPending([entity]);
            $rootScope.$digest();
            // Then
            expect(trackingService.event).toHaveBeenCalledWith('media.sent-to-pending', {
                id: fakeEntity.id + '', // due the method use the mediaID from the response which is an String
                type: 'media'
            });
            expect(trackingService.flush).toHaveBeenCalled();
            expect(adminAPIService.linkStatusToMedia.calls.count()).toEqual(1);
        });

        // not sure about this, we're testing a tracking function that may not be
        // called from MasterMind :(
        it('should track a streams assignation', function() {
            // Given
            var entity = angular.copy(fakeEntity);
            var dataToAssing = {
                streamsToLink: fakeStreamList
            };
            ModerationBackend.resetCustomer();
            $rootScope.$digest();
            ModerationBackend.setFiltersValue({
                query: {
                    filters: { }
                }
            });
            spyOn(trackingService, 'getFilterMetadata').and.returnValue([]);

            // When
            ModerationBackend.trackAssing([entity], dataToAssing);
            $rootScope.$digest();
            // Then
            expect(trackingService.event).toHaveBeenCalledWith(
                'media.tagged',
                {
                    id: fakeEntity.id,
                    type: 'media'
                },
                undefined,
                {
                    id: fakeStreamList[0].id,
                    type: 'stream'
                },
                undefined
            );
            expect(trackingService.event).toHaveBeenCalledWith(
                'media.tagged',
                {
                    id: fakeEntity.id,
                    type: 'media'
                },
                undefined,
                {
                    id: fakeStreamList[1].id,
                    type: 'stream'
                },
                undefined
            );
            expect(trackingService.flush).toHaveBeenCalled();
        });

        it('should track a streams assignation with metadata Information when it is defined', function() {
            //Given
            var entity = angular.copy(fakeEntity);
            var dataToAssing = {
                streamsToLink: fakeStreamList
            };
            var metadataValue = [
                {
                    key: 'tagging_type',
                    value: 'suggestions'
                },
                {
                    key: 'suggestion_order',
                    value: 2
                }
            ];
            ModerationBackend.resetCustomer();
            $rootScope.$digest();

            //When
            ModerationBackend.trackAssing([entity], dataToAssing, metadataValue);
            $rootScope.$digest();

            //Then
            expect(trackingService.event).toHaveBeenCalledWith(
                'media.tagged',
                {
                    id: fakeEntity.id,
                    type: 'media'
                },
                undefined,
                {
                    id: fakeStreamList[0].id,
                    type: 'stream'
                },
                metadataValue
            );
            expect(trackingService.event).toHaveBeenCalledWith(
                'media.tagged',
                {
                    id: fakeEntity.id,
                    type: 'media'
                },
                undefined,
                {
                    id: fakeStreamList[1].id,
                    type: 'stream'
                },
                metadataValue
            );
            expect(trackingService.flush).toHaveBeenCalled();
        });

        it('should track a streams unassignation', function() {
            var entity = angular.copy(fakeEntity);
            var dataToAssing = {
                streamsToUnlink: fakeStreamList,
                streamsToLink: []
            };
            ModerationBackend.resetCustomer();
            $rootScope.$digest();
            // When
            ModerationBackend.trackAssing([entity], dataToAssing);
            $rootScope.$digest();
            // Then
            expect(trackingService.event).toHaveBeenCalledWith('media.untagged', {
                id: fakeEntity.id,
                type: 'media'
            },
            undefined,
            {
                id: fakeStreamList[0].id,
                type: 'stream'
            });
            expect(trackingService.event).toHaveBeenCalledWith('media.untagged', {
                id: fakeEntity.id,
                type: 'media'
            },
            undefined,
            {
                id: fakeStreamList[1].id,
                type: 'stream'
            });
            expect(trackingService.flush).toHaveBeenCalled();
        });

        it('should track reordering', function() {
            var entity = angular.copy(fakeEntity);
            var dataToAssing = {
                streamsToUnlink: [],
                streamsToLink: []
            };
            ModerationBackend.resetCustomer();
            $rootScope.$digest();
            // When
            ModerationBackend.trackAssing([entity], dataToAssing);
            $rootScope.$digest();
            // Then
            expect(trackingService.event).toHaveBeenCalledWith(
                'media.reorder',
                {
                    id: fakeEntity.id,
                    type: 'media'
                }
            );
            expect(trackingService.flush).toHaveBeenCalled();
        });
    });

    describe('moderation section methods', function() {
        it('should use the status MOD_SPAM (15)', function() {
            var entity = angular.copy(fakeEntity);
            ModerationBackend.resetCustomer();
            $rootScope.$digest();
            // When
            ModerationBackend.flagMediaAsSpam([entity]);
            $rootScope.$digest();
            // Then
            expect(adminAPIService.linkStatusToMedia).toHaveBeenCalledWith([entity], 15);
            expect(adminAPIService.linkStatusToMedia.calls.count()).toEqual(1);
        });

        it('should get annotationsData from adminApiService', function() {
            //Given
            var mediaId = '123456';
            var streamlist = ['STREAM_1', 'STREAM_2', 'STREAM_3'];

            //When
            ModerationBackend.getAnnotations(mediaId, streamlist);
            deferredAnnotationResponse.resolve(['ANNOTATION_1', 'ANNOTATION_2']);
            $rootScope.$digest();

            //Then
            expect(modalMediaAnnotationService.cleanAnnotationList.calls.count()).toEqual(1);
            expect(adminAPIService.getAnnotations).toHaveBeenCalledWith(mediaId);
            expect(adminAPIService.getAnnotations.calls.count()).toEqual(1);
            expect(modalMediaAnnotationService.translateAndSetNewAnnotations.calls.count()).toEqual(1);
            expect(modalMediaAnnotationService.translateAndSetNewAnnotations).toHaveBeenCalledWith(
                ['ANNOTATION_1', 'ANNOTATION_2'],
                streamlist
            );
        });
    });
});
