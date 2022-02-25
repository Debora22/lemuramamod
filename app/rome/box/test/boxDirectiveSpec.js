describe("the box directive:", function () {
    var $compile,
        $rootScope,
        filter,
        element,
        entity_demo,
        box_demo,
        Box,
        entity_video,
        box_demo_callbacks;

    beforeEach(module('op.box'));
    beforeEach(module('templates'));

    var compile = function(entity, box) {
        $rootScope.box = box;
        $rootScope.entity = entity;
        element = $compile("<op-box box='box'></op-box>")($rootScope);
        $rootScope.$digest();
    };

    beforeEach(inject(function(_$compile_, _$rootScope_, boxService, $templateCache, $filter){
        Box = boxService;
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        filter = $filter;

        // entity mock
        entity_demo = {
            id: 19571957,
            source: {
                name: 'instagram',
                data: {
                    url: 'https://instagram.com/jhongalt/'
                }
            },
            user: {
                username: 'jhongalt'
            },
            images: {
                mobile: 'mobile.jpg'
            },
            date_submitted: '2013-02-21T01:32:07+0000',
            sonar_place: {
                name: "New York"
            },
            caption: 'Who is Jhon Galt?'
        };

        // entity mock
        entity_video = {
            id: 19571957,
            source: {
                name: 'instagram'
            },
            user: {
                username: 'jhongalt'
            },
            images: {
                mobile: 'mobile.jpg'
            },
            date_submitted: '2013-02-21T01:32:07+0000',
            sonar_place: {
                name: "New York"
            },
            caption: 'Who is Jhon Galt?',
            media_video: {
                url: 'video.mp4'
            },
            video_url: 'video.mp4'
        };

        box_demo = new Box({
            type: 'media'
        });

        box_demo_callbacks = new Box({
            type: 'media',
            callbacks: {
                afterRender: function(){}
            }
        });

        spyOn(box_demo_callbacks.callbacks, 'afterRender');

    }));

    it('should replace the element with the appropriate content', function() {
        compile(entity_demo, box_demo);
        expect(element.html()).not.toBe(undefined);
    });

    it('should append the entity id', function() {
        compile(entity_demo, box_demo);
        expect(element.find('#box-'+entity_demo.id).length).toBe(1);
    });

    it('should append the source name to the icon source', function() {
        compile(entity_demo, box_demo);
        expect(element.find('.box-user i').hasClass('icon-'+entity_demo.source.name)).toBe(true);
    });

    it('should append he user name to the link', function() {
        compile(entity_demo, box_demo);
        expect(element.find('.box-user a').text().trim()).toBe('@'+entity_demo.user.username);
    });

    it('should append the image to the background', function() {
        compile(entity_demo, box_demo);
        expect(element.find('.box-media').css('background-image')).toContain(entity_demo.images.mobile);
    });

    it('should append the date to the content and check that the format is the correct', function() {
        compile(entity_demo, box_demo);
        expect(element.find('.box-content ul li:first-child').text()).toBe(' '+filter('date')(entity_demo.date_submitted, 'MM/dd/yyyy'));
    });

    it('should append the sonar place to the content', function() {
        compile(entity_demo, box_demo);
        expect(element.find('.box-content ul li:last-child').text()).toBe(' '+entity_demo.sonar_place.name);
    });

    it('should append he caption to the content', function() {
        compile(entity_demo, box_demo);
        expect(element.find('.box-content p').text()).toBe(entity_demo.caption);
    });

    it('should append the icon video if the field media_video exists', function() {
        compile(entity_video, box_demo);
        expect(element.find('.box-media i').hasClass('icon-play')).toBe(true);
    });

    it('should return the entity in the afterRender callback', function() {
        var spyStart = box_demo_callbacks.callbacks.afterRender;
        expect(spyStart).not.toHaveBeenCalled();
        compile(entity_video, box_demo_callbacks);
        expect(spyStart).toHaveBeenCalled();
    });

});
