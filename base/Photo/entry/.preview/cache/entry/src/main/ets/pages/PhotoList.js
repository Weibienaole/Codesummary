import router from '@ohos:router';
class PhotoList extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.photoArr = router.getParams()['photoArr'];
        this.__message = new ObservedPropertySimplePU('Hello World', this, "message");
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.photoArr !== undefined) {
            this.photoArr = params.photoArr;
        }
        if (params.message !== undefined) {
            this.message = params.message;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__message.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__message.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get message() {
        return this.__message.get();
    }
    set message(newValue) {
        this.__message.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Navigation.create();
            Navigation.debugLine("pages/PhotoList.ets(10:5)");
            Navigation.title('电子相册');
            Navigation.titleMode(NavigationTitleMode.Mini);
            if (!isInitialRender) {
                Navigation.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Grid.create();
            Grid.debugLine("pages/PhotoList.ets(11:7)");
            Grid.columnsTemplate('1fr 1fr 1fr 1fr');
            Grid.columnsGap(2);
            Grid.rowsGap(2);
            if (!isInitialRender) {
                Grid.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            ForEach.create();
            const forEachItemGenFunction = (_item, index) => {
                const photo = _item;
                {
                    const isLazyCreate = true && (Grid.willUseProxy() === true);
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        GridItem.create(deepRenderFunction, isLazyCreate);
                        GridItem.width('100%');
                        GridItem.aspectRatio(1);
                        GridItem.debugLine("pages/PhotoList.ets(13:11)");
                        if (!isInitialRender) {
                            GridItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const observedShallowRender = () => {
                        this.observeComponentCreation(itemCreation);
                        GridItem.pop();
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation(itemCreation);
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Image.create(photo);
                            Image.debugLine("pages/PhotoList.ets(14:13)");
                            Image.width('100%');
                            Image.height('100%');
                            Image.objectFit(ImageFit.Cover);
                            Image.onClick(() => {
                                router.pushUrl({
                                    url: 'pages/DetailList',
                                    params: {
                                        photoList: this.photoArr,
                                        currentIndex: index
                                    }
                                });
                            });
                            if (!isInitialRender) {
                                Image.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        GridItem.pop();
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.updateFuncByElmtId.set(elmtId, itemCreation);
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Image.create(photo);
                            Image.debugLine("pages/PhotoList.ets(14:13)");
                            Image.width('100%');
                            Image.height('100%');
                            Image.objectFit(ImageFit.Cover);
                            Image.onClick(() => {
                                router.pushUrl({
                                    url: 'pages/DetailList',
                                    params: {
                                        photoList: this.photoArr,
                                        currentIndex: index
                                    }
                                });
                            });
                            if (!isInitialRender) {
                                Image.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        GridItem.pop();
                    };
                    if (isLazyCreate) {
                        observedShallowRender();
                    }
                    else {
                        observedDeepRender();
                    }
                }
            };
            this.forEachUpdateFunction(elmtId, this.photoArr, forEachItemGenFunction, (_, index) => index.toString(), true, true);
            if (!isInitialRender) {
                ForEach.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        ForEach.pop();
        Grid.pop();
        Navigation.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadDocument(new PhotoList(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
//# sourceMappingURL=PhotoList.js.map