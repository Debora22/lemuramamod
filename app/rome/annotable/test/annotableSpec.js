describe('Annotable Component', function() {
    var ctrl;
    var scope;
    var $timeout;
    var uuid4;
    var easeljs;
    var rome;
    var document;
    var $componentController;
    var onAnnotationDataUpdateSpy = jasmine.createSpy('onAnnotationDataUpdate');
    //Dictionary in order to save events callbacks
    var eventCallback = {};
    var rectEventCallback;
    var pointEventCallback;
    var elementEventCallback;
    var rectShape;
    var pointShape;
    var imageInstanceMock;
    var drawRectSpy;
    var bounds = {};

    beforeEach(function() {
        rectEventCallback = {};
        pointEventCallback = {};
        elementEventCallback = {};
        rectShape = null;
        pointShape = null;

        module('op.annotable', 'ngEaseljs', 'uuid4');

        module(function($provide) {
            var _uuid4 = {
                generate: function() {
                }
            };
            var _rome = {
                getImagesPath: function() {
                }
            };
            var _easeljs = {
                Shape: function() {
                },
                Bitmap: function() {
                },
                Stage: function() {
                },
                Text: function() {
                }
            };

            $provide.value('uuid4', _uuid4);
            $provide.value('rome', _rome);
            $provide.value('easeljs', _easeljs);
        });

        inject(function(_$q_,
                         _$timeout_,
                         _$document_,
                         _uuid4_,
                         _easeljs_,
                         _rome_) {
            $timeout = _$timeout_;
            uuid4 = _uuid4_;
            easeljs = _easeljs_;
            rome = _rome_;
            document = _$document_;

            var onSpy = jasmine.createSpy('onSpy').and.callFake(function(eventType, callback) {
                eventCallback[eventType] = callback;
            });

            var dummyHTMLObject = {
                style: {
                    top: 0,
                    left: 0,
                    display: ''
                },
                focus: function() {}
            };
            var mockCanvasContainerObject = 'mockCanvasContainer';
            spyOn(document[0], 'getElementById').and.callFake(function(spyParam) {
                if (spyParam === 'canvasContainer') {
                    return mockCanvasContainerObject;
                } else {
                    return dummyHTMLObject;
                }
            });
            spyOn(dummyHTMLObject, 'focus').and.returnValue('Just Focus');

            var elementSpy = {
                0: {
                    getBoundingClientRect: jasmine.createSpy('getBoundingClientRect').and.returnValue({
                        top: 0,
                        left: 0
                    })
                },
                append: jasmine.createSpy('append'),
                on: jasmine.createSpy('on').and.callFake(function(evenType, callback) {
                    elementEventCallback[evenType] = callback;
                }),
                css: jasmine.createSpy('css'),
                data: jasmine.createSpy('data'),
                remove: jasmine.createSpy('remove')
            };
            var canvasContainerElementSpy = [{
                children: [],
                append: jasmine.createSpy('append')
            }];

            spyOn(angular, 'element').and.callFake(function(eventType) {
                if (eventType === 'mockCanvasContainer') {
                    return canvasContainerElementSpy;
                } else {
                    return elementSpy;
                }
            });

            var rectOnSpy = jasmine.createSpy('rectOnSpy').and.callFake(function(eventType, callback) {
                if (rectEventCallback && Object.keys(rectEventCallback).length < 3) {
                    rectEventCallback[eventType] = callback;
                } else {
                    pointEventCallback[eventType] = callback;
                }
            });

            // Spy and mock methods
            spyOn(uuid4, 'generate').and.returnValue('UUID_MOCK');
            spyOn(rome, 'getImagesPath').and.returnValue('IMAGE_URL_PATH_MOCK');
            spyOn(easeljs, 'Stage').and.returnValue({
                enableMouseOver: jasmine.createSpy('enableMouseOver'),
                update: jasmine.createSpy('update'),
                addChild: jasmine.createSpy('addChild'),
                on: onSpy,
                off: jasmine.createSpy('off'),
                removeChild: jasmine.createSpy('removeChild')
            });
            spyOn(easeljs, 'Bitmap').and.callFake(function() {
                return angular.copy({
                    on: jasmine.createSpy('on')
                });
            });
            spyOn(easeljs, 'Text').and.returnValue({name: 'TEXT_OBJECT'});

            drawRectSpy = jasmine.createSpy('drawRectSpy');
            var beginFillSpy = jasmine.createSpy('beginFillSpy').and.returnValue({
                drawRect: drawRectSpy
            });
            var beginStrokeSpy = jasmine.createSpy('beginStrokeSpy').and.returnValue({
                beginFill: beginFillSpy
            });
            var setStrokeStyleSpy = jasmine.createSpy('setStrokeStyleSpy').and.returnValue({
                beginStroke: beginStrokeSpy
            });
            var graphicsSpy = {
                setStrokeStyle: setStrokeStyleSpy,
                beginFill: beginFillSpy,
                clear: jasmine.createSpy('crealSpy')
            };
            var shapeSpy = {
                graphics: graphicsSpy,
                getBounds: jasmine.createSpy('getBounds').and.callFake(function() {
                    return bounds;
                }),
                setBounds: jasmine.createSpy('setBounds').and.callFake(function(x, y, width, height) {
                    bounds = {
                        x: x,
                        y: y,
                        width: width,
                        height: height
                    };
                }),
                on: rectOnSpy,
                off: jasmine.createSpy('off'),
                id: 111
            };
            spyOn(easeljs, 'Shape').and.callFake(function() {
                if (!rectShape) {
                    rectShape = angular.copy(shapeSpy);
                    return rectShape;
                } else {
                    pointShape = angular.copy(shapeSpy);
                    return pointShape;
                }
            });

            imageInstanceMock = [];
            spyOn(window, 'Image').and.callFake(function() {
                var imageMock = {
                    onload: {},
                    height: 640,
                    width: 640
                };

                imageInstanceMock.push(imageMock);
                return imageMock;
            });
        });

        inject(function(_$componentController_, $rootScope) {
            var bindings = {
                src: 'IMAGE_URL_MOCK',
                baseMediaUrl: '/media/image?mediaUrl=',
                width: 450,
                height: 450,
                annotationData: [{
                    externalId: 'Stream_1',
                    displayConfirmButton: false,
                    onConfirm: function() {
                        console.log('Confirm1');
                    },
                    displayRemoveButton: true,
                    onRemove: function() {
                        console.log('Remove2');
                    },
                    editable: false,
                    tooltip: {
                        text: 'Image Text',
                        thumbnail: 'thumbnail.jpg'
                    },
                    geometry: {
                        coordinates: [{
                            x: 24,
                            y: 60
                        }],
                        size: [{
                            h: 89,
                            w: 100
                        }]
                    }
                }],
                enableEditorUi: true,
                onAnnotationDataUpdate: onAnnotationDataUpdateSpy
            };

            $componentController = _$componentController_;
            scope = $rootScope.$new();
            ctrl = $componentController('opAnnotableImg', {
                $scope: scope
            }, bindings);
        });
    });

    it('should add image to canvas on $onInit method', function() {
        // Given

        // When
        ctrl.$onInit();
        ctrl.mainImage.onload();
        $timeout.flush();

        // Then
        expect(uuid4.generate).toHaveBeenCalled();
        expect(ctrl.canvasId).toEqual('UUID_MOCK');
        expect(rome.getImagesPath).toHaveBeenCalledWith('annotable');
        expect(ctrl.imagesPath).toEqual('IMAGE_URL_PATH_MOCK');
        expect(ctrl.width).toEqual(450);
        expect(ctrl.height).toEqual(450);
        expect(easeljs.Stage).toHaveBeenCalledWith('UUID_MOCK');
        //Improve next expect, check deep object, https://www.npmjs.com/package/jasmine-object-matchers
        expect(ctrl.stage).toEqual(jasmine.any(Object));
        expect(ctrl.stage.enableMouseOver).toHaveBeenCalled();
        expect(window.Image).toHaveBeenCalled();
        expect(ctrl.mainImage.src).toEqual('/media/image?mediaUrl=IMAGE_URL_MOCK');
        expect(easeljs.Bitmap).toHaveBeenCalledWith('/media/image?mediaUrl=IMAGE_URL_MOCK');
        expect(ctrl.stage.addChild.calls.argsFor(0)).toEqual([{
            on: jasmine.any(Function),
            x: 0,
            y: 0,
            scaleX: 0.703125,
            scaleY: 0.703125
        }]);
        expect(ctrl.stage.addChild.calls.count()).toEqual(3);
        expect(ctrl.stage.update).toHaveBeenCalled();
        expect(ctrl.stage.update.calls.count()).toEqual(2);
    });

    it('should add to canvas already created annotation in annotationData', function() {
        // Given

        // When
        ctrl.$onInit();
        ctrl.mainImage.onload();
        $timeout.flush();

        //Resolve onload for all loadAndCreateBitmap calls
        imageInstanceMock.forEach(function(imageInstance, index) {
            if (index) {
                imageInstance.onload();
            }
        });

        //Resolve promises into loadAndCreateBitmap method
        scope.$apply();

        // Then
        expect(ctrl.stage.on).toHaveBeenCalledWith('stagemousedown', jasmine.any(Function));
        expect(easeljs.Shape).toHaveBeenCalled();
        expect(easeljs.Shape.calls.count()).toEqual(2);
        expect(ctrl.stage.addChild.calls.count()).toEqual(7);

        //check addChildCalls
        //addChild call when the rectangle is created
        expect(ctrl.stage.addChild.calls.argsFor(1)).toEqual([{
            graphics: {
                setStrokeStyle: jasmine.any(Function),
                beginFill: jasmine.any(Function),
                clear: jasmine.any(Function)
            },
            getBounds: jasmine.any(Function),
            setBounds: jasmine.any(Function),
            externalId: 'Stream_1',
            on: jasmine.any(Function),
            off: jasmine.any(Function),
            id: 111,
            x: 24,
            y: 60,
            width: 100,
            height: 89,
            cursor: null,
            editable: false
        }]);
        //addChild call when the point is created
        expect(ctrl.stage.addChild.calls.argsFor(2)).toEqual([{
            graphics: {
                setStrokeStyle: jasmine.any(Function),
                beginFill: jasmine.any(Function),
                clear: jasmine.any(Function)
            },
            getBounds: jasmine.any(Function),
            setBounds: jasmine.any(Function),
            on: jasmine.any(Function),
            off: jasmine.any(Function),
            id: 111,
            parentId: 111,
            x: 123,
            y: 148,
            cursor: null,
            name: 'resizePoint',
            visible: false
        }]);
        //addChild call when the confirmationButton is created
        expect(ctrl.stage.addChild.calls.argsFor(3)).toEqual([{
            on: jasmine.any(Function),
            scaleX: 0.6,
            scaleY: 0.6,
            cursor: 'pointer',
            name: 'confirmButton',
            parentId: 111,
            visible: false
        }]);
        //addChild call when the removeButton is created
        expect(ctrl.stage.addChild.calls.argsFor(4)).toEqual([{
            on: jasmine.any(Function),
            scaleX: 0.6,
            scaleY: 0.6,
            cursor: 'pointer',
            name: 'removeButton',
            parentId: 111,
            visible: true
        }]);
        //addChild call when the tooltip is created
        expect(ctrl.stage.addChild.calls.argsFor(5)).toEqual([{
            on: jasmine.any(Function),
            scaleX: 0.4,
            scaleY: 0.4,
            name: 'tooltip',
            parentId: 111,
            visible: {
                text: 'Image Text',
                thumbnail: 'thumbnail.jpg'
            }
        }]);
        expect(ctrl.stage.addChild.calls.argsFor(6)).toEqual([{name: 'TEXT_OBJECT', parentId: 111}]);
        expect(ctrl.stage.update.calls.count()).toEqual(9);
        expect(window.Image.calls.count()).toEqual(4);
        expect(easeljs.Bitmap.calls.count()).toEqual(4);
        expect(easeljs.Bitmap).toHaveBeenCalledWith('IMAGE_URL_PATH_MOCKcheck.png');
        expect(easeljs.Bitmap).toHaveBeenCalledWith('IMAGE_URL_PATH_MOCKtrash.png');
        expect(easeljs.Bitmap).toHaveBeenCalledWith('IMAGE_URL_PATH_MOCKname.png');
        expect(easeljs.Text).toHaveBeenCalledWith('Image Text', '11px sans-serif', '#6C6F74');
    });

    it('should set default height and width values when binding data is undefined', function() {
        // Given
        ctrl.width = undefined;
        ctrl.height = undefined;

        // When
        ctrl.$onInit();

        // Then
        expect(ctrl.width).toEqual(450);
        expect(ctrl.height).toEqual(450);
    });

    it('should not create annotation in the canvas if annotationData is empty', function() {
        // Given
        ctrl.annotationData = [];

        // When
        ctrl.$onInit();
        ctrl.mainImage.onload();
        $timeout.flush();

        // Then
        expect(ctrl.stage.addChild.calls.count()).toEqual(1);
        expect(easeljs.Shape).not.toHaveBeenCalled();
        expect(ctrl.stage.update.calls.count()).toEqual(1);
        expect(window.Image.calls.count()).toEqual(1);
        expect(easeljs.Bitmap.calls.count()).toEqual(1);
        expect(easeljs.Bitmap).toHaveBeenCalledWith('/media/image?mediaUrl=IMAGE_URL_MOCK');
        expect(easeljs.Text).not.toHaveBeenCalled();
    });

    //component $onChange method
    it('should change previous mainImage src by new one', function() {
        // Given
        var changedData = {
            src: {
                isFirstChange: function() {
                    return false;
                },
                currentValue: 'NEW_SOURCE_URL',
                previousValue: 'PREVIOUS_SOURCE_URL'
            }
        };

        // When
        ctrl.$onInit();
        ctrl.mainImage.onload();
        $timeout.flush();

        //Change component bindings
        ctrl.$onChanges(changedData);

        // Then
        expect(ctrl.mainImage.src).toEqual('/media/image?mediaUrl=NEW_SOURCE_URL');
    });

    it('should not change previousValue when the new value is equal to the previous one', function() {
        // Given
        var changedData = {
            src: {
                isFirstChange: function() {
                    return false;
                },
                currentValue: 'PREVIOUS_SOURCE_URL',
                previousValue: 'PREVIOUS_SOURCE_URL'
            }
        };

        // When
        ctrl.$onInit();
        ctrl.mainImage.onload();
        $timeout.flush();

        //Change component bindings
        ctrl.$onChanges(changedData);

        // Then
        expect(ctrl.mainImage.src).toEqual('/media/image?mediaUrl=IMAGE_URL_MOCK');
    });

    it('should not change previousValue when it is the first change', function() {
        // Given
        var changedData = {
            src: {
                isFirstChange: function() {
                    return true;
                }
            }
        };

        // When
        ctrl.$onInit();
        ctrl.mainImage.onload();
        $timeout.flush();

        //Change component bindings
        ctrl.$onChanges(changedData);

        // Then
        expect(ctrl.mainImage.src).toEqual('/media/image?mediaUrl=IMAGE_URL_MOCK');
    });

    it('should update annotation when some of the properties are modified from implementation', function() {
        // Given
        var changedData = {
            annotationData: {
                isFirstChange: function() {
                    return false;
                },
                previousValue: [{
                    id: 111,
                    externalId: 'Stream_1',
                    editable: false,
                    geometry: {
                        coordinates: [{
                            x: 24,
                            y: 60
                        }],
                        size: [{
                            h: 89,
                            w: 100
                        }]
                    }
                }],
                currentValue: [{
                    id: 111,
                    externalId: 'Stream_1',
                    editable: true, //property changed
                    geometry: {
                        coordinates: [{
                            x: 24,
                            y: 60
                        }],
                        size: [{
                            h: 89,
                            w: 100
                        }]
                    }
                }]
            }
        };

        // When
        ctrl.annotationData[0].id = 111;
        ctrl.$onInit();
        ctrl.mainImage.onload();
        $timeout.flush();
        ctrl.stage.children = [
            {id: 111},
            {parentId: 111}, //child element refering to parent element
            {parentId: 111}
        ];

        //Change component bindings
        ctrl.$onChanges(changedData);

        // Then
        expect(ctrl.stage.removeChild.calls.count()).toEqual(3);
        expect(ctrl.stage.update.calls.count()).toEqual(4);
        expect(easeljs.Shape.calls.count()).toEqual(4);
        expect(ctrl.stage.addChild.calls.count()).toEqual(5);
    });

    it('should not update annotation when the properties are equal', function() {
        // Given
        var changedData = {
            annotationData: {
                isFirstChange: function() {
                    return false;
                },
                previousValue: [{
                    id: 111,
                    externalId: 'Stream_1',
                    editable: false,
                    geometry: {
                        coordinates: [{
                            x: 24,
                            y: 60
                        }],
                        size: [{
                            h: 89,
                            w: 100
                        }]
                    }
                }],
                currentValue: [{
                    id: 111,
                    externalId: 'Stream_1',
                    editable: false,
                    geometry: {
                        coordinates: [{
                            x: 24,
                            y: 60
                        }],
                        size: [{
                            h: 89,
                            w: 100
                        }]
                    }
                }]
            }
        };

        // When
        ctrl.annotationData[0].id = 111;
        ctrl.$onInit();

        ctrl.mainImage.onload();
        $timeout.flush();

        //Change component bindings
        ctrl.$onChanges(changedData);

        // Then
        expect(ctrl.stage.removeChild.calls.count()).toEqual(0);
        expect(ctrl.stage.update.calls.count()).toEqual(2);
        expect(easeljs.Shape.calls.count()).toEqual(2);
        expect(ctrl.stage.addChild.calls.count()).toEqual(3);
    });

    it('should create new annotation when currentValue has a new one', function() {
        // Given
        var changedData = {
            annotationData: {
                isFirstChange: function() {
                    return false;
                },
                previousValue: [{
                    id: 111,
                    externalId: 'Stream_1',
                    editable: false,
                    geometry: {
                        coordinates: [{
                            x: 24,
                            y: 60
                        }],
                        size: [{
                            h: 89,
                            w: 100
                        }]
                    }
                }],
                currentValue: [
                    {
                        id: 111,
                        externalId: 'Stream_1',
                        editable: false,
                        geometry: {
                            coordinates: [{
                                x: 24,
                                y: 60
                            }],
                            size: [{
                                h: 89,
                                w: 100
                            }]
                        }
                    },
                    {
                        externalId: 'Stream_2',
                        editable: false,
                        geometry: {
                            coordinates: [{
                                x: 24,
                                y: 60
                            }],
                            size: [{
                                h: 89,
                                w: 100
                            }]
                        }
                    }
                ]
            }
        };

        // When
        ctrl.annotationData[0].id = 111;
        ctrl.$onInit();

        ctrl.mainImage.onload();
        $timeout.flush();

        //Change component bindings
        ctrl.$onChanges(changedData);

        // Then
        expect(ctrl.stage.removeChild.calls.count()).toEqual(0);
        expect(ctrl.stage.update.calls.count()).toEqual(3);
        expect(easeljs.Shape.calls.count()).toEqual(4);
        expect(ctrl.stage.addChild.calls.count()).toEqual(5);
    });

    it('should remove annotation that was removed from the implementation', function() {
        // Given
        var changedData = {
            annotationData: {
                isFirstChange: function() {
                    return false;
                },
                previousValue: [
                    {
                        id: 333,
                        externalId: 'Stream_1',
                        editable: false,
                        geometry: {
                            coordinates: [{
                                x: 24,
                                y: 60
                            }],
                            size: [{
                                h: 89,
                                w: 100
                            }]
                        }
                    },
                    {
                        id: 111,
                        externalId: 'Stream_2',
                        editable: false,
                        geometry: {
                            coordinates: [{
                                x: 24,
                                y: 60
                            }],
                            size: [{
                                h: 89,
                                w: 100
                            }]
                        }
                    }
                ],
                currentValue: [{
                    id: 333,
                    externalId: 'Stream_1',
                    editable: false,
                    geometry: {
                        coordinates: [{
                            x: 24,
                            y: 60
                        }],
                        size: [{
                            h: 89,
                            w: 100
                        }]
                    }
                }]
            }
        };

        // When
        ctrl.annotationData[0].id = 444;
        ctrl.$onInit();

        ctrl.mainImage.onload();
        $timeout.flush();
        ctrl.stage.children = [
            {id: 111},
            {parentId: 111}, //child element refering to parent element
            {parentId: 111}
        ];
        //Change component bindings
        ctrl.$onChanges(changedData);

        // Then
        expect(ctrl.stage.removeChild.calls.count()).toEqual(3);
        expect(ctrl.stage.update.calls.count()).toEqual(3);
        expect(easeljs.Shape.calls.count()).toEqual(2);
        expect(ctrl.stage.addChild.calls.count()).toEqual(3);
    });

    it('should not change annotationData when it is the first change', function() {
        // Given
        var changedData = {
            annotationData: {
                isFirstChange: function() {
                    return true;
                },
            }
        };

        // When
        ctrl.$onInit();

        ctrl.mainImage.onload();
        $timeout.flush();

        //Change component bindings
        ctrl.$onChanges(changedData);

        // Then
        expect(ctrl.stage.removeChild.calls.count()).toEqual(0);
        expect(ctrl.stage.update.calls.count()).toEqual(2);
        expect(easeljs.Shape.calls.count()).toEqual(2);
        expect(ctrl.stage.addChild.calls.count()).toEqual(3);
    });

    it('should properly create annotations on user interaction with drag and drop gesture', function() {
        // Given
        ctrl.$onInit();
        // Set annotation data to empty
        ctrl.annotationData = [];

        ctrl.mainImage.onload();
        $timeout.flush();

        var mouseDownEvent = {
            relatedTarget: false,
            stageX: 10,
            stageY: 10
        };

        var mouseMoveEvent = {
            relatedTarget: false,
            stageX: 91,
            stageY: 91
        };

        var mouseUpEvent = {
            relatedTarget: false,
            stageX: 91,
            stageY: 91
        };

        // When
        eventCallback.stagemousedown(mouseDownEvent);
        eventCallback.stagemousemove(mouseMoveEvent);
        eventCallback.stagemouseup(mouseUpEvent);

        // Then
        expect(ctrl.stage.addChild.calls.count()).toEqual(3);
        expect(drawRectSpy).toHaveBeenCalledWith(0, 0, 1, 1);
        expect(drawRectSpy).toHaveBeenCalledWith(0, 0, 81, 81);
        expect(bounds).toEqual({
            x: 10,
            y: 10,
            width: 81,
            height: 81
        });
    });

    it('should properly check annotations min size on user interaction with drag and drop gesture', function() {
        // Given
        ctrl.$onInit();
        // Set annotation data to empty
        ctrl.annotationData = [];

        ctrl.mainImage.onload();
        $timeout.flush();

        var mouseDownEvent = {
            relatedTarget: false,
            stageX: 10,
            stageY: 10
        };

        var mouseMoveEvent = {
            relatedTarget: false,
            stageX: 21,
            stageY: 21
        };

        var mouseUpEvent = {
            relatedTarget: false,
            stageX: 21,
            stageY: 21
        };

        // When
        eventCallback.stagemousedown(mouseDownEvent);
        eventCallback.stagemousemove(mouseMoveEvent);
        eventCallback.stagemouseup(mouseUpEvent);

        // Then
        expect(ctrl.stage.addChild.calls.count()).toEqual(3);
        expect(drawRectSpy).toHaveBeenCalledWith(0, 0, 1, 1);
        expect(drawRectSpy).toHaveBeenCalledWith(0, 0, 11, 11);
        expect(drawRectSpy).toHaveBeenCalledWith(0, 0, 80, 80);
        expect(bounds).toEqual({
            x: 10,
            y: 10,
            width: 80,
            height: 80
        });
    });

    it('should properly handle annotation move event', function() {
        // Given
        ctrl.$onInit();
        // Set annotation data to empty
        ctrl.annotationData = [];

        ctrl.mainImage.onload();
        $timeout.flush();

        var mouseDownEvent = {
            relatedTarget: false,
            stageX: 10,
            stageY: 10
        };

        var mouseMoveEvent = {
            relatedTarget: false,
            stageX: 91,
            stageY: 91
        };

        var mouseUpEvent = {
            relatedTarget: false,
            stageX: 91,
            stageY: 91
        };

        eventCallback.stagemousedown(mouseDownEvent);
        eventCallback.stagemousemove(mouseMoveEvent);
        eventCallback.stagemouseup(mouseUpEvent);

        var rectMouseDownEvent = {
            stageX: 15,
            stageY: 15,
            target: {
                x: 10,
                y: 10
            }
        };

        var rectMouseMoveEvent = {
            stageX: 33,
            stageY: 33,
            target: rectShape
        };
        // When
        rectEventCallback.mousedown(rectMouseDownEvent);
        rectEventCallback.pressmove(rectMouseMoveEvent);
        rectEventCallback.pressup();

        // Then
        expect(bounds).toEqual({
            x: 28,
            y: 28,
            width: 81,
            height: 81
        });
    });

    it('should avoid annotation to be move outside the canvas area', function() {
        // Given
        ctrl.$onInit();
        // Set annotation data to empty
        ctrl.annotationData = [];

        ctrl.mainImage.onload();
        $timeout.flush();

        var mouseDownEvent = {
            relatedTarget: false,
            stageX: 10,
            stageY: 10
        };

        var mouseMoveEvent = {
            relatedTarget: false,
            stageX: 91,
            stageY: 91
        };

        var mouseUpEvent = {
            relatedTarget: false,
            stageX: 91,
            stageY: 91
        };

        eventCallback.stagemousedown(mouseDownEvent);
        eventCallback.stagemousemove(mouseMoveEvent);
        eventCallback.stagemouseup(mouseUpEvent);

        var rectMouseDownEvent = {
            stageX: 30,
            stageY: 30,
            target: rectShape
        };

        var rectMouseMoveEvent = {
            stageX: 20,
            stageY: 20,
            target: rectShape
        };

        var rectMouseMoveEvent2 = {
            stageX: 19,
            stageY: 19,
            target: rectShape
        };

        // When
        rectEventCallback.mousedown(rectMouseDownEvent);
        rectEventCallback.pressmove(rectMouseMoveEvent);
        rectEventCallback.pressmove(rectMouseMoveEvent2);
        rectEventCallback.pressup();

        // Then
        expect(bounds).toEqual({
            x: 0,
            y: 0,
            width: 81,
            height: 81
        });
    });

    it('should properly handle annotation resize event', function() {
        // Given
        ctrl.$onInit();
        ctrl.mainImage.onload();
        $timeout.flush();

        var mouseDownEvent = {
            relatedTarget: false,
            stageX: 10,
            stageY: 10
        };

        var mouseMoveEvent = {
            relatedTarget: false,
            stageX: 91,
            stageY: 91
        };

        var mouseUpEvent = {
            relatedTarget: false,
            stageX: 91,
            stageY: 91
        };

        var pointPressMoveEvent = {
            stageX: 104,
            stageY: 104
        };

        eventCallback.stagemousedown(mouseDownEvent);
        eventCallback.stagemousemove(mouseMoveEvent);
        eventCallback.stagemouseup(mouseUpEvent);

        // When
        pointEventCallback.pressmove(pointPressMoveEvent);
        pointEventCallback.pressup();

        // Then
        expect(bounds).toEqual({
            x: 10,
            y: 10,
            width: 94,
            height: 94
        });
    });

    it('should properly handle annotation resize event taking into account min size', function() {
        // Given
        ctrl.$onInit();
        ctrl.mainImage.onload();
        $timeout.flush();

        var mouseDownEvent = {
            relatedTarget: false,
            stageX: 10,
            stageY: 10
        };

        var mouseMoveEvent = {
            relatedTarget: false,
            stageX: 50,
            stageY: 50
        };

        var mouseUpEvent = {
            relatedTarget: false,
            stageX: 50,
            stageY: 50
        };

        var pointPressMoveEvent = {
            stageX: 39,
            stageY: 39
        };

        eventCallback.stagemousedown(mouseDownEvent);
        eventCallback.stagemousemove(mouseMoveEvent);
        eventCallback.stagemouseup(mouseUpEvent);

        // When
        pointEventCallback.pressmove(pointPressMoveEvent);
        pointEventCallback.pressup();

        // Then
        expect(bounds).toEqual({
            x: 10,
            y: 10,
            width: 80,
            height: 80
        });
    });

    it('should show a tooltip with a input', function() {
        // Given
        // When
        ctrl.$onInit();
        ctrl.mainImage.onload();
        $timeout.flush();
        //user click the canvan
        eventCallback.stagemousedown({
            relatedTarget: null,
            stageX: 10,
            stagey: 10
        });
        //and release the mouse 10px away
        eventCallback.stagemouseup({
            relatedTarget: null,
            stageX: 20,
            stagey: 20
        });
        //Then
        var tooltipElement = document[0].getElementById('op-annotable-search-tooltip-UUID_MOCK');
        var tooltipInputElement = document[0].getElementById('op-annotable-search-stream');
        expect(tooltipElement.style.display).toEqual('block');
        expect(tooltipInputElement.focus).toHaveBeenCalled();
    });

    it('should fire the callback when the input value changes', function() {
        // Given
        ctrl.onAnnotationInputSearchChange = function() {};
        spyOn(ctrl, 'onAnnotationInputSearchChange').and.returnValue({});

        // When
        ctrl.$onInit();
        ctrl.mainImage.onload();
        $timeout.flush();
        ctrl.searchTooltipText = 'Some text';
        ctrl.onInputSearchChange();

        //Then
        expect(ctrl.onAnnotationInputSearchChange).toHaveBeenCalledWith('Some text');
    });

    it('should remove annotation shapes when annotationId is not defined', function() {
        // Given
        var changedData = {
            annotationData: {
                isFirstChange: function() {
                    return false;
                },
                previousValue: [{
                    externalId: 'Stream_1',
                    editable: false,
                    geometry: {
                        coordinates: [{
                            x: 24,
                            y: 60
                        }],
                        size: [{
                            h: 89,
                            w: 100
                        }]
                    }
                }],
                currentValue: []
            }
        };

        // When
        ctrl.$onInit();
        ctrl.mainImage.onload();
        $timeout.flush();
        ctrl.stage.children = [
            {
                externalId: 'Stream_1',
                id: 111
            },
            { parentId: 111 }, //child element refering to parent element
            { parentId: 111 }
        ];

        //Change component bindings
        ctrl.$onChanges(changedData);

        // Then
        expect(ctrl.stage.removeChild.calls.count()).toEqual(3);
        expect(ctrl.stage.update.calls.count()).toEqual(3);
        expect(easeljs.Shape.calls.count()).toEqual(2);
        expect(ctrl.stage.addChild.calls.count()).toEqual(3);
    });

    it('should not remove annotation shapes when the parent shape is not found', function() {
        // Given
        var changedData = {
            annotationData: {
                isFirstChange: function() {
                    return false;
                },
                previousValue: [{
                    externalId: 'Stream_2', // Different externalId with the shapes children
                    editable: false,
                    geometry: {
                        coordinates: [{
                            x: 24,
                            y: 60
                        }],
                        size: [{
                            h: 89,
                            w: 100
                        }]
                    }
                }],
                currentValue: []
            }
        };

        // When
        ctrl.$onInit();
        ctrl.mainImage.onload();
        $timeout.flush();
        ctrl.stage.children = [
            {
                externalId: 'Stream_1',
                id: 111
            },
            { parentId: 111 }, //child element refering to parent element
            { parentId: 111 }
        ];

        //Change component bindings
        ctrl.$onChanges(changedData);

        // Then
        expect(ctrl.stage.removeChild.calls.count()).toEqual(0);
        expect(ctrl.stage.update.calls.count()).toEqual(2);
        expect(easeljs.Shape.calls.count()).toEqual(2);
        expect(ctrl.stage.addChild.calls.count()).toEqual(3);
    });

    it('should properly display the hotspot indication indicator on mouseover', function() {
        // Given
        ctrl.$onInit();
        ctrl.mainImage.onload();
        $timeout.flush();

        // When
        elementEventCallback.mousemove({
            clientX: 10,
            clientY: 10
        });

        //Then
        expect(ctrl.destinationIndicator.css.calls.argsFor(ctrl.destinationIndicator.css.calls.count() -1 )).toEqual(['display', 'block']);
    });


    it('should properly hide the hotspot indication on mouseleave', function() {
        // Given
        ctrl.$onInit();
        ctrl.mainImage.onload();
        $timeout.flush();

        // When
        elementEventCallback.mouseleave();

        //Then
        expect(ctrl.destinationIndicator.css.calls.argsFor(ctrl.destinationIndicator.css.calls.count() -1 )).toEqual(['display', 'none']);
    });

    it('should not update annotations shapes when the stage is not presented', function() {
        // Given
        var changedData = {
            annotationData: {
                isFirstChange: function() {
                    return false;
                },
                previousValue: [{
                    externalId: 'Stream_2', // Different externalId with the shapes children
                    editable: false,
                    geometry: {
                        coordinates: [{
                            x: 24,
                            y: 60
                        }],
                        size: [{
                            h: 89,
                            w: 100
                        }]
                    }
                }],
                currentValue: []
            }
        };

        // When
        //Change component bindings
        ctrl.$onChanges(changedData);

        // Then
        expect(easeljs.Shape.calls.count()).toEqual(0);
        expect(ctrl.stage).not.toEqual(jasmine.any(Object));
    });
});
