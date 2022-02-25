'use strict';

describe('The scopeAuthService: ', function() {

    beforeEach(module('ngStorage'));

    beforeEach(module('op.auth'));

    beforeEach(module('op.api'));

    var scope,
        scopeService,
        authScopes;

    beforeEach(inject(function($rootScope, $sessionStorage, scopeAuthService, AUTH_SCOPES) {
        scope = $rootScope.$new();
        scopeService = scopeAuthService;
        authScopes = AUTH_SCOPES;
    }));

    it('should get all scopes from a given credential', function() {
        var role = scopeService.getScopesFromCredential(dummyResponse.credentials[0]);
        expect(role).toEqual([authScopes.curation]);
    });

    it('should authorize correctly a moderator role for a valid customer', function() {
        var credentials = dummyResponse.credentials[0];
        var token = scopeService.validate(credentials, authScopes.curation);
        expect(token).toBe('326cef9c53ea151fe0a4175f32a81a736b425309');
    });

    it('should not authorize a public scope with insufficient scopes', function() {
        var credentials = dummyResponse.credentials[0].tokeninfo;
        credentials.access_token = dummyResponse.credentials[0].token;
        var token = scopeService.validate(credentials, authScopes.public);
        expect(token).toBe('');
    });

    var dummyResponse = {
        account: {
            name: 'Test User',
            email: 'test@olapic.com',
            mobile_legacy: true
        },
        credentials: [
        {
            customer: {
                id: 1,
                name: 'The Amazing Online Store'
            },
            access_token: '326cef9c53ea151fe0a4175f32a81a736b425309',
            tokeninfo: {
                client_id: '24c064ab-6691-4359-9273-830567cafb1b',
                user_id: '82442799-8b84-35c4-a359-e4a92b58f56f',
                scope: 'curation',
                expires: 1402351247,
                expires_in: 3587
            }
        }
        ]
    };

});
