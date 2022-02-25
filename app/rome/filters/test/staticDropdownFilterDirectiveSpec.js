describe('the dropdown filter directive:', function() {
    var $compile;
    var $rootScope;
    var $timeout;
    var element;
    var filtersSortingService;
    var items;
    var Service;
    var q = {
        q: '',
        size: 10,
        filter: [{'media_status.id': 40}],
        sort: 'ctr'
    };

    beforeEach(module('op.filters'));
    beforeEach(module('templates'));

    var compile = function(filterService) {
        $rootScope.filtersSortingService = filterService;
        element = $compile('<op-static-dropdown-filter settings="filtersSortingService">' +
            '</op-static-dropdown-filter>')($rootScope);
        $rootScope.$digest();
        $timeout.flush();
    };

    beforeEach(inject(function(_$compile_, _$rootScope_, _$timeout_, StaticFiltersService) {
        $compile = _$compile_;
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;
        Service = StaticFiltersService;

        items = [
            {title: 'Click Through Rate', value: 'ctr'},
            {title: 'Photorank', value: 'photorank'},
            {title: 'Oldest', value: 'oldest'},
            {title: 'Newest', value: 'newest'}
        ];

        filtersSortingService = new StaticFiltersService({
            templatePath: '',
            position: 4,
            label: 'Order',
            data: items,
            initialValue: items[1],
            callbacks: {
                onChange: function() {}
            }
        });

        compile(filtersSortingService);
    }));

    it('should replace the element with the appropriate content', function() {
        expect(element.html()).not.toBe(undefined);
        expect(element.find('p').length).toBe(1);
        expect(element.find('p').text()).toEqual('Order');
        expect(element.find('.dropdown').length).toBe(1);
        expect(element.find('.dropdown-menu').length).toBe(1);
        expect(element.find('.dropdown-menu li').length).toBe(4);
    });

    it('should fire onChange callback when item it\'s clicked', function() {
        expect(filtersSortingService.actions.getSelectedItem()).toBe(items[1]);
        spyOn(filtersSortingService.callbacks, 'onChange');
        angular.element(element.find('.dropdown-menu li a').get(2)).click();
        expect(filtersSortingService.callbacks.onChange).toHaveBeenCalledWith(items[2]);
        expect(filtersSortingService.actions.getSelectedItem()).toBe(items[2]);
    });

    it('should call the clear actions when it is called', function() {
        angular.element(element.find('.dropdown-menu li a').get(1)).click();
        spyOn(filtersSortingService.callbacks, 'onChange');
        filtersSortingService.actions.clear(); // clear to default value
        expect(filtersSortingService.callbacks.onChange).toHaveBeenCalledWith(items[0]);
        filtersSortingService.actions.clear(2); // clear to specifi value
        expect(filtersSortingService.callbacks.onChange).toHaveBeenCalledWith(items[2]);
    });

    it('should update the filters if there is a previous value', function() {
        expect(q.filter[0]['media_status.id']).toBe(40);
        filtersSortingService.actions.addFilter(q, 'media_status.id', 25);
        expect(q.filter[0]['media_status.id']).toBe(25);
    });

    it('should add the filters if it doesn\'t exist', function() {
        q.filter = [];
        filtersSortingService.actions.addFilter(q, 'media_status.id', 24);
        expect(q.filter[0]['media_status.id']).toBe(24);
    });

    it('should place dropdown to the corresponding initialValue if it\'s pressent', function() {
        expect(element.find('button > span:first-child').text()).toBe('Photorank');
    });

    it('should not fire onChange callback when the item is clicked if filter is disabled', function() {
        spyOn(filtersSortingService.callbacks, 'onChange');
        filtersSortingService.actions.setDisabled(true);
        angular.element(element.find('.dropdown-menu li a').get(1)).click();
        expect(filtersSortingService.callbacks.onChange).not.toHaveBeenCalled();
    });
});
