describe('The Auth Service:', function() {

    beforeEach(module('op.auth'));

    beforeEach(module('op.api'));

    beforeEach(function() {
        module(function($provide) {
            $provide.constant('appConstant', {
                authServer: {
                    url: '/auth'
                }
            });
        });
    });

    var service,
        scope,
        authScopes,
        $httpBackend,
        appConstant;

    var dummyCustomer = {
        customer: {
            id: 1,
            name: 'The Amazing Online Store'
        },
        access_token: '326cef9c53ea151fe0a4175f32a81a736b425309',
        tokeninfo: {
            client_id: '24c064ab-6691-4359-9273-830567cafb1b',
            user_id: '82442799-8b84-35c4-a359-e4a92b58f56f',
            scope: 'public curation',
            expires: 1402351247,
            expires_in: 3587
        }
    };

    var dummyResponse = {
        account: {
            name: 'Test User',
            email: 'test@olapic.com'
        },
        credentials: [dummyCustomer]
    };

    beforeEach(inject(function($injector, $rootScope, authService, AUTH_SCOPES) {
        scope = $rootScope.$new();
        $httpBackend = $injector.get('$httpBackend');
        appConstant = $injector.get('appConstant');
        service = authService;
        authScopes = AUTH_SCOPES;
    }));

    it('should authenticate correctly a valid user', function() {
        $httpBackend.when('GET', '/auth/api/tokeninfo').respond(401, {});
        $httpBackend.when('GET', '/auth/customer').respond(401, {});
        $httpBackend.flush();
        $httpBackend.when('POST').respond(200, dummyResponse);
        expect(service.isAuthenticated()).toBe(undefined);
        service.login('test@olapic.com', 'password')
            .then(function() {
                expect(service.isAuthenticated()).toBe('Test User');
            });
        $httpBackend.flush();
    });

    it('should load the session from middleware correctly', function() {
        $httpBackend.when('GET', '/auth/api/tokeninfo').respond(dummyResponse);
        $httpBackend.when('GET', '/auth/customer').respond(dummyCustomer);
        $httpBackend.flush();
        expect(service.isAuthenticated()).toBe('Test User');
    });

    it('should logout the active session correctly', function() {
        $httpBackend.when('GET', '/auth/api/tokeninfo').respond(401, {});
        $httpBackend.when('GET', '/auth/customer').respond(401, {});
        $httpBackend.flush();
        $httpBackend.when('POST').respond(200, dummyResponse);
        expect(service.isAuthenticated()).toBe(undefined);
        service.login('test@olapic.com', 'password').then(function() {
            expect(service.isAuthenticated()).toBe('Test User');
            service.logout();
            expect(service.isAuthenticated()).toBe(undefined);
        });
        $httpBackend.flush();
    });

    it('should not authenticate an invalid user', function() {
        $httpBackend.when('GET', '/auth/api/tokeninfo').respond(401, {});
        $httpBackend.when('GET', '/auth/customer').respond(401, {});
        $httpBackend.flush();
        $httpBackend.when('POST').respond(401);
        expect(service.isAuthenticated()).toBe(undefined);
        service.login('invalid@user.com', 'nocare').then(function() {
            expect(true).toBe(false);
        }, function(error) {
            expect(error).toBe('Hmm, wrong email or password. Try again!');
            expect(service.isAuthenticated()).toBe(undefined);
        });
        $httpBackend.flush();
    });

    it('should manage and respond correctly under a server error response', function() {
        $httpBackend.when('GET', '/auth/api/tokeninfo').respond(401, {});
        $httpBackend.when('GET', '/auth/customer').respond(401, {});
        $httpBackend.flush();
        $httpBackend.when('POST').respond(500);
        expect(service.isAuthenticated()).toBe(undefined);
        service.login('invalid@user.com', 'nocare').then(function() {
            expect(true).toBe(false);
        }, function(error) {
            expect(error).toBe('Invalid or corrupted response from the server. Try again!');
            expect(service.isAuthenticated()).toBe(undefined);
        });
        $httpBackend.flush();
    });

    it('should not authorize an user if the user is not authenticated', function() {
        expect(service.isAuthenticated()).toBe(undefined);
        expect(service.isAuthorized(authScopes.curation)).toBe('');
    });

    it('should return the logged in account information', function() {
        $httpBackend.when('GET', '/auth/api/tokeninfo').respond(401, {});
        $httpBackend.when('GET', '/auth/customer').respond(401, {});
        $httpBackend.flush();
        $httpBackend.when('POST').respond(200, dummyResponse);
        service.login('test@olapic.com', 'password').then(function() {
            expect(service.getAccount()).toEqual({
                name: 'Test User',
                email: 'test@olapic.com'
            });
        });
        $httpBackend.flush();
    });

    it('should return an empty list of authorized scopes if the user is not logged in', function() {
        $httpBackend.when('GET', '/auth/api/tokeninfo').respond(401, {});
        $httpBackend.when('GET', '/auth/customer').respond(401, {});
        $httpBackend.flush();
        $httpBackend.when('POST').respond(401);
        service.login('test@olapic.com', 'password').then(function() {
            expect(false).toBe(true);
        }, function() {
            expect(service.getScopes()).toEqual([]);
        });
        $httpBackend.flush();
    });
});
