describe('Media Change Status Service:', function() {
    var mediaChangeStatusService;
    var trackingService;
    var adminAPIService;
    var deferredMediaChangeStatusResponse;
    var rootScope;
    var INTERNAL_TRACKING_EVENTS;
    var API_MEDIA_STATUSES_ID;

    beforeEach(module('common'));

    beforeEach(module(function($provide) {
        var _adminAPIService = {
            linkStatusToMedia: function() {}
        };
        var _trackingService = {
            event: function() {},
            flush: function() {}
        };

        $provide.value('adminAPIService', _adminAPIService);
        $provide.value('trackingService', _trackingService);
        $provide.factory('INTERNAL_TRACKING_EVENTS', function() {
            return {
                media: {
                    approved: 'media:status:approved',
                    rejected: 'media:status:rejected'
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
    }));

    beforeEach(inject(function(
        $rootScope,
        $q,
        _mediaChangeStatusService_,
        _trackingService_,
        _adminAPIService_,
        _INTERNAL_TRACKING_EVENTS_,
        _API_MEDIA_STATUSES_ID_
    ) {
        mediaChangeStatusService = _mediaChangeStatusService_;
        trackingService = _trackingService_;
        adminAPIService = _adminAPIService_;
        rootScope = $rootScope;
        INTERNAL_TRACKING_EVENTS = _INTERNAL_TRACKING_EVENTS_;
        API_MEDIA_STATUSES_ID = _API_MEDIA_STATUSES_ID_;
        deferredMediaChangeStatusResponse = $q.defer();

        spyOn(trackingService, 'event');
        spyOn(trackingService, 'flush');
        spyOn(rootScope, '$emit');
        spyOn(adminAPIService, 'linkStatusToMedia').and.returnValue(deferredMediaChangeStatusResponse.promise);
    }));

    it('should have public method', function() {
        expect(mediaChangeStatusService.rejectMedia).toEqual(jasmine.any(Function));
    });

    it('should reject media from moderation section and emit its events', function() {
        //Given
        var mediaSelected = [{
            id: 12345,
            status_id: 20 //ApiMediaStatusId for a media that is in moderation section
        }, {
            id: 54321,
            status_id: 20 //ApiMediaStatusId for a media that is in moderation section
        }];
        var rejectedResponse = {
            data: {
                media: {
                    12345: {
                        message: 'OK',
                        status: 200
                    },
                    54321: {
                        message: 'OK',
                        status: 200
                    }
                }
            }
        };

        //When
        mediaChangeStatusService.rejectMedia(mediaSelected);
        deferredMediaChangeStatusResponse.resolve(rejectedResponse);
        rootScope.$digest();

        //Then
        expect(adminAPIService.linkStatusToMedia.calls.count()).toEqual(1);
        expect(adminAPIService.linkStatusToMedia).toHaveBeenCalledWith(
            [{
                id: 12345,
                status_id: 20
            }, {
                id: 54321,
                status_id: 20
            }],
            API_MEDIA_STATUSES_ID.QA_REJECTED
        );
        expect(rootScope.$emit).toHaveBeenCalledWith(INTERNAL_TRACKING_EVENTS.media.rejected, 2);
        expect(trackingService.event.calls.count()).toEqual(2);
        expect(trackingService.event).toHaveBeenCalledWith(
            'media.rejected',
            {
                id: '12345',
                type: 'media'
            }
        );
        expect(trackingService.event).toHaveBeenCalledWith(
            'media.rejected',
            {
                id: '54321',
                type: 'media'
            }
        );
        expect(trackingService.flush.calls.count()).toEqual(1);
    });

    it('should not reject media from tagging section when a media has wrong a status_id', function() {
        //Given
        var mediaSelected = [{
            id: 12345,
            status_id: 25 //ApiMediaStatusId for a media that is in tagging section
        }, {
            id: 54321,
            status_id: 20 //ApiMediaStatusId for a media that is in moderation section
        }];
        
        //When
        mediaChangeStatusService.rejectMedia(mediaSelected);

        //Then
        expect(adminAPIService.linkStatusToMedia).not.toHaveBeenCalled();
        expect(rootScope.$emit).not.toHaveBeenCalled();
        expect(trackingService.event).not.toHaveBeenCalled();
        expect(trackingService.flush).not.toHaveBeenCalled();
    });
});
