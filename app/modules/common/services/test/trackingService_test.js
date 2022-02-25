describe('Tracking Service:', function() {
    var trackv2;
    var sectionService;
    var trackingService;
    var trackingAPIService;

    beforeEach(module('common', 'appConfig', 'op.api'));

    beforeEach(module(function($provide) {
        var _sectionService = {
            getName: function() {}
        };
        var _trackv2 = {
            addEvent: function() {},
            flush: function() {}
        };
        var _trackingAPIService = {
            keepAliveTime: function() {}
        };

        $provide.value('sectionService', _sectionService);
        $provide.value('trackingAPIService', _trackingAPIService);
        $provide.value('trackv2', _trackv2);
    }));

    beforeEach(inject(function(
        _trackingService_,
        _sectionService_,
        _trackv2_,
        _trackingAPIService_
    ) {
        trackingService = _trackingService_;
        trackv2 = _trackv2_;
        sectionService = _sectionService_;
        trackingAPIService = _trackingAPIService_;

        spyOn(trackv2, 'addEvent');
        spyOn(trackv2, 'flush');
        spyOn(trackingAPIService, 'keepAliveTime');
    }));

    it('should have public methods', function() {
        expect(trackingService.event).toEqual(jasmine.any(Function));
        expect(trackingService.flush).toEqual(jasmine.any(Function));
    });

    it('should send approve event of a list of selected media.', function() {
        //Given
        spyOn(sectionService, 'getName').and.callFake(function() {
            return 'premod';
        });

        //When
        trackingService.event('media.approved', {
            id: '12345',
            type: 'media'
        });
        trackingService.flush();

        //Then
        expect(trackv2.addEvent).toHaveBeenCalledWith(
            'premod',
            'media.approved',
            {
                id: '12345',
                type: 'media'
            },
            undefined,
            undefined
        );

        expect(trackv2.addEvent.calls.count()).toEqual(1);
        expect(trackv2.flush).toHaveBeenCalled();
        expect(trackingAPIService.keepAliveTime).toHaveBeenCalled();
    });

    it('should send a tag event of a single media with a stream.', function() {
        //Given
        spyOn(sectionService, 'getName').and.callFake(function() {
            return 'moderation';
        });

        //When
        trackingService.event(
            'media.tagged',
            {
                id: '12345',
                type: 'media'
            },
            {
                single: true
            },
            {
                id: 54321,
                type: 'stream'
            }
        );

        //Then
        expect(trackv2.addEvent).toHaveBeenCalledWith(
            'moderation',
            'media.tagged',
            {
                id: '12345',
                type: 'media'
            },
            {
                id: 54321,
                type: 'stream'
            },
            undefined
        );
        expect(trackv2.addEvent.calls.count()).toEqual(1);
    });

    it('should get filters metadata with the default values when the filters are applied', function() {
        //Given

        //When
        var metadata = trackingService.getFilterMetadata({
            query: {
                filters: {
                    repost: true,
                    mirror_selfie: true
                }
            }
        });

        //Then
        expect(metadata).toEqual([
            {
                key: 'filter_repostValue',
                value: 'true'
            },
            {
                key: 'filter_mirror_selfieValue',
                value: 'true'
            }
        ]);
    });

    it('should not get filters metadata when the filters value do not match with the default filterKeys', function() {
        //Given

        //When
        var metadata = trackingService.getFilterMetadata({
            query: {
                filters: {
                    source: {
                        values: [
                            'instagram'
                        ]
                    }
                }
            }
        });

        //Then
        expect(metadata).toEqual(undefined);
    });

    it('should get NSFW and default filters metadata when those filters are applied', function() {
        //Given

        //When
        var metadata = trackingService.getFilterMetadata(
            {
                query: {
                    filters: {
                        repost: true,
                        mirror_selfie: true,
                        nsfw: {
                            values: {
                                range: {
                                    min: 0.34
                                }
                            }
                        }
                    }
                }
            },
            'reject'
        );

        //Then
        expect(metadata).toEqual([
            {
                key: 'filter_repostValue',
                value: 'true'
            },
            {
                key: 'filter_mirror_selfieValue',
                value: 'true'
            },
            {
                key: 'nsfwSliderFilterValue',
                value: '0.34'
            }
        ]);
    });

    it('should get NSFW and default filters metadata when those filters are applied', function() {
        //Given

        //When
        var metadata = trackingService.getFilterMetadata(
            {
                query: {
                    filters: {
                        repost: true,
                        mirror_selfie: true,
                        nsfw: {
                            values: {
                                range: {
                                    min: 0.34
                                }
                            }
                        }
                    }
                }
            },
            'reject'
        );

        //Then
        expect(metadata).toEqual([
            {
                key: 'filter_repostValue',
                value: 'true'
            },
            {
                key: 'filter_mirror_selfieValue',
                value: 'true'
            },
            {
                key: 'nsfwSliderFilterValue',
                value: '0.34'
            }
        ]);
    });

    it('should not get NSFW when the action is not reject', function() {
        //Given

        //When
        var metadata = trackingService.getFilterMetadata(
            {
                query: {
                    filters: {
                        repost: true,
                        mirror_selfie: true,
                        nsfw: {
                            values: {
                                range: {
                                    min: 0.34
                                }
                            }
                        }
                    }
                }
            }
        );

        //Then
        expect(metadata).toEqual([
            {
                key: 'filter_repostValue',
                value: 'true'
            },
            {
                key: 'filter_mirror_selfieValue',
                value: 'true'
            }
        ]);
    });
});
