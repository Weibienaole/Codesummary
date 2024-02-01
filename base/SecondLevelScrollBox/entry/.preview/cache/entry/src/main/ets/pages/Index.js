import classiftModel from '@bundle:com.example.secondlevelscrollbox/entry/ets/mock/index';
const TIMER = 100;
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__isLoad = new ObservedPropertySimplePU(true, this, "isLoad");
        this.__list = new ObservedPropertyObjectPU([], this, "list");
        this.__currentFirstLevelIndex = new ObservedPropertySimplePU(0, this, "currentFirstLevelIndex");
        this.scrollerControl = new Scroller();
        this.firstLevelScrollerControl = new Scroller();
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.isLoad !== undefined) {
            this.isLoad = params.isLoad;
        }
        if (params.list !== undefined) {
            this.list = params.list;
        }
        if (params.currentFirstLevelIndex !== undefined) {
            this.currentFirstLevelIndex = params.currentFirstLevelIndex;
        }
        if (params.scrollerControl !== undefined) {
            this.scrollerControl = params.scrollerControl;
        }
        if (params.firstLevelScrollerControl !== undefined) {
            this.firstLevelScrollerControl = params.firstLevelScrollerControl;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isLoad.purgeDependencyOnElmtId(rmElmtId);
        this.__list.purgeDependencyOnElmtId(rmElmtId);
        this.__currentFirstLevelIndex.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isLoad.aboutToBeDeleted();
        this.__list.aboutToBeDeleted();
        this.__currentFirstLevelIndex.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get isLoad() {
        return this.__isLoad.get();
    }
    set isLoad(newValue) {
        this.__isLoad.set(newValue);
    }
    get list() {
        return this.__list.get();
    }
    set list(newValue) {
        this.__list.set(newValue);
    }
    get currentFirstLevelIndex() {
        return this.__currentFirstLevelIndex.get();
    }
    set currentFirstLevelIndex(newValue) {
        this.__currentFirstLevelIndex.set(newValue);
    }
    aboutToAppear() {
        this.loadData();
    }
    loadData() {
        load().then(res => {
            this.list = res;
            this.isLoad = false;
        });
        function load() {
            return new Promise((res, rej) => {
                const timer = setTimeout(() => {
                    const mockList = classiftModel.getMockData();
                    res(mockList);
                    clearTimeout(timer);
                }, TIMER);
            });
        }
    }
    scrollToCurrent(index, isFirstLevelClick) {
        this.currentFirstLevelIndex = index;
        if (isFirstLevelClick) {
            this.scrollerControl.scrollToIndex(index);
        }
        else {
            // this.firstLevelScrollerControl.scrollToIndex(index)
        }
    }
    listGroupItemHeaderBuilder(item, parent = null) {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.debugLine("pages/Index.ets(48:5)");
            Row.width('100%');
            Row.height(60);
            Row.alignItems(VerticalAlign.Center);
            Row.backgroundColor({ "id": 16777222, "type": 10001, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" });
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(item.title);
            Text.debugLine("pages/Index.ets(49:7)");
            Text.fontSize(16);
            Text.fontColor({ "id": 16777223, "type": 10001, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Row.pop();
    }
    secondLevelItemBuilder(item, parent = null) {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.debugLine("pages/Index.ets(55:5)");
            Row.width('100%');
            Row.height(90);
            Row.backgroundColor({ "id": 16777227, "type": 10001, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" });
            Row.borderRadius(10);
            Row.clip(true);
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create(item.icon);
            Image.debugLine("pages/Index.ets(56:7)");
            Image.height('100%');
            Image.aspectRatio(1);
            Image.objectFit(ImageFit.Cover);
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/Index.ets(57:7)");
            Column.height('100%');
            Column.alignItems(HorizontalAlign.Start);
            Column.justifyContent(FlexAlign.SpaceBetween);
            Column.padding(12);
            Column.layoutWeight(1);
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(item.name);
            Text.debugLine("pages/Index.ets(58:9)");
            Text.width('100%');
            Text.fontSize(14);
            Text.fontColor({ "id": 16777223, "type": 10001, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            Text.maxLines(2);
            Text.textOverflow({ overflow: TextOverflow.Clip });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(item.price ? `￥${item.price}` : '免费');
            Text.debugLine("pages/Index.ets(65:9)");
            Text.fontSize(14);
            Text.fontColor({ "id": 16777226, "type": 10001, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" });
            Text.fontWeight(FontWeight.Bold);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            if (this.isLoad) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Column.create();
                        Column.debugLine("pages/Index.ets(86:7)");
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                        if (!isInitialRender) {
                            Column.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create('loading...');
                        Text.debugLine("pages/Index.ets(87:9)");
                        Text.fontSize(30);
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Row.create();
                        Row.debugLine("pages/Index.ets(90:7)");
                        Row.width('100%');
                        if (!isInitialRender) {
                            Row.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        List.create({ scroller: this.firstLevelScrollerControl });
                        List.debugLine("pages/Index.ets(91:9)");
                        List.height('100%');
                        List.layoutWeight(1);
                        List.backgroundColor({ "id": 16777224, "type": 10001, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" });
                        if (!isInitialRender) {
                            List.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index) => {
                            const group = _item;
                            {
                                const isLazyCreate = true;
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, isLazyCreate);
                                    ListItem.debugLine("pages/Index.ets(93:13)");
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
                                    {
                                        this.observeComponentCreation((elmtId, isInitialRender) => {
                                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                            if (isInitialRender) {
                                                ViewPU.create(new FirstLevelItemBuilder(this, {
                                                    item: JSON.stringify(group),
                                                    isSelect: index === this.currentFirstLevelIndex,
                                                    clickItem: () => {
                                                        this.scrollToCurrent(index, true);
                                                    }
                                                }, undefined, elmtId));
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                                    item: JSON.stringify(group),
                                                    isSelect: index === this.currentFirstLevelIndex
                                                });
                                            }
                                            ViewStackProcessor.StopGetAccessRecording();
                                        });
                                    }
                                    ListItem.pop();
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.updateFuncByElmtId.set(elmtId, itemCreation);
                                    {
                                        this.observeComponentCreation((elmtId, isInitialRender) => {
                                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                            if (isInitialRender) {
                                                ViewPU.create(new FirstLevelItemBuilder(this, {
                                                    item: JSON.stringify(group),
                                                    isSelect: index === this.currentFirstLevelIndex,
                                                    clickItem: () => {
                                                        this.scrollToCurrent(index, true);
                                                    }
                                                }, undefined, elmtId));
                                            }
                                            else {
                                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                                    item: JSON.stringify(group),
                                                    isSelect: index === this.currentFirstLevelIndex
                                                });
                                            }
                                            ViewStackProcessor.StopGetAccessRecording();
                                        });
                                    }
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
                        this.forEachUpdateFunction(elmtId, this.list, forEachItemGenFunction, group => group.fid.toString(), true, false);
                        if (!isInitialRender) {
                            ForEach.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    ForEach.pop();
                    List.pop();
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        List.create({ scroller: this.scrollerControl });
                        List.debugLine("pages/Index.ets(105:9)");
                        List.height('100%');
                        List.layoutWeight(3);
                        List.backgroundColor({ "id": 16777222, "type": 10001, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" });
                        List.padding({ left: 20, right: 20 });
                        List.sticky(StickyStyle.Header);
                        List.onScrollIndex((start) => this.scrollToCurrent(start, false));
                        if (!isInitialRender) {
                            List.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const group = _item;
                            this.observeComponentCreation((elmtId, isInitialRender) => {
                                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                ListItemGroup.create({ header: this.listGroupItemHeaderBuilder.bind(this, group), space: 10 });
                                ListItemGroup.debugLine("pages/Index.ets(107:13)");
                                if (!isInitialRender) {
                                    ListItemGroup.pop();
                                }
                                ViewStackProcessor.StopGetAccessRecording();
                            });
                            this.observeComponentCreation((elmtId, isInitialRender) => {
                                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                ForEach.create();
                                const forEachItemGenFunction = _item => {
                                    const item = _item;
                                    {
                                        const isLazyCreate = true;
                                        const itemCreation = (elmtId, isInitialRender) => {
                                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                            ListItem.create(deepRenderFunction, isLazyCreate);
                                            ListItem.debugLine("pages/Index.ets(109:17)");
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
                                            this.secondLevelItemBuilder.bind(this)(item);
                                            ListItem.pop();
                                        };
                                        const deepRenderFunction = (elmtId, isInitialRender) => {
                                            itemCreation(elmtId, isInitialRender);
                                            this.updateFuncByElmtId.set(elmtId, itemCreation);
                                            this.secondLevelItemBuilder.bind(this)(item);
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
                                this.forEachUpdateFunction(elmtId, group.childs, forEachItemGenFunction, (item) => item.id.toString(), false, false);
                                if (!isInitialRender) {
                                    ForEach.pop();
                                }
                                ViewStackProcessor.StopGetAccessRecording();
                            });
                            ForEach.pop();
                            ListItemGroup.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.list, forEachItemGenFunction, (group) => group.fid.toString(), false, false);
                        if (!isInitialRender) {
                            ForEach.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    ForEach.pop();
                    List.pop();
                    Row.pop();
                });
            }
            if (!isInitialRender) {
                If.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        If.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
class FirstLevelItemBuilder extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__item = new SynchedPropertySimpleOneWayPU(params.item, this, "item");
        this.__isSelect = new SynchedPropertySimpleOneWayPU(params.isSelect, this, "isSelect");
        this.clickItem = undefined;
        this.__parseItem = new ObservedPropertyObjectPU(null, this, "parseItem");
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.clickItem !== undefined) {
            this.clickItem = params.clickItem;
        }
        if (params.parseItem !== undefined) {
            this.parseItem = params.parseItem;
        }
    }
    updateStateVars(params) {
        this.__item.reset(params.item);
        this.__isSelect.reset(params.isSelect);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__item.purgeDependencyOnElmtId(rmElmtId);
        this.__isSelect.purgeDependencyOnElmtId(rmElmtId);
        this.__parseItem.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__item.aboutToBeDeleted();
        this.__isSelect.aboutToBeDeleted();
        this.__parseItem.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get item() {
        return this.__item.get();
    }
    set item(newValue) {
        this.__item.set(newValue);
    }
    get isSelect() {
        return this.__isSelect.get();
    }
    set isSelect(newValue) {
        this.__isSelect.set(newValue);
    }
    get parseItem() {
        return this.__parseItem.get();
    }
    set parseItem(newValue) {
        this.__parseItem.set(newValue);
    }
    aboutToAppear() {
        this.parseItem = JSON.parse(this.item);
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.debugLine("pages/Index.ets(141:5)");
            Row.width('100%');
            Row.height(60);
            Row.backgroundColor(this.isSelect ? { "id": 16777222, "type": 10001, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" } : '');
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.Center);
            Row.onClick(this.clickItem);
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.parseItem.title);
            Text.debugLine("pages/Index.ets(142:7)");
            Text.fontSize(14);
            Text.fontWeight(this.isSelect ? FontWeight.Bold : FontWeight.Normal);
            Text.fontColor(this.isSelect ? { "id": 16777223, "type": 10001, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" } : { "id": 16777225, "type": 10001, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadDocument(new Index(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
//# sourceMappingURL=Index.js.map