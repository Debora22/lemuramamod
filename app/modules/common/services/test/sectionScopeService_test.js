describe('Section Scope Service:', function() {
    var sectionScopeService;
    var AUTH_SCOPES;

    beforeEach(module('common'));

    beforeEach(module(function($provide) {
        $provide.factory('AUTH_SCOPES', function() {
            return {
                public: 'public',
                curation: 'curation',
                moderation: 'lemurama.moderation',
                tagging: 'lemurama.tagging',
                qa: 'lemurama.qa',
                premod: 'lemurama.premod',
                rights: 'lemurama.rm',
                medialibrary: 'admin.medialibrary'
            };
        });
    }));

    beforeEach(inject(function(
        _AUTH_SCOPES_,
        _sectionScopeService_
    ) {
        sectionScopeService = _sectionScopeService_;
        AUTH_SCOPES = _AUTH_SCOPES_;
    }));

    it('should return section scope data', function() {
        //Given

        //When
        var sectionScopeData = sectionScopeService.getSectionValues();

        //Then
        expect(sectionScopeData).toEqual([{
            name: 'MENU_ITEM_EXPRESS_MODERATOR',
            href: '#/expressmoderation',
            scope: AUTH_SCOPES.premod,
            implementationValue: 'expressmoderation'
        },
        {
            name: 'MENU_ITEM_TAGGING',
            href: '#/tagging',
            scope: AUTH_SCOPES.tagging,
            implementationValue: 'tagging'
        },
        {
            name: 'MENU_ITEM_MODERATION',
            href: '#/moderation',
            scope: AUTH_SCOPES.moderation,
            implementationValue: 'moderation'
        },
        {
            name: 'MENU_ITEM_QA',
            href: '#/qa',
            scope: AUTH_SCOPES.qa,
            implementationValue: 'qa'
        }]);
    });
});
