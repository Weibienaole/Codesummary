import router from '@ohos:router';
import Constants from '@bundle:com.example.photo/entry/ets/common/Constant';
import display from '@ohos:display';
class DetailList extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.photoList = new Array().concat(Constants.CATCH_IMAGE_ARR, router.getParams()['photoList'], Constants.CATCH_IMAGE_ARR);
        this.currentIndex = router.getParams()['currentIndex'];
        this.bigScrollControl = new Scroller();
        this.bottomScrollerControl = new Scroller();
        this.__deviceWidth = new ObservedPropertySimplePU(Constants.DEFAULT_WIDTH, this, "deviceWidth");
        this.__smallPhotoWidth = new ObservedPropertySimplePU(this.getSmallPhotoWidth(Constants.DEFAULT_WIDTH), this, "smallPhotoWidth");
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.photoList !== undefined) {
            this.photoList = params.photoList;
        }
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
        if (params.bigScrollControl !== undefined) {
            this.bigScrollControl = params.bigScrollControl;
        }
        if (params.bottomScrollerControl !== undefined) {
            this.bottomScrollerControl = params.bottomScrollerControl;
        }
        if (params.deviceWidth !== undefined) {
            this.deviceWidth = params.deviceWidth;
        }
        if (params.smallPhotoWidth !== undefined) {
            this.smallPhotoWidth = params.smallPhotoWidth;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__deviceWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__smallPhotoWidth.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__deviceWidth.aboutToBeDeleted();
        this.__smallPhotoWidth.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get deviceWidth() {
        return this.__deviceWidth.get();
    }
    set deviceWidth(newValue) {
        this.__deviceWidth.set(newValue);
    }
    get smallPhotoWidth() {
        return this.__smallPhotoWidth.get();
    }
    set smallPhotoWidth(newValue) {
        this.__smallPhotoWidth.set(newValue);
    }
    aboutToAppear() {
        var _a;
        const displayClass = display.getDefaultDisplaySync();
        const width = (_a = (displayClass === null || displayClass === void 0 ? void 0 : displayClass.width) / displayClass.densityPixels) !== null && _a !== void 0 ? _a : Constants.DEFAULT_WIDTH;
        if (width) {
            this.deviceWidth = width;
            // 一屏保留八个，(总宽 - 缝隙) / 8
            this.smallPhotoWidth = this.getSmallPhotoWidth(width);
        }
    }
    onPageShow() {
        this.bigScrollControl.scrollToIndex(this.currentIndex);
        this.bottomScrollerControl.scrollToIndex(this.currentIndex);
    }
    getSmallPhotoWidth(wid) {
        return (wid - ((8 - 1) * 2)) / 8.5;
    }
    bigRefreshCurrentIndex(scrollType) {
        const scrollOffset = this.bigScrollControl.currentOffset().xOffset;
        const nowCurrentIndex = Math.round(scrollOffset / this.deviceWidth);
        if (scrollType === 'scroll') {
        }
        else {
            this.bigScrollControl.scrollTo({
                xOffset: nowCurrentIndex * this.deviceWidth + nowCurrentIndex * 20,
                yOffset: 0
            });
        }
        if (this.currentIndex !== nowCurrentIndex) {
            this.currentIndex = nowCurrentIndex;
            this.bottomScrollerControl.scrollTo({ xOffset: nowCurrentIndex * this.smallPhotoWidth, yOffset: 0 });
        }
    }
    smallRefreshCurrentIndex(scrollType) {
        const scrollOffset = this.bottomScrollerControl.currentOffset().xOffset;
        const nowCurrentIndex = Math.round(scrollOffset / this.smallPhotoWidth);
        if (scrollType === 'scroll') {
        }
        else {
            this.bottomScrollerControl.scrollTo({
                xOffset: nowCurrentIndex * this.smallPhotoWidth,
                yOffset: 0
            });
        }
        if (this.currentIndex !== nowCurrentIndex) {
            this.currentIndex = nowCurrentIndex;
            this.bigScrollControl.scrollTo({
                xOffset: nowCurrentIndex * this.deviceWidth + nowCurrentIndex * 20,
                yOffset: 0
            });
        }
    }
    setNewCurrentIndex(index) {
        this.currentIndex = index;
        this.bigScrollControl.scrollTo({
            xOffset: index * this.deviceWidth + index * 20,
            yOffset: 0
        });
        this.bottomScrollerControl.scrollToIndex(index);
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Navigation.create();
            Navigation.debugLine("pages/DetailList.ets(83:5)");
            Navigation.title('图片详情');
            Navigation.titleMode(NavigationTitleMode.Mini);
            if (!isInitialRender) {
                Navigation.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Stack.create({ alignContent: Alignment.Bottom });
            Stack.debugLine("pages/DetailList.ets(84:7)");
            Stack.height('100%');
            Stack.width('100%');
            if (!isInitialRender) {
                Stack.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            List.create({ scroller: this.bigScrollControl, initialIndex: this.currentIndex, space: 20 });
            List.debugLine("pages/DetailList.ets(85:9)");
            List.width('100%');
            List.height('100%');
            List.listDirection(Axis.Horizontal);
            List.onScroll((_, scrollState) => {
                // 惯性滑动时开始判定落点
                if (scrollState === ScrollState.Fling) {
                    this.bigRefreshCurrentIndex('scroll');
                }
            });
            List.onScrollStop(() => {
                this.bigRefreshCurrentIndex('stop');
            });
            if (!isInitialRender) {
                List.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            ForEach.create();
            const forEachItemGenFunction = (_item, index) => {
                const photo = _item;
                this.observeComponentCreation((elmtId, isInitialRender) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                    If.create();
                    if ((index >= Constants.CATCH_IMAGE_ARR.length) &&
                        (index < (this.photoList.length - Constants.CATCH_IMAGE_ARR.length))) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            {
                                const isLazyCreate = true;
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, isLazyCreate);
                                    ListItem.width(this.deviceWidth);
                                    ListItem.margin({ bottom: 50 + this.smallPhotoWidth + 30 });
                                    ListItem.debugLine("pages/DetailList.ets(91:15)");
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const observedShallowRender = () => {
                                    this.observeComponentCreation(itemCreation);
                                    ListItem.pop();
                                };
                                const observedDeepRender = () => {
                                    this.observeComponentCreation(itemCreation);
                                    this.observeComponentCreation((elmtId, isInitialRender) => {
                                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                        Image.create(photo);
                                        Image.debugLine("pages/DetailList.ets(92:17)");
                                        Image.objectFit(ImageFit.Contain);
                                        Image.width('100%');
                                        Image.height('100%');
                                        if (!isInitialRender) {
                                            Image.pop();
                                        }
                                        ViewStackProcessor.StopGetAccessRecording();
                                    });
                                    ListItem.pop();
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.updateFuncByElmtId.set(elmtId, itemCreation);
                                    this.observeComponentCreation((elmtId, isInitialRender) => {
                                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                        Image.create(photo);
                                        Image.debugLine("pages/DetailList.ets(92:17)");
                                        Image.objectFit(ImageFit.Contain);
                                        Image.width('100%');
                                        Image.height('100%');
                                        if (!isInitialRender) {
                                            Image.pop();
                                        }
                                        ViewStackProcessor.StopGetAccessRecording();
                                    });
                                    ListItem.pop();
                                };
                                if (isLazyCreate) {
                                    observedShallowRender();
                                }
                                else {
                                    observedDeepRender();
                                }
                            }
                        });
                    }
                    else {
                        If.branchId(1);
                    }
                    if (!isInitialRender) {
                        If.pop();
                    }
                    ViewStackProcessor.StopGetAccessRecording();
                });
                If.pop();
            };
            this.forEachUpdateFunction(elmtId, this.photoList, forEachItemGenFunction, (_, index) => index.toString(), true, true);
            if (!isInitialRender) {
                ForEach.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        ForEach.pop();
        List.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            List.create({
                space: 2,
                scroller: this.bottomScrollerControl
            });
            List.debugLine("pages/DetailList.ets(111:9)");
            List.width('100%');
            List.height(this.smallPhotoWidth);
            List.listDirection(Axis.Horizontal);
            List.margin({ bottom: 50 });
            List.onScroll((_, scrollState) => {
                // 惯性滑动时开始判定落点
                if (scrollState === ScrollState.Fling) {
                    this.smallRefreshCurrentIndex('scroll');
                }
            });
            List.onScrollStop(() => {
                this.smallRefreshCurrentIndex('stop');
            });
            if (!isInitialRender) {
                List.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            ForEach.create();
            const forEachItemGenFunction = (_item, index) => {
                const item = _item;
                {
                    const isLazyCreate = true;
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ListItem.create(deepRenderFunction, isLazyCreate);
                        ListItem.width('100%');
                        ListItem.height('100%');
                        ListItem.aspectRatio(1);
                        ListItem.onClick(() => {
                            if ((index >= Constants.CATCH_IMAGE_ARR.length) &&
                                (index < (this.photoList.length - Constants.CATCH_IMAGE_ARR.length))) {
                                this.setNewCurrentIndex(index - Constants.CATCH_IMAGE_ARR.length);
                            }
                        });
                        ListItem.debugLine("pages/DetailList.ets(116:13)");
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const observedShallowRender = () => {
                        this.observeComponentCreation(itemCreation);
                        ListItem.pop();
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation(itemCreation);
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Image.create(item);
                            Image.debugLine("pages/DetailList.ets(117:15)");
                            Image.objectFit(ImageFit.Cover);
                            if (!isInitialRender) {
                                Image.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        ListItem.pop();
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.updateFuncByElmtId.set(elmtId, itemCreation);
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Image.create(item);
                            Image.debugLine("pages/DetailList.ets(117:15)");
                            Image.objectFit(ImageFit.Cover);
                            if (!isInitialRender) {
                                Image.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        ListItem.pop();
                    };
                    if (isLazyCreate) {
                        observedShallowRender();
                    }
                    else {
                        observedDeepRender();
                    }
                }
            };
            this.forEachUpdateFunction(elmtId, this.photoList, forEachItemGenFunction, (_, index) => index.toString(), true, true);
            if (!isInitialRender) {
                ForEach.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        ForEach.pop();
        List.pop();
        Stack.pop();
        Navigation.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadDocument(new DetailList(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
//# sourceMappingURL=DetailList.js.map