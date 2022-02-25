'use strict';

describe('Factory: qaFactory', function() {
    var $rootScope;
    var qaFactory;
    var authService;
    var adminAPIService;
    var $q;
    var EXTERNAL_TRACKING_EVENTS;
    var INTERNAL_TRACKING_EVENTS;
    var API_MEDIA_STATUSES_ID;
    var trackingService;
    var blacklistUserService;
    var modalMediaAnnotationService;
    var sectionService;
    var deferredMetadataApproveResponse;
    var deferredlinkStatusToMediaResponse;
    var deferredAnnotationResponse;

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
        },
        streams: []
    };
    var fakeStreamList = [
        {id: 1, name: 'Stream 1'},
        {id: 2, name: 'Stream 2'}
    ];

    beforeEach(module('appConfig', 'op.masterMind', 'op.auth', 'common'));
    beforeEach(module('ngRoute'));
    beforeEach(module('qa'));
    beforeEach(module(function($provide) {
        var _trackingService = {
            event: function() {},
            flush: function() {}
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
                    rejected: 'rejected',
                    tagged: 'tagged'
                }
            };
        });
        $provide.factory('API_MEDIA_STATUSES_ID', function() {
            return {
                PENDING: 20,
                PREMOD: 21,
                PREDELETED: 9,
                DELETED_TAGGING: 12,
                QA_REJECTED: 51,
                QA_PREMOD: 13,
                QA_TAGGING: 14,
                OK: 40,
                SFL: 23,
                TAGGING: 25,
                CUSTOMER_PREMOD: 24,
                SPAM: 11,
                MOD_SPAM: 15,
                DELETED: 1,
                REPORTED: 22
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
        _qaFactory_,
        _EXTERNAL_TRACKING_EVENTS_,
        _INTERNAL_TRACKING_EVENTS_,
        _API_MEDIA_STATUSES_ID_,
        _trackingService_,
        _blacklistUserService_,
        _modalMediaAnnotationService_,
        _sectionService_
    ) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        authService = _authService_;
        adminAPIService = _adminAPIService_;
        qaFactory = _qaFactory_;
        EXTERNAL_TRACKING_EVENTS = _EXTERNAL_TRACKING_EVENTS_;
        INTERNAL_TRACKING_EVENTS = _INTERNAL_TRACKING_EVENTS_;
        API_MEDIA_STATUSES_ID = _API_MEDIA_STATUSES_ID_;
        trackingService = _trackingService_;
        blacklistUserService = _blacklistUserService_;
        modalMediaAnnotationService = _modalMediaAnnotationService_;
        sectionService = _sectionService_;
    }));

    beforeEach(inject(function($httpBackend) {
        $httpBackend.when('GET', '/auth/api/tokeninfo').respond(tokenInfo);
        $httpBackend.when('GET', '/auth/customer').respond(fakeCustomer);
        // fake the api response
        deferredMetadataApproveResponse = $q.defer();
        deferredlinkStatusToMediaResponse = $q.defer();
        deferredAnnotationResponse = $q.defer();

        spyOn(adminAPIService, 'linkStatusToMedia').and.returnValue(
            deferredlinkStatusToMediaResponse.promise
        );
        spyOn(adminAPIService, 'addApproveMetadata').and.returnValue(
            deferredMetadataApproveResponse.promise
        );
        spyOn(adminAPIService, 'getAnnotations').and.returnValue(
            deferredAnnotationResponse.promise
        );
        spyOn(adminAPIService, 'getCustomer').and.returnValue($q.when({
            data: fakeCustomer
        }));
        spyOn(trackingService, 'event');
        spyOn(trackingService, 'flush');
        spyOn(blacklistUserService, 'blacklistUser');
        spyOn(blacklistUserService, 'rejectMediaAfterBlacklist');
        spyOn($rootScope, '$emit');

        qaFactory.resetCustomer();
    }));

    describe('Actions tracking', function() {
        it('should provide tracking object', function() {
            expect(qaFactory.trackAssing).toEqual(jasmine.any(Function));
        });

        it('should track an approve action', function() {
            //Given
            var entity = angular.copy(fakeEntity);
            qaFactory.resetCustomer();
            $rootScope.$digest();

            //When
            qaFactory.passQAMediaBatch([entity]);
            deferredMetadataApproveResponse.resolve({
                data: {
                    media: {
                        111: {
                            status: 200,
                            message: 'OK'
                        }
                    }
                }
            });
            $rootScope.$digest();

            //Then
            expect(trackingService.event).toHaveBeenCalledWith('media.approved',
            {
                id: fakeEntity.id + '', // due the method use the mediaID from the response which is an String
                type: 'media',
            });
            expect(trackingService.flush).toHaveBeenCalled();
            expect($rootScope.$emit).toHaveBeenCalledWith(INTERNAL_TRACKING_EVENTS.media.approved, 1);
            expect(adminAPIService.addApproveMetadata.calls.count()).toEqual(1);
        });

        it('should track approved and tagged actions when streams are presented', function() {
            //Given
            var entity = angular.copy(fakeEntity);
            entity.streams = ['STREAM_1'];
            qaFactory.resetCustomer();
            $rootScope.$digest();

            //When
            qaFactory.passQAMediaBatch([entity]);
            deferredMetadataApproveResponse.resolve({
                data: {
                    media: {
                        111: {
                            status: 200,
                            message: 'OK'
                        }
                    }
                }
            });
            $rootScope.$digest();

            //Then
            expect(trackingService.event).toHaveBeenCalledWith('media.approved',
            {
                id: fakeEntity.id + '', // due the method use the mediaID from the response which is an String
                type: 'media',
            });
            expect(trackingService.flush).toHaveBeenCalled();
            expect(adminAPIService.addApproveMetadata.calls.count()).toEqual(1);
            expect($rootScope.$emit).toHaveBeenCalledWith(INTERNAL_TRACKING_EVENTS.media.approved, 1);
            expect(adminAPIService.addApproveMetadata).toHaveBeenCalledWith([entity], true);
        });

        it('should not track approved and tagged actions for fail media', function() {
            //Given
            var entity = angular.copy(fakeEntity);
            entity.streams = ['STREAM_1'];
            qaFactory.resetCustomer();
            $rootScope.$digest();

            //When
            qaFactory.passQAMediaBatch([entity]);
            deferredMetadataApproveResponse.resolve({
                data: {
                    media: {
                        111: {
                            status: 400,
                            message: 'ERROR'
                        }
                    }
                }
            });
            $rootScope.$digest();

            //Then
            expect(trackingService.event).not.toHaveBeenCalled();
            expect(trackingService.flush).not.toHaveBeenCalled();
            expect($rootScope.$emit).not.toHaveBeenCalled();
            expect(adminAPIService.addApproveMetadata.calls.count()).toEqual(1);
            expect(adminAPIService.addApproveMetadata).toHaveBeenCalledWith([entity], true);
        });

        it('should track a reject action', function() {
            //Given
            var entity = angular.copy(fakeEntity);
            qaFactory.setFiltersValue({
                query: {
                    filters: {
                        nsfw: undefined
                    }
                }
            });
            qaFactory.resetCustomer();
            $rootScope.$digest();

            //When
            qaFactory.rejectMediaBatch([entity]);
            deferredlinkStatusToMediaResponse.resolve({
                data: {
                    media: {
                        111: {
                            status: 200,
                            message: 'OK'
                        }
                    }
                }
            });
            $rootScope.$digest();

            //Then
            expect(trackingService.event).toHaveBeenCalledWith(
                'media.rejected',
                {
                    id: fakeEntity.id + '', // due the method use the mediaID from the response which is an String
                    type: 'media',
                },
                undefined,
                undefined,
                undefined
            );
            expect(trackingService.flush).toHaveBeenCalled();
            expect(adminAPIService.linkStatusToMedia.calls.count()).toEqual(1);
            expect(adminAPIService.linkStatusToMedia).toHaveBeenCalledWith([entity], API_MEDIA_STATUSES_ID.QA_REJECTED);
        });

        it('should track a report as spam action', function() {
            //Given
            var entity = angular.copy(fakeEntity);
            qaFactory.resetCustomer();
            $rootScope.$digest();

            //When
            qaFactory.flagMediaAsSpamBatch([entity]);
            deferredlinkStatusToMediaResponse.resolve({
                data: {
                    media: {
                        111: {
                            status: 200,
                            message: 'OK'
                        }
                    }
                }
            });
            $rootScope.$digest();

            //Then
            expect(trackingService.event).toHaveBeenCalledWith('media.flagged-as-spam',
            {
                id: fakeEntity.id + '', // due the method use the mediaID from the response which is an String
                type: 'media'
            });
            expect(trackingService.flush).toHaveBeenCalled();
            expect(adminAPIService.linkStatusToMedia.calls.count()).toEqual(1);
            expect(adminAPIService.linkStatusToMedia).toHaveBeenCalledWith([entity], API_MEDIA_STATUSES_ID.MOD_SPAM);
        });

        // not sure about this, we're testing a tracking function that may not be
        // called from MasterMind :(
        it('should track a streams assignation', function() {
            //Given
            var entity = angular.copy(fakeEntity);
            var dataToAssing = {
                streamsToLink: fakeStreamList
            };
            qaFactory.resetCustomer();
            $rootScope.$digest();

            //When
            qaFactory.trackAssing([entity], dataToAssing);
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
            qaFactory.resetCustomer();
            $rootScope.$digest();

            //When
            qaFactory.trackAssing([entity], dataToAssing, metadataValue);
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
            //Given
            var entity = angular.copy(fakeEntity);
            var dataToAssing = {
                streamsToUnlink: fakeStreamList,
                streamsToLink: []
            };
            qaFactory.resetCustomer();
            $rootScope.$digest();

            //When
            qaFactory.trackAssing([entity], dataToAssing);
            $rootScope.$digest();

            //Then
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
            qaFactory.resetCustomer();
            $rootScope.$digest();
            // When
            qaFactory.trackAssing([entity], dataToAssing);
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

    describe('tagging section methods', function() {
        it('should use the status MOD_SPAM (15)', function() {
            //Given
            var entity = angular.copy(fakeEntity);
            qaFactory.resetCustomer();
            $rootScope.$digest();

            //When
            qaFactory.flagMediaAsSpamBatch([entity]);
            $rootScope.$digest();

            //Then
            expect(adminAPIService.linkStatusToMedia).toHaveBeenCalledWith([entity], 15);
            expect(adminAPIService.linkStatusToMedia.calls.count()).toEqual(1);
        });

        it('should get annotationsData from adminApiService', function() {
            //Given
            var mediaId = '123456';
            var streamlist = ['STREAM_1', 'STREAM_2', 'STREAM_3'];

            //When
            qaFactory.getAnnotations(mediaId, streamlist);
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
