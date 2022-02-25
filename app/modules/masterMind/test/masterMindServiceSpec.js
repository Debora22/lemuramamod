'use strict';

describe('MasterMind service:', function() {

    var $timeout, MasterMind, masterMind, $q, $rootScope, popup, libraryMock, modalMock, filtersMock, growl;

    beforeEach(module('op.masterMind'));
    beforeEach(module('op.auth'));

    angular.module('appConfig', [])
        .constant('appConstant', {
            enviroment: 'local'
        });

    angular.module('op.masterMind').factory('AutocompleteHelperFactory', function() {
        return function() {};
    });

    beforeEach(module(function($provide) {
        $provide.constant('AUTH_EVENTS', {
            loginSuccess: 'auth:login-success',
            loginFailed: 'auth:login-failed',
            logoutSuccess: 'auth:logout-success',
            sessionTimeout: 'auth:session-timeout',
            notAuthenticated: 'auth:not-authenticated',
            notAuthorized: 'auth:not-authorized',
            accountChange: 'auth:account-change',
            accountsSctions: 'section:account'
        });
        $provide.constant('appConstant', {
            appName: 'lemuramav2',
            authServer: {
                url: 'https://oauth.local.photorank.me'
            },
            photorankAPI: {
                url: 'http://rest.local.photorank.me'
            },
            adminAPI: {
                url: 'https://admin-api.local.photorank.me'
            },
            madagascar: {
                url: 'http://localhost:3400'
            },
            enviroment: 'local',
            fullstory: false,
            photorank: {
                url: 'https://local.photorank.me'
            },
            base_image: {
                url: 'https://s3.amazonaws.com/photorank-media/media/'
            },
            modSquadReport: {
                url: 'https://modsquad.local.olapic.com/event'
            },
            anafrus: {
                url: 'https://data.photorank.me/',
                enabled: false,
                bulkLimit: 10
            }
        });
    }));

    beforeEach(inject(function(_$q_, _$rootScope_, _notifications_, _$timeout_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        growl = _notifications_;
        $timeout = _$timeout_;
    }));

    beforeEach(inject(function(profileService) {
        profileService.init({
            customer: {},
            tokeninfo: {},
            token: 'abcdef'
        });
    }));

    beforeEach(inject(function(_angularPopupBoxes_) {
        popup = {
            confirm: function() {
                return {
                    result: {
                        then: function(confirmCallbak, cancelCallback) {
                            popup.confirmCallbak = confirmCallbak;
                            popup.cancelCallback = cancelCallback;
                        }
                    }
                };
            },
        };
        _angularPopupBoxes_.confirm = popup.confirm;
    }));

    beforeEach(function() {
        if (angular.isUndefined(MasterMind)) {
            inject(function(_MasterMind_) {
                MasterMind = _MasterMind_;
            });
        }
        masterMind = new MasterMind();

        libraryMock = {
            actions: {
                item: [
                    { id: 10, caption: '#awesome'}
                ],
                items: function() {
                    // 30 items
                    var items = [];
                    for (var i = 0; i <= 30; i++) {
                        items.push({ id: i, caption: '#awesome'});
                    }
                    return items;
                }
            }
        };
        modalMock = {
            actions: {
                isOpen: function() { return true; },
                next: function() {},
                close: function() {},
                setTitle: function() {},
                navigation: function() {},
                open: function() {}
            },
            callbacks: {
                afterMove: function() {}
            }
        };
        filtersMock = {
            actions: {
                fill: function() {}
            },
            callbacks: {
                afterClearAll: function() {}
            }
        };
        masterMind.setModules({
            library: libraryMock,
            modal: modalMock,
            filters: filtersMock
        });
    });

    afterEach(function() {
        $rootScope.$apply(); // give time to promises be resolved
    });

    it('should have a default scope', function() {
        expect(masterMind.scope.bulkSelected).toEqual(false);
        expect(masterMind.scope.isLoading).toEqual(false);
        expect(masterMind.scope.entitiesList).toEqual([]);
    });

    it('should create a reject action with default extras', function() {
        // _WHEN_
        var actionReject = masterMind.actions.reject({});
        // _THEN_
        expect(actionReject.title).toEqual('Reject');
        expect(actionReject.iconClass).toEqual('bin');
        expect(angular.isFunction(actionReject.callback)).toBeTruthy();
    });

    it('should create a reject action with merged extras', function() {
        // _WHEN_
        var extras = {
            title: 'title',
            icon: 'icon'
        };
        var actionReject = masterMind.actions.reject({}, extras);
        // _THEN_
        expect(actionReject.title).toEqual(extras.title);
        expect(actionReject.iconClass).toEqual(extras.icon);
        expect(angular.isFunction(actionReject.callback)).toBeTruthy();
    });

    it('should create an approve action with default extras', function() {
        // _WHEN_
        var actionApprove = masterMind.actions.approve({});
        // _THEN_
        expect(actionApprove.title).toEqual('Approve');
        expect(actionApprove.iconClass).toEqual('check');
        expect(angular.isFunction(actionApprove.callback)).toBeTruthy();
    });

    it('should create an approve action with merged extras', function() {
        // _WHEN_
        var extras = {
            title: 'title',
            icon: 'icon'
        };
        var actionApprove = masterMind.actions.approve({}, extras);
        // _THEN_
        expect(actionApprove.title).toEqual(extras.title);
        expect(actionApprove.iconClass).toEqual(extras.icon);
        expect(angular.isFunction(actionApprove.callback)).toBeTruthy();
    });

    it('should create a spam action with default extras', function() {
        // _WHEN_
        var actionSpam = masterMind.actions.spam({});
        // _THEN_
        expect(actionSpam.title).toEqual('Flag as spam');
        expect(actionSpam.iconClass).toEqual('block');
        expect(angular.isFunction(actionSpam.callback)).toBeTruthy();
    });

    it('should create a spam action with merged extras', function() {
        // _WHEN_
        var extras = {
            title: 'title',
            icon: 'icon'
        };
        var actionSpam = masterMind.actions.spam({}, extras);
        // _THEN_
        expect(actionSpam.title).toEqual(extras.title);
        expect(actionSpam.iconClass).toEqual(extras.icon);
        expect(angular.isFunction(actionSpam.callback)).toBeTruthy();
    });

    it('should create a backToMq action with default extras', function() {
        // _WHEN_
        var actionBackToMq = masterMind.actions.backToMq({});
        // _THEN_
        expect(actionBackToMq.title).toEqual('Send to moderation queue');
        expect(actionBackToMq.iconClass).toEqual('arrow_left');
        expect(angular.isFunction(actionBackToMq.callback)).toBeTruthy();
    });

    it('should create a backToMq action with merged extras', function() {
        // _WHEN_
        var extras = {
            title: 'title',
            icon: 'icon'
        };
        var actionBackToMq = masterMind.actions.backToMq({}, extras);
        // _THEN_
        expect(actionBackToMq.title).toEqual(extras.title);
        expect(actionBackToMq.iconClass).toEqual(extras.icon);
        expect(angular.isFunction(actionBackToMq.callback)).toBeTruthy();
    });

    it('should create a blacklist action with default extras', function() {
        // _WHEN_
        var actionBlacklist = masterMind.actions.blacklist({});
        // _THEN_
        expect(actionBlacklist.title).toEqual('Blacklist user');
        expect(actionBlacklist.iconClass).toEqual('blacklist');
        expect(angular.isFunction(actionBlacklist.callback)).toBeTruthy();
    });

    it('should create a blacklist action with merged extras', function() {
        // _WHEN_
        var extras = {
            title: 'title',
            iconClass: 'icon'
        };
        var actionBlacklist = masterMind.actions.blacklist({}, extras);
        // _THEN_
        expect(actionBlacklist.title).toEqual(extras.title);
        expect(actionBlacklist.iconClass).toEqual(extras.iconClass);
        expect(angular.isFunction(actionBlacklist.callback)).toBeTruthy();
    });

    it('should create a sfl action with default extras', function() {
        // _WHEN_
        var actionSfl = masterMind.actions.sfl({});
        // _THEN_
        expect(actionSfl.title).toEqual('Save for Later');
        expect(actionSfl.iconClass).toEqual('time');
        expect(angular.isFunction(actionSfl.callback)).toBeTruthy();
    });

    it('should create a sfl action with merged extras', function() {
        // _WHEN_
        var extras = {
            title: 'title',
            icon: 'icon'
        };
        var actionSfl = masterMind.actions.sfl({}, extras);
        // _THEN_
        expect(actionSfl.title).toEqual(extras.title);
        expect(actionSfl.iconClass).toEqual(extras.icon);
        expect(angular.isFunction(actionSfl.callback)).toBeTruthy();
    });

    it('should create a reject action that fires backend and thenCallback chained each other', function() {
        // _GIVEN_
        var action;
        var actionConstructor = {
            backend: function() {},
            thenCallback: function() {}
        };
        spyOn(actionConstructor, 'backend').and.returnValue($q.when([{state: 'fulfulled'}]));
        spyOn(actionConstructor, 'thenCallback').and.returnValue();
        spyOn(libraryMock.actions.item, 'pop').and.returnValue({id: 10});
        spyOn(modalMock.actions, 'close').and.returnValue();
        spyOn(modalMock.actions, 'next').and.returnValue();
        action = masterMind.actions.reject(actionConstructor);

        // _WHEN_
        action.callback({id: 10}); // executes the action: rejects a media with id: 10
        popup.confirmCallbak(); // simulates user click on "confirm"
        $rootScope.$digest(); // gives "time" to js for acknowledge about resolved promises

        // _THEN_
        // title, icon and callback should be OK
        expect(action.title).toEqual('Reject');
        expect(action.iconClass).toEqual('bin');
        expect(angular.isFunction(action.callback)).toEqual(true);
        // the backend method should be called

        expect(actionConstructor.backend).toHaveBeenCalled();
        // the then-callback should be also called after backend promise is resolved
        expect(actionConstructor.thenCallback).toHaveBeenCalled();
        // the media should be poped out from the library items
        expect(libraryMock.actions.item.pop).toHaveBeenCalled();
        // the modal should be moved to next photo (because it's single action)
        expect(modalMock.actions.next).toHaveBeenCalled();
        // the modal shouldn't be closed
        expect(modalMock.actions.close.calls.count()).toEqual(0);
    });

    // TODO actions: sfl, blacklist, backToMq, spam, approve

    // TODO setModules

    it('should give streams for tagging for a single media', function() {
        var media = {
            streams: [{id: 123}]
        };
        expect(masterMind.getStreamsForTagging(media)).toEqual(media.streams);
        expect(masterMind.getStreamsForTagging([media])).toEqual(media.streams);
    });

    it('should give streams for tagging for a batch of media', function() {
        var media = [
            {streams: [{id: 5}, {id: 123}]},
            {streams: [{id: 456}, {id: 5}]}
        ];
        expect(masterMind.getStreamsForTagging(media)).toEqual([{id: 5}]);
    });

    it('should open the modal', function() {
        //_GIVEN_
        var options = {};
        spyOn(modalMock.actions, 'open').and.returnValue(true);
        spyOn(modalMock.actions, 'navigation').and.returnValue(true);

        // _WHEN_
        masterMind.openModal(libraryMock.actions.item[0], options);

        // _THEN_
        expect(modalMock.actions.open).toHaveBeenCalledWith(libraryMock.actions.item[0], options);
        expect(modalMock.actions.navigation).toHaveBeenCalledWith(libraryMock.actions.items());
    });

    // TODO getRepository

    // TODO refreshFiltersOnBackground

    // TODO getFilterService

    // TODO getBoxService

    // TODO getLibraryService

    // TODO getTaggingService

    // TODO getShareService

    // TODO improve this test
    it('should return a valid instance of modalService with two actions', function() {
        //_GIVEN_
        var testScope = $rootScope.$new(true);
        var modalScope = $rootScope.$new(true);

        // _WHEN_
        testScope.modal = masterMind.getModalService(modalScope, ['tagging'], {zoom: false});
        // _THEN_
        expect(testScope.modal.title).toBe('Media');
        expect(testScope.modal.templatePath).toBe('rome/modal/');
        expect(testScope.modal.extras.length).toBe(2);
    });

    // TODO improve this test
    it('should return the same query', function() {
        //_GIVEN_
        var query = {q:'olapic'};

        // _WHEN_
        var q = masterMind.queryAdapter(query);

        // _THEN_
        expect(query).toBe(q);
    });

    // TODO loadContent

    it('should select 20 items as maximum in bulk', function() {
        // _GIVEN_
        expect(masterMind.scope.bulkSelected).toBe(false);

        // _WHEN_
        masterMind.bulkSelection();

        // _THEN_
        // all-selected flag must be true
        expect(masterMind.scope.bulkSelected).toBe(true);
        // there must be 20 item checked
        expect(masterMind.scope.entitiesList.length).toBe(20);

    });

    // TODO test getModalService and bulkSelection() with a
    // selected item

    it('should select a page of items as maximum in bulk', function() {
        // _GIVEN_
        var totalChecked = 0;
        masterMind.repositoryQuery = {
            size: 4
        };
        expect(masterMind.scope.bulkSelected).toBe(false);

        // _WHEN_
        masterMind.bulkSelection();

        // _THEN_
        // all-selected flag must be true
        expect(masterMind.scope.bulkSelected).toBe(true);
        // there not must be some item unchecked
        masterMind.scope.entitiesList.some(function(item) {
            totalChecked += (item.checked ? 1 : 0);
            return !item.checked;
        });
        expect(totalChecked).toBe(4);

    });

    it('should deselect all in bulk', function() {
        // _GIVEN_
        var totalChecked = 0;
        masterMind.bulkSelection();
        expect(masterMind.scope.bulkSelected).toBe(true);

        // _WHEN_
        masterMind.bulkSelection();

        // _THEN_
        // all-selected flag must be false
        expect(masterMind.scope.bulkSelected).toBe(false);
        // there not must be some item checked
        masterMind.scope.entitiesList.some(function(item) {
            totalChecked += (item.checked ? 1 : 0);
            return !item.checked;
        });
        expect(totalChecked).toBe(0);

    });
});
