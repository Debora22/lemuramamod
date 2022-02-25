describe("the actions service:", function () {

    var Action,
        mockAction;

    beforeEach(module('op.actions'));

    beforeEach(inject(function(actionService) {
        Action = actionService;
    }));

    it("should return the default settings", function () {
        var testAction = new Action();
        mockAction = {title: '', iconClass: '', callback: function(){}};
        expect(testAction.title).toEqual(mockAction.title);
        expect(testAction.iconClass).toEqual(mockAction.iconClass);
        expect(angular.isFunction(testAction.callback)).toEqual(angular.isFunction(mockAction.callback));
    });

    it("should return the merged settings", function () {
        var mockAction = {
                title: 'an Action',
                iconClass: 'check',
                callback: function(){ console.log('a callback') ;}
            },
            testAction = new Action(mockAction);

        expect(testAction.title).toEqual(mockAction.title);
        expect(testAction.iconClass).toEqual(mockAction.iconClass);
        expect(angular.isFunction(testAction.callback)).toEqual(angular.isFunction(mockAction.callback));
    });

});
