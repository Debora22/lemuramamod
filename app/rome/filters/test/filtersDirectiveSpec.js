describe("the filter directive:", function () {
    var $compile,
        $rootScope,
        element,
        filters_demo,
        Filters,
        timeout,
        filters_date;

    // default search
    var newSearch,
        q = {
            q: 'olapic'
        };

    beforeEach(module('op.filters'));
    beforeEach(module('templates'));

    var compile = function(filter) {
        $rootScope.filters = filter;
        element = $compile('<op-filters settings="filters"></op-filters>')($rootScope);
        $rootScope.$digest();
    };

    beforeEach(inject(function(_$compile_, _$rootScope_, filtersService, $templateCache, $timeout) {
        Filters = filtersService;
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        timeout = $timeout;

        filters_demo = new Filters();
        // Instance for test date filter
        filters_date = new Filters({
            start: q,
            showDateFilter: true,
            callbacks: {
                afterSearchPress: function(search) {
                    newSearch = search;
                }
            }
        });

        compile(filters_demo);
    }));

    it('should replace the element with the appropriate content', function() {
        expect(element.html()).not.toBe(undefined);
    });

    it('shoud call the fill actions when it is called', function() {
        // Spies
        spyOn(filters_demo.actions, 'fill');

        filters_demo.actions.fill([]);
        expect(filters_demo.actions.fill).toHaveBeenCalled();
    });

    it('shoud call the clear actions when it is called', function() {
        // Spies
        spyOn(filters_demo.actions, 'clear');

        filters_demo.actions.clear();
        expect(filters_demo.actions.clear).toHaveBeenCalled();
    });

    it('shoud not show the date filter by default', function() {
        filters_date = new Filters();
        compile(filters_date);
        expect(element.find('.sidebar-calendar').length).toBe(0);
    });

});
