'use strict';

describe('Factory: ExpressModerationHelperFactory', function() {
    var $rootScope;
    var ExpressModerationHelperFactory;
    var authService;
    var $q;
    var adminAPIService;
    var INTERNAL_TRACKING_EVENTS;
    var EXTERNAL_TRACKING_EVENTS;
    var API_MEDIA_STATUSES_ID;
    var trackingService;
    var blacklistUserService;
    var sectionService;
    var deferredlinkStatusToMediaResponse;
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

    angular.module('appConfig', [])
        .constant('appConstant', {
            enviroment: 'local',
            authServer: {
                url: '/auth'
            },
            adminAPI: {
                url: ''
            },
            adminAPI2: {
                url: ''
            },
        })
        .constant('AUTH_EVENTS', {});

    beforeEach(module('appConfig', 'op.auth', 'op.track', 'common', 'op.track'));
    beforeEach(module('ngRoute', 'op.masterMind', 'expressModeration'));

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

        $provide.value('trackingService', _trackingService);
        $provide.value('blacklistUserService', _blacklistUserService);
        $provide.factory('INTERNAL_TRACKING_EVENTS', function() {
            return {
                media: {
                    approved: 'approved',
                    rejected: 'rejected'
                }
            };
        });
        $provide.factory('EXTERNAL_TRACKING_EVENTS', function() {
            return {
                media: {
                    flagAsSpam: 'rome:externalTracking:media:flagAsSpam'
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
        _ExpressModerationHelperFactory_,
        _authService_,
        _adminAPIService_,
        _INTERNAL_TRACKING_EVENTS_,
        _EXTERNAL_TRACKING_EVENTS_,
        _API_MEDIA_STATUSES_ID_,
        _trackingService_,
        _blacklistUserService_,
        _sectionService_
    ) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        ExpressModerationHelperFactory = _ExpressModerationHelperFactory_;
        authService = _authService_;
        adminAPIService = _adminAPIService_;
        INTERNAL_TRACKING_EVENTS = _INTERNAL_TRACKING_EVENTS_;
        EXTERNAL_TRACKING_EVENTS = _EXTERNAL_TRACKING_EVENTS_;
        API_MEDIA_STATUSES_ID = _API_MEDIA_STATUSES_ID_;
        trackingService = _trackingService_;
        blacklistUserService = _blacklistUserService_;
        sectionService = _sectionService_;
    }));

    beforeEach(inject(function($httpBackend) {
        $httpBackend.when('GET', '/auth/api/tokeninfo').respond(tokenInfo);
        $httpBackend.when('GET', '/auth/customer').respond(fakeCustomer);
        // fake the api response
        deferredlinkStatusToMediaResponse = $q.defer();
        spyOn(adminAPIService, 'linkStatusToMedia').and.returnValue(
            deferredlinkStatusToMediaResponse.promise
        );
        spyOn(adminAPIService, 'getCustomer').and.returnValue($q.when({data:fakeCustomer}));
        spyOn(trackingService, 'event');
        spyOn(trackingService, 'flush');
        spyOn(blacklistUserService, 'blacklistUser');
        spyOn(blacklistUserService, 'rejectMediaAfterBlacklist');
        spyOn($rootScope, '$emit');
    }));

    describe('Actions tracking', function() {
        it('should track an approve action', function() {
            //Given
            var entity = angular.copy(fakeEntity);
            ExpressModerationHelperFactory.resetCustomer();
            $rootScope.$digest();
            // Set filters values
            ExpressModerationHelperFactory.setFiltersValue({
                query: {
                    filters: { }
                }
            });
            spyOn(trackingService, 'getFilterMetadata').and.returnValue(undefined);

            //When
            ExpressModerationHelperFactory.approveMedia([entity]);
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
                'media.approved',
                {
                    id: fakeEntity.id,
                    type: 'media'
                },
                undefined,
                undefined,
                undefined
            );
            expect(trackingService.flush).toHaveBeenCalled();
            expect(adminAPIService.linkStatusToMedia.calls.count()).toEqual(1);
        });

        it('should track an approve selected and reject other action', function() {
            //Given
            var entity = angular.copy(fakeEntity);
            var entity2 = angular.extend({}, entity, { id: 555, checked: true});
            var deferredResponse = {
                data: {
                    media: {
                        111: {
                            status: 200,
                            message: 'OK'
                        },
                        555: {
                            status: 200,
                            message: 'OK'
                        }
                    }
                }
            };
            ExpressModerationHelperFactory.setFiltersValue({
                query: {
                    filters: {
                        nsfw: undefined
                    }
                }
            });
            ExpressModerationHelperFactory.resetCustomer();
            $rootScope.$digest();
            // Set filters values
            ExpressModerationHelperFactory.setFiltersValue({
                query: {
                    filters: { }
                }
            });
            spyOn(trackingService, 'getFilterMetadata').and.returnValue(undefined);

            //When
            ExpressModerationHelperFactory.bulkMedia([entity, entity2]);
            deferredlinkStatusToMediaResponse.resolve(deferredResponse);
            $rootScope.$digest();

            //Then
            expect(trackingService.event).toHaveBeenCalledWith(
                'media.rejected',
                {
                    id: fakeEntity.id,
                    type: 'media'
                },
                undefined,
                undefined,
                undefined
            );
            expect(trackingService.event).toHaveBeenCalledWith(
                'media.approved',
                {
                    id: 555,
                    type: 'media'
                },
                undefined,
                undefined,
                undefined
            );
            expect(trackingService.flush).toHaveBeenCalled();
            expect(adminAPIService.linkStatusToMedia.calls.count()).toEqual(1);
        });

        it('should track a reject action', function() {
            //Given
            var entity = angular.copy(fakeEntity);
            ExpressModerationHelperFactory.setFiltersValue({
                query: {
                    filters: {
                        nsfw: undefined
                    }
                }
            });
            ExpressModerationHelperFactory.resetCustomer();
            $rootScope.$digest();
            // Set filters values
            ExpressModerationHelperFactory.setFiltersValue({
                query: {
                    filters: { }
                }
            });
            spyOn(trackingService, 'getFilterMetadata').and.returnValue(undefined);

            //When
            ExpressModerationHelperFactory.rejectMedia([entity]);
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
                    id: fakeEntity.id,
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
            //Given
            var entity = angular.copy(fakeEntity);
            ExpressModerationHelperFactory.resetCustomer();
            $rootScope.$digest();

            //When
            ExpressModerationHelperFactory.flagMediaAsSpam([entity]);
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
            expect(trackingService.event).toHaveBeenCalledWith('media.flagged-as-spam', {
                id: fakeEntity.id + '', // due the method use the mediaID from the response which is an String
                type: 'media'
            });
            expect(trackingService.flush).toHaveBeenCalled();
            expect($rootScope.$emit).toHaveBeenCalledWith(INTERNAL_TRACKING_EVENTS.media.rejected, 1);
            expect($rootScope.$emit).toHaveBeenCalledWith(EXTERNAL_TRACKING_EVENTS.media.flagAsSpam, 1);
            expect(adminAPIService.linkStatusToMedia.calls.count()).toEqual(1);
        });

        it('should track a flag as spam action just for media response with status 200', function() {
            //Given
            var entity = angular.copy(fakeEntity);
            var entity2 = angular.extend({}, entity, { id: 555, checked: true});
            var deferredResponse = {
                data: {
                    media: {
                        111: {
                            status: 200,
                            message: 'OK'
                        },
                        555: {
                            status: 400,
                            message: 'OK'
                        }
                    }
                }
            };
            ExpressModerationHelperFactory.resetCustomer();
            $rootScope.$digest();

            //When
            ExpressModerationHelperFactory.flagMediaAsSpam([entity, entity2]);
            deferredlinkStatusToMediaResponse.resolve(deferredResponse);
            $rootScope.$digest();

            //Then
            expect(trackingService.event).toHaveBeenCalledWith('media.flagged-as-spam', {
                id: fakeEntity.id + '', // due the method use the mediaID from the response which is an String
                type: 'media'
            });
            expect(trackingService.flush.calls.count()).toEqual(1);
            expect($rootScope.$emit).toHaveBeenCalledWith(INTERNAL_TRACKING_EVENTS.media.rejected, 1);
            expect($rootScope.$emit).toHaveBeenCalledWith(EXTERNAL_TRACKING_EVENTS.media.flagAsSpam, 1);
            expect(adminAPIService.linkStatusToMedia.calls.count()).toEqual(1);
        });

        it('should not track flag as spam events when service returns media with status 400', function() {
            //Given
            var entity = angular.copy(fakeEntity);
            ExpressModerationHelperFactory.resetCustomer();
            $rootScope.$digest();

            //When
            ExpressModerationHelperFactory.flagMediaAsSpam([entity]);
            deferredlinkStatusToMediaResponse.resolve({
                data: {
                    media: {
                        111: {
                            status: 400,
                            message: 'OK'
                        }
                    }
                }
            });
            $rootScope.$digest();

            //Then
            expect(trackingService.event).not.toHaveBeenCalled();
            expect(trackingService.flush).not.toHaveBeenCalled();
            expect($rootScope.$emit).not.toHaveBeenCalled();
            expect(adminAPIService.linkStatusToMedia.calls.count()).toEqual(1);
        });
    });
});
