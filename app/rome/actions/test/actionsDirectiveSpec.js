describe("The actions directive:", function () {
    var $compile,
        $rootScope,
        element;

    beforeEach(module('op.actions'));
    beforeEach(module('templates'));

    var compile = function(data) {
        element = $compile('<op-actions actions="'+data.actionsString+'" '+(data.type ? 'type="'+data.type+'"' : '')+' '+(data.extras ? data.extras : '')+' entity="{}" list-limit="3"></op-actions>')($rootScope);
        $rootScope.$digest();
    };

    beforeEach(inject(function(_$compile_, _$rootScope_, actionService){
        $compile = _$compile_;
        $rootScope = _$rootScope_;

        $rootScope.actions = [
            actionService({
                title : 'Action 1',
                iconClass : 'check',
                callback: function(){
                    console.log('custom Callback 1');
                }
            }),
            actionService({
                title : 'Action 2',
                iconClass : 'close',
                callback: function(){
                    console.log('custom Callback 2');
                }
            }),
            actionService({
                title : 'Action 3',
                iconClass : 'close',
                callback: function(){
                    console.log('custom Callback 3');
                }
            })
        ];

        $rootScope.actionsList = [
            actionService({
                title : 'Action 1',
                iconClass : 'check',
                callback: function(){
                    console.log('custom Callback 1');
                }
            }),
            actionService({
                title : 'Action 2',
                iconClass : 'close',
                callback: function(){
                    console.log('custom Callback 2');
                }
            }),
            actionService({
                title : 'Action 3',
                iconClass : 'close',
                callback: function(){
                    console.log('custom Callback 3');
                }
            }),
            actionService({
                title : 'Action 1',
                iconClass : 'check',
                callback: function(){
                    console.log('custom Callback 1');
                }
            }),
            actionService({
                title : 'Action 2',
                iconClass : 'close',
                callback: function(){
                    console.log('custom Callback 2');
                }
            }),
            actionService({
                title : 'Action 3',
                iconClass : 'close',
                callback: function(){
                    console.log('custom Callback 3');
                }
            })
        ];

        $rootScope.actionsBtn = [
            actionService({
                title : 'BTN Action 1',
                iconClass : 'btn btn-default',
                callback: function(){
                    console.log('custom Callback 1');
                }
            }),
            actionService({
                title : 'BTN Action 2',
                iconClass : 'btn btn-info',
                callback: function(){
                    console.log('custom Callback 2');
                }
            })
        ];

    }));

    it('replaces the element with a select', function() {
        compile({
            actionsString: 'actions',
            type: 'select'
        });

        expect(element.html()).not.toBe(undefined);
        expect(element.find('select').length).toBe(1);
        expect(element.find('option:first').text()).toBe('Select an Action');
        expect(element.find('option').get(1).text).toBe('Action 1');
        expect(element.find('option').get(2).text).toBe('Action 2');
    });

    it('replaces the element with two radios', function() {
        compile({
            actionsString: 'actions',
            type: 'radio',
            extras: 'name="aRadio"'
        });

        expect(element.html()).not.toBe(undefined);
        expect(element.find('input[type=radio]').length).toBe(3);
        expect(element.find('label').length).toBe(3);
        expect(element.find('label').get(0).textContent).toContain('Action 1');
        expect(element.find('label').get(1).textContent).toContain('Action 2');
        expect(element.find('input[type=radio]').get(0).name).toBe('aRadio');
        expect(element.find('input[type=radio]').get(1).name).toBe('aRadio');
    });

    it('replaces the element with an actionList', function() {
        compile({
            actionsString: 'actionsList',
        });
        expect(element.html()).not.toBe(undefined);
        expect(element.find('ul').length).toBe(2);
        expect(element.find('ul > li').length).toBe(7);
        expect(element.find('ul.dropdown-menu').length).toBe(1);
        expect(element.find('ul.dropdown-menu > li').length).toBe(4);
        expect(element.find(element.find('li i').get(0)).attr('class')).toBe('icon-check');
        expect(element.find(element.find('li i').get(1)).attr('class')).toBe('icon-close');
        expect(element.find(element.find('li i').get(2)).attr('class')).toBe('icon-more');

        expect(element.find(element.find('ul.dropdown-menu li i').get(1)).attr('class')).toBe('icon-check');
    });

    it('replaces the element with two checkboxes', function() {
        compile({
            actionsString: 'actions',
            type: 'checkbox',
            extras: 'name="aCheckbox"'
        });
        expect(element.html()).not.toBe(undefined);
        expect(element.find('input[type=checkbox]').length).toBe(3);
        expect(element.find('label').length).toBe(3);
        expect(element.find('label').get(0).textContent).toContain('Action 1');
        expect(element.find('label').get(1).textContent).toContain('Action 2');
        expect(element.find('label').get(2).textContent).toContain('Action 3');
        expect(element.find('input[type=checkbox]').get(0).name).toBe('aCheckbox');
        expect(element.find('input[type=checkbox]').get(1).name).toBe('aCheckbox');
        expect(element.find('input[type=checkbox]').get(2).name).toBe('aCheckbox');
    });

    it('replaces the element with two buttons', function() {
        compile({
            actionsString: 'actionsBtn',
            type: 'button',
            extras: 'name="aCheckbox"'
        });
        expect(element.html()).not.toBe(undefined);
        expect(element.find('button').length).toBe(2);
        expect(element.find(element.find('button').get(0)).text()).toContain('Action 1');
        expect(element.find(element.find('button').get(1)).text()).toContain('Action 2');

        expect(element.find(element.find('button').get(0)).attr('class')).toContain('btn btn-default');
        expect(element.find(element.find('button').get(1)).attr('class')).toContain('btn btn-info');
    });
});
