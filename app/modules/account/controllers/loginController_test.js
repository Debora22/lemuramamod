describe('The Login Controller: ', function() {

    var $scope, controller, $location, authEvents, rootScope, $httpBackend, appConstant;

    var customer = {
        customer: {
            id: 1
        },
        token: 'ca8d9ffa4653e45164982670c3110ab8f2e015ca',
        tokeninfo: {
            scopes: 'public'
        }
    };

    var tokenInfo = {
        account: {
            name: 'pepe',
            email: 'pepe@olapic.com'
        },
        credential: [customer]
    };

    beforeEach(module('ngRoute', 'op.loading', 'appConfig', 'op.auth', 'op.api', 'account'));

    beforeEach(module(function($provide) {
        $provide.factory('notifications', function() {
            return {
                addErrorMessage: function() {}
            };
        });
    }));

    beforeEach(inject(function($injector, $rootScope, $controller, _$location_, AUTH_EVENTS) {
        $httpBackend = $injector.get('$httpBackend');
        $location = _$location_;
        $scope = $rootScope.$new();
        rootScope = $injector.get('$rootScope');
        controller = $controller('loginController', { $scope: $scope });
        authEvents = AUTH_EVENTS;
        appConstant = $injector.get('appConstant');
    }));

    it('should show to the user an error message when invalid credential', function() {
        $httpBackend.when('GET', '/auth/api/tokeninfo').respond(tokenInfo);
        $httpBackend.when('GET', '/auth/customer').respond(customer);
        $httpBackend.when('POST', '/auth/api/login/').respond(401);
        $scope.dataLogin = {
            email: 'test@demo.com',
            password: 'crazy_world'
        };
        $scope.login($scope.dataLogin);
        $httpBackend.flush();
        expect($scope.error).toBe(true);
    });
});
