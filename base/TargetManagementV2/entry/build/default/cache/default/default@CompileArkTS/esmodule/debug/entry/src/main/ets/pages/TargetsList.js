class TargetList extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__isListItemChangeBol = this.initializeConsume("isListItemChangeBol", "isListItemChangeBol");
        this.__targetList = new SynchedPropertyObjectTwoWayPU(params.targetList, this, "targetList");
        this.handleOpenAddDialog = undefined;
        this.__isEdit = new ObservedPropertySimplePU(false, this, "isEdit");
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.handleOpenAddDialog !== undefined) {
            this.handleOpenAddDialog = params.handleOpenAddDialog;
        }
        if (params.isEdit !== undefined) {
            this.isEdit = params.isEdit;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__targetList.purgeDependencyOnElmtId(rmElmtId);
        this.__isEdit.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isListItemChangeBol.aboutToBeDeleted();
        this.__targetList.aboutToBeDeleted();
        this.__isEdit.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get isListItemChangeBol() {
        return this.__isListItemChangeBol.get();
    }
    set isListItemChangeBol(newValue) {
        this.__isListItemChangeBol.set(newValue);
    }
    get targetList() {
        return this.__targetList.get();
    }
    set targetList(newValue) {
        this.__targetList.set(newValue);
    }
    get isEdit() {
        return this.__isEdit.get();
    }
    set isEdit(newValue) {
        this.__isEdit.set(newValue);
    }
    ListItemBuilder(targetItem, parent = null) {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.width('100%');
            Row.height(60);
            Row.backgroundColor('#fff');
            Row.padding(10);
            Row.borderRadius(10);
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.alignItems(VerticalAlign.Center);
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(targetItem.name);
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Bold);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.alignItems(HorizontalAlign.End);
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(targetItem.progress.toString() + '%');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 3 });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(`更新时间：${targetItem.lastUpdateDate}`);
            Text.fontSize(12);
            Text.fontColor('gray');
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
            Column.create();
            Column.height('100%');
            Column.width('100%');
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.SpaceBetween);
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('子目标');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.textAlign(TextAlign.Start);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('编辑');
            Text.fontColor({ "id": 16777221, "type": 10001, params: [], "bundleName": "com.example.targetmanagementv2", "moduleName": "entry" });
            Text.fontSize(13);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            List.create({ space: 10 });
            List.width('100%');
            List.margin({ top: 10 });
            if (!isInitialRender) {
                List.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const targetItem = _item;
                {
                    const isLazyCreate = true;
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ListItem.create(deepRenderFunction, isLazyCreate);
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
                        this.ListItemBuilder.bind(this)(targetItem);
                        ListItem.pop();
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.updateFuncByElmtId.set(elmtId, itemCreation);
                        this.ListItemBuilder.bind(this)(targetItem);
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
            this.forEachUpdateFunction(elmtId, this.targetList, forEachItemGenFunction, (item) => item.id.toString(), false, false);
            if (!isInitialRender) {
                ForEach.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        ForEach.pop();
        List.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Blank.create();
            if (!isInitialRender) {
                Blank.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Blank.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            if (this.isEdit) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Button.createWithLabel('添加子目标');
                        Button.backgroundColor('#e6e7ea');
                        Button.fontColor({ "id": 16777221, "type": 10001, params: [], "bundleName": "com.example.targetmanagementv2", "moduleName": "entry" });
                        Button.padding({ left: 30, right: 30 });
                        Button.onClick(() => this.handleOpenAddDialog());
                        if (!isInitialRender) {
                            Button.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Button.createWithLabel('删除');
                        Button.backgroundColor('#e6e7ea');
                        Button.fontColor('red');
                        Button.opacity(.3);
                        Button.padding({ left: 30, right: 30 });
                        if (!isInitialRender) {
                            Button.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Button.pop();
                });
            }
            if (!isInitialRender) {
                If.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export default TargetList;
//# sourceMappingURL=TargetsList.js.map