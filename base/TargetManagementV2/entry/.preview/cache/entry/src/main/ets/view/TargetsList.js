import targetDataModel from '@bundle:com.example.targetmanagementv2/entry/ets/dataModel/TargetDataModel';
import ProgressEditBar from '@bundle:com.example.targetmanagementv2/entry/ets/view/ProgressEditBar';
class TargetList extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__isListItemChangeBol = this.initializeConsume("isListItemChangeBol", "isListItemChangeBol");
        this.__targetList = new SynchedPropertyObjectTwoWayPU(params.targetList, this, "targetList");
        this.handleOpenAddDialog = undefined;
        this.__isEdit = new ObservedPropertySimplePU(false, this, "isEdit");
        this.__isSelectAll = new ObservedPropertySimplePU(false, this, "isSelectAll");
        this.__selectItems = new ObservedPropertyObjectPU([], this, "selectItems");
        this.__openCurrentTarget = new ObservedPropertySimplePU(-1, this, "openCurrentTarget");
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.handleOpenAddDialog !== undefined) {
            this.handleOpenAddDialog = params.handleOpenAddDialog;
        }
        if (params.isEdit !== undefined) {
            this.isEdit = params.isEdit;
        }
        if (params.isSelectAll !== undefined) {
            this.isSelectAll = params.isSelectAll;
        }
        if (params.selectItems !== undefined) {
            this.selectItems = params.selectItems;
        }
        if (params.openCurrentTarget !== undefined) {
            this.openCurrentTarget = params.openCurrentTarget;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__targetList.purgeDependencyOnElmtId(rmElmtId);
        this.__isEdit.purgeDependencyOnElmtId(rmElmtId);
        this.__isSelectAll.purgeDependencyOnElmtId(rmElmtId);
        this.__selectItems.purgeDependencyOnElmtId(rmElmtId);
        this.__openCurrentTarget.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isListItemChangeBol.aboutToBeDeleted();
        this.__targetList.aboutToBeDeleted();
        this.__isEdit.aboutToBeDeleted();
        this.__isSelectAll.aboutToBeDeleted();
        this.__selectItems.aboutToBeDeleted();
        this.__openCurrentTarget.aboutToBeDeleted();
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
    get isSelectAll() {
        return this.__isSelectAll.get();
    }
    set isSelectAll(newValue) {
        this.__isSelectAll.set(newValue);
    }
    get selectItems() {
        return this.__selectItems.get();
    }
    set selectItems(newValue) {
        this.__selectItems.set(newValue);
    }
    get openCurrentTarget() {
        return this.__openCurrentTarget.get();
    }
    set openCurrentTarget(newValue) {
        this.__openCurrentTarget.set(newValue);
    }
    setEdit(bol) {
        this.isEdit = bol;
    }
    handleDeleteItems() {
        targetDataModel.deleteData(this.selectItems);
        this.targetList = targetDataModel.getData();
        this.isEdit = false;
        this.isSelectAll = false;
        this.isListItemChangeBol = !this.isListItemChangeBol;
    }
    handleSetItem(long, id) {
        targetDataModel.setDataLong(long, id);
        this.targetList = targetDataModel.getData();
        this.openCurrentTarget = -1;
        this.isListItemChangeBol = !this.isListItemChangeBol;
    }
    ListItemBuilder(targetItem, parent = null) {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.debugLine("view/TargetsList.ets(38:5)");
            Row.width('100%');
            Row.borderRadius(10);
            Row.padding(10);
            Row.clip(true);
            __Row__itemTheme(targetItem.progress === 100, this.selectItems.indexOf(targetItem.id.toString()) !== -1);
            Row.onClick(() => {
                if (this.isEdit)
                    return;
                this.openCurrentTarget = this.openCurrentTarget === targetItem.id ? -1 : targetItem.id;
            });
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("view/TargetsList.ets(39:7)");
            Context.animation({ duration: 250 });
            Column.width(this.isEdit ? '90%' : '100%');
            Column.height(this.openCurrentTarget === targetItem.id ? 120 : 45);
            Context.animation(null);
            Column.alignItems(HorizontalAlign.Start);
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.debugLine("view/TargetsList.ets(40:9)");
            Row.width('100%');
            Row.height(45);
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
            Text.debugLine("view/TargetsList.ets(41:11)");
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
            Row.create();
            Row.debugLine("view/TargetsList.ets(42:11)");
            Row.justifyContent(FlexAlign.End);
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("view/TargetsList.ets(43:13)");
            Column.alignItems(HorizontalAlign.End);
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(targetItem.progress.toString() + '%');
            Text.debugLine("view/TargetsList.ets(44:15)");
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
            Text.debugLine("view/TargetsList.ets(45:15)");
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
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            //   progress
            Blank.create();
            Blank.debugLine("view/TargetsList.ets(53:9)");
            if (!isInitialRender) {
                //   progress
                Blank.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        //   progress
        Blank.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            if (this.openCurrentTarget === targetItem.id) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            if (isInitialRender) {
                                ViewPU.create(new ProgressEditBar(this, {
                                    isActived: !this.isEdit,
                                    long: targetItem.progress,
                                    onConfirm: long => this.handleSetItem(long, targetItem.id),
                                    onCancel: () => {
                                        this.openCurrentTarget = -1;
                                    }
                                }, undefined, elmtId));
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    isActived: !this.isEdit,
                                    long: targetItem.progress
                                });
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
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
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            if (this.isEdit) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Row.create();
                        Row.debugLine("view/TargetsList.ets(71:9)");
                        Row.margin({ left: 10, right: 10 });
                        if (!isInitialRender) {
                            Row.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Checkbox.create({ name: `checkItem_${targetItem.id}`, group: 'targetsGroup' });
                        Checkbox.debugLine("view/TargetsList.ets(72:11)");
                        if (!isInitialRender) {
                            Checkbox.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Checkbox.pop();
                    Row.pop();
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
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("view/TargetsList.ets(88:5)");
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
            Row.debugLine("view/TargetsList.ets(89:7)");
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
            Text.debugLine("view/TargetsList.ets(90:9)");
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
            If.create();
            if (this.targetList.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Row.create();
                        Row.debugLine("view/TargetsList.ets(92:11)");
                        if (!isInitialRender) {
                            Row.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        If.create();
                        if (this.isEdit) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    Text.create('取消');
                                    Text.debugLine("view/TargetsList.ets(94:15)");
                                    Text.fontColor({ "id": 16777222, "type": 10001, params: [], "bundleName": "com.example.targetmanagementv2", "moduleName": "entry" });
                                    Text.fontSize(13);
                                    Text.onClick(() => this.setEdit(false));
                                    if (!isInitialRender) {
                                        Text.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                });
                                Text.pop();
                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    Row.create();
                                    Row.debugLine("view/TargetsList.ets(95:15)");
                                    Row.alignItems(VerticalAlign.Center);
                                    Row.margin({ left: 5 });
                                    if (!isInitialRender) {
                                        Row.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                });
                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    Text.create('全选');
                                    Text.debugLine("view/TargetsList.ets(96:17)");
                                    Text.fontColor({ "id": 16777222, "type": 10001, params: [], "bundleName": "com.example.targetmanagementv2", "moduleName": "entry" });
                                    Text.fontSize(13);
                                    if (!isInitialRender) {
                                        Text.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                });
                                Text.pop();
                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    CheckboxGroup.create({ group: 'targetsGroup' });
                                    CheckboxGroup.debugLine("view/TargetsList.ets(97:17)");
                                    CheckboxGroup.selectAll(this.isSelectAll);
                                    CheckboxGroup.onChange((e) => {
                                        // checkItem_0 -> 0
                                        this.selectItems = e.name.map(item => item.split('_')[1]);
                                    });
                                    CheckboxGroup.width(15);
                                    if (!isInitialRender) {
                                        CheckboxGroup.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                });
                                CheckboxGroup.pop();
                                Row.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    Text.create('编辑');
                                    Text.debugLine("view/TargetsList.ets(103:15)");
                                    Text.fontColor({ "id": 16777222, "type": 10001, params: [], "bundleName": "com.example.targetmanagementv2", "moduleName": "entry" });
                                    Text.fontSize(13);
                                    Text.onClick(() => this.setEdit(true));
                                    if (!isInitialRender) {
                                        Text.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                });
                                Text.pop();
                            });
                        }
                        if (!isInitialRender) {
                            If.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    If.pop();
                    Row.pop();
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
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            List.create({ space: 10 });
            List.debugLine("view/TargetsList.ets(109:7)");
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
                        ListItem.debugLine("view/TargetsList.ets(111:11)");
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
            this.forEachUpdateFunction(elmtId, this.targetList, forEachItemGenFunction, (item) => JSON.stringify(item), false, false);
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
            Blank.debugLine("view/TargetsList.ets(117:7)");
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
                        Button.createWithLabel('删除');
                        Button.debugLine("view/TargetsList.ets(119:9)");
                        Button.backgroundColor('#e6e7ea');
                        Button.fontColor('red');
                        Button.opacity(this.selectItems.length > 0 ? 1 : .3);
                        Button.padding({ left: 30, right: 30 });
                        Button.onClick(() => this.handleDeleteItems());
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
                        Button.createWithLabel('添加子目标');
                        Button.debugLine("view/TargetsList.ets(126:9)");
                        Button.backgroundColor('#e6e7ea');
                        Button.fontColor({ "id": 16777222, "type": 10001, params: [], "bundleName": "com.example.targetmanagementv2", "moduleName": "entry" });
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
function __Row__itemTheme(isDone, isSelect) {
    Row.opacity(isDone ? .4 : 1);
    Row.backgroundColor(isSelect ? '#1A007DFF' : '#fff');
}
export default TargetList;
//# sourceMappingURL=TargetsList.js.map