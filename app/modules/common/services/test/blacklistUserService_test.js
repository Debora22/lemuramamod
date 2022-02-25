describe('Blacklist User Service:', function() {
    var blacklistUserService;
    var trackingService;
    var adminAPIService;
    var deferredblacklistResponse;
    var rootScope;
    var EXTERNAL_TRACKING_EVENTS;

    beforeEach(module('common'));

    beforeEach(module(function($provide) {
        var _adminAPIService = {
            blacklistUser: function() {}
        };
        var _trackingService = {
            event: function() {},
            flush: function() {}
        };

        $provide.value('adminAPIService', _adminAPIService);
        $provide.value('trackingService', _trackingService);
        $provide.factory('EXTERNAL_TRACKING_EVENTS', function() {
            return {
                user: {
                    blacklist: 'rome:externalTracking:user:blacklist'
                }
            };
        });
    }));

    beforeEach(inject(function(
        $rootScope,
        $q,
        _blacklistUserService_,
        _trackingService_,
        _adminAPIService_,
        _EXTERNAL_TRACKING_EVENTS_
    ) {
        blacklistUserService = _blacklistUserService_;
        trackingService = _trackingService_;
        adminAPIService = _adminAPIService_;
        rootScope = $rootScope;
        EXTERNAL_TRACKING_EVENTS = _EXTERNAL_TRACKING_EVENTS_;
        deferredblacklistResponse = $q.defer();

        spyOn(trackingService, 'event');
        spyOn(trackingService, 'flush');
        spyOn(rootScope, '$emit');
        spyOn(adminAPIService, 'blacklistUser').and.returnValue(deferredblacklistResponse.promise);
    }));

    it('should have public method', function() {
        expect(blacklistUserService.blacklistUser).toEqual(jasmine.any(Function));
    });

    it('should blacklist user and emit events', function() {
        //Given
        var mediaSelected = ['media_1', 'media_2'];
        var blacklistResponse = {
            data: {
                user_blacklist: [
                    {user_id: '12345', black_list_id: '1', status: 200, message: 'OK'},
                    {user_id: '54321', black_list_id: '2', status: 405, message: 'ERROR MESSAGE'}
                ]
            }
        };

        //When
        blacklistUserService.blacklistUser(mediaSelected);
        deferredblacklistResponse.resolve(blacklistResponse);
        rootScope.$digest();

        //Then
        expect(adminAPIService.blacklistUser.calls.count()).toEqual(1);
        expect(adminAPIService.blacklistUser).toHaveBeenCalledWith(['media_1', 'media_2']);
        expect(rootScope.$emit).toHaveBeenCalledWith(EXTERNAL_TRACKING_EVENTS.user.blacklist, 2);
        expect(trackingService.event.calls.count()).toEqual(1);
        expect(trackingService.event).toHaveBeenCalledWith('users.blacklisted', {
            id: '12345',
            type: 'user'
        });
        expect(trackingService.flush).toHaveBeenCalled();
    });
});
