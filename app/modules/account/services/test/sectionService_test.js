describe('Section Service:', function() {
    var sectionService;
    var localStorage;
    var authService;
    var sectionScopeService;
    var scopeAuthService;
    var deferredIsSessionReadyResponse;
    var rootScope;

    //Mocking Data
    var userCredentialsData = [
        {
            customer: {
                id: 111,
                name: 'Customer_name_1'
            },
            token: '12345678',
            tokeninfo: {
                client_id: '5389b088-b980-4bba-914a-d2f154e7e441',
                user_id: '6d5b1b48-e35e-4fac-a47d-b85e33cf37c3',
                customer_id: 111,
                scope: 'lemurama.premod lemurama.tagging lemurama.moderation',
                expires: 1483795616,
                expires_in: 86400
            },
            access_token: '248f3043ad3b8c1eea27adced55733b7155a3da9'
        },
        {
            customer: {
                id: 222,
                name: 'Customer_name_2'
            },
            token: '87654321',
            tokeninfo: {
                client_id: '5389b088-b980-4bba-914a-d2f154e7e441',
                user_id: '6d5b1b48-e35e-4fac-a47d-b85e33cf37c3',
                customer_id: 222,
                scope: 'lemurama.premod lemurama.tagging lemurama.moderation',
                expires: 1483795616,
                expires_in: 86400
            },
            access_token: '248f3043ad3b8c1eea27adced55733b7155a3da9'
        }
    ];
    var userSelectedCredential = {
        customer: {
            id: 111,
            name: 'Customer_name_1'
        },
        token: '12345678',
        tokeninfo: {
            client_id: '5389b088-b980-4bba-914a-d2f154e7e441',
            user_id: '6d5b1b48-e35e-4fac-a47d-b85e33cf37c3',
            customer_id: 111,
            scope: 'lemurama.premod lemurama.tagging lemurama.moderation',
            expires: 1483795616,
            expires_in: 86400
        },
        access_token: '248f3043ad3b8c1eea27adced55733b7155a3da9'
    };
    var userSectionScopeData = [
        {
            name: 'MENU_ITEM_EXPRESS_MODERATOR',
            href: '#/expressmoderation',
            scope: 'lemurama.premod',
            implementationValue: 'expressmoderation'
        },
        {
            name: 'MENU_ITEM_TAGGING',
            href: '#/tagging',
            scope: 'lemurama.tagging',
            implementationValue: 'tagging'
        },
        {
            name: 'MENU_ITEM_MODERATION',
            href: '#/moderation',
            scope: 'lemurama.moderation',
            implementationValue: 'moderation'
        }
    ];

    beforeEach(module('ngRoute', 'account', 'ngStorage'));

    beforeEach(module(function($provide) {
        var _authService = {
            getSelectedCredential: function() {},
            isSessionReady: function() {},
            getCredentials: function() {}
        };
        var _scopeAuthService = {
            getScopesFromCredential: function() {}
        };
        var _sectionScopeService = {
            getSectionValues: function() {}
        };
        var _notifications = {
            addErrorMessage: function() {}
        };

        $provide.value('authService', _authService);
        $provide.value('scopeAuthService', _scopeAuthService);
        $provide.value('sectionScopeService', _sectionScopeService);
        $provide.value('notifications', _notifications);
    }));

    beforeEach(inject(function(
        $q,
        $rootScope,
        $localStorage,
        _authService_,
        _scopeAuthService_,
        _sectionScopeService_,
        _sectionService_
    ) {
        rootScope = $rootScope;
        localStorage = $localStorage;
        authService = _authService_;
        scopeAuthService = _scopeAuthService_;
        sectionScopeService = _sectionScopeService_;
        sectionService = _sectionService_;
        deferredIsSessionReadyResponse = $q.defer();

        spyOn(authService, 'getCredentials').and.returnValue(userCredentialsData);
        spyOn(authService, 'isSessionReady').and.returnValue(deferredIsSessionReadyResponse.promise);
        spyOn(sectionScopeService, 'getSectionValues').and.returnValue(userSectionScopeData);

        //Reset localStorage items in every it
        localStorage.$reset();
    }));

    it('should set the current section in the localStorage', function() {
        //Given
        spyOn(authService, 'getSelectedCredential').and.returnValue(userSelectedCredential);
        //When
        sectionService.in('tagging');
        deferredIsSessionReadyResponse.resolve();
        rootScope.$digest();

        //Then
        expect(authService.isSessionReady).toHaveBeenCalled();
        expect(authService.getSelectedCredential).toHaveBeenCalled();
        expect(localStorage.lastSection_111).toEqual('tagging');
        expect(sectionService.current()).toEqual('tagging');
    });

    it('should not set the current section if the credentials are incorrect', function() {
        //Given
        spyOn(authService, 'getSelectedCredential').and.returnValue(undefined);

        //When
        sectionService.in('tagging');
        deferredIsSessionReadyResponse.resolve();
        rootScope.$digest();

        //Then
        expect(authService.isSessionReady).toHaveBeenCalled();
        expect(authService.getSelectedCredential).toHaveBeenCalled();
        expect(localStorage.lastSection_111).toEqual(undefined);
        expect(sectionService.current()).toEqual(null);
    });

    it('should get the correct name when the user is in expressmoderation section', function() {
        //Given
        spyOn(authService, 'getSelectedCredential').and.returnValue(userSelectedCredential);
        sectionService.in('expressmoderation');
        deferredIsSessionReadyResponse.resolve();
        rootScope.$digest();

        //When
        var sectionName = sectionService.getName();

        //Then
        expect(sectionName).toEqual('premod');
    });

    it('should get the correct name when the user is not in expressmoderation section', function() {
        //Given
        spyOn(authService, 'getSelectedCredential').and.returnValue(userSelectedCredential);
        sectionService.in('moderation');
        deferredIsSessionReadyResponse.resolve();
        rootScope.$digest();

        //When
        var sectionName = sectionService.getName();

        //Then
        expect(sectionName).toEqual('moderation');
    });

    it('should get the last section saved in the localStorage', function() {
        //Given
        spyOn(authService, 'getSelectedCredential').and.returnValue(userSelectedCredential);
        sectionService.in('tagging');
        deferredIsSessionReadyResponse.resolve();
        rootScope.$digest();

        //When
        var lastSection = sectionService.last();

        //Then
        expect(lastSection).toEqual('tagging');
    });

    it('should get default last section when credentials are incorrect', function() {
        //Given
        spyOn(authService, 'getSelectedCredential').and.returnValue({});
        sectionService.in('tagging');
        deferredIsSessionReadyResponse.resolve();
        rootScope.$digest();

        //When
        var lastSection = sectionService.last();

        //Then
        expect(lastSection).toEqual('/');
    });

    it('should get default last section when the localStorage is empty', function() {
        //Given
        spyOn(authService, 'getSelectedCredential').and.returnValue(userSelectedCredential);
        deferredIsSessionReadyResponse.resolve();
        rootScope.$digest();

        //When
        var lastSection = sectionService.last();

        //Then
        expect(lastSection).toEqual('/');
    });

    it('should get the lastSection Saved as validSection when all the scopes are available', function() {
        //Given
        //All userScope for this user
        spyOn(scopeAuthService, 'getScopesFromCredential').and.returnValue([
            'lemurama.premod',
            'lemurama.tagging',
            'lemurama.moderation'
        ]);

        //UserCredential
        spyOn(authService, 'getSelectedCredential').and.returnValue(userSelectedCredential);

        //Setting in store the last section
        sectionService.in('moderation');
        deferredIsSessionReadyResponse.resolve();
        rootScope.$digest();

        //When
        var validSection = sectionService.getValidSection(111);

        //Then
        expect(validSection).toEqual('moderation');
    });

    it('should get the first section available when the lastSection is undefined', function() {
        //Given
        //All userScope for this user
        spyOn(scopeAuthService, 'getScopesFromCredential').and.returnValue([
            'lemurama.premod',
            'lemurama.tagging',
            'lemurama.moderation'
        ]);

        //UserCredential
        spyOn(authService, 'getSelectedCredential').and.returnValue(userSelectedCredential);

        //When
        var validSection = sectionService.getValidSection(111);

        //Then
        expect(validSection).toEqual('expressmoderation');
    });

    it('should get the first section available when the lastSection not corresponde with the user scope', function() {
        //Given
        //All userScope for this user
        spyOn(scopeAuthService, 'getScopesFromCredential').and.returnValue([
            'lemurama.premod',
            'lemurama.tagging'
        ]);
        //UserCredential
        spyOn(authService, 'getSelectedCredential').and.returnValue(userSelectedCredential);

        //Setting in store the last section
        sectionService.in('moderation');
        deferredIsSessionReadyResponse.resolve();
        rootScope.$digest();

        //When
        var validSection = sectionService.getValidSection(111);

        //Then
        expect(validSection).toEqual('expressmoderation');
    });

    it('should return undefined if the user does not have scope', function() {
        //Given
        //All userScope for this user
        spyOn(scopeAuthService, 'getScopesFromCredential').and.returnValue([]);
        //UserCredential
        spyOn(authService, 'getSelectedCredential').and.returnValue(userSelectedCredential);

        //Setting in store the last section
        sectionService.in('moderation');
        deferredIsSessionReadyResponse.resolve();
        rootScope.$digest();

        //When
        var validSection = sectionService.getValidSection(111);

        //Then
        expect(validSection).toEqual(undefined);
    });
});
