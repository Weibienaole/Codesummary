import utils from '@bundle:com.example.targetmanagementv2/entry/ets/Common/utils';
import targetDataModel from '@bundle:com.example.targetmanagementv2/entry/ets/dataModel/TargetDataModel';
import TargetList from '@bundle:com.example.targetmanagementv2/entry/ets/view/TargetsList';
import AddDialog from '@bundle:com.example.targetmanagementv2/entry/ets/view/addDialog';
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__targetList = new ObservedPropertyObjectPU(targetDataModel.getData(), this, "targetList");
        this.__isListItemChangeBol = new ObservedPropertySimplePU(false, this, "isListItemChangeBol");
        this.addProvidedVar("isListItemChangeBol", this.__isListItemChangeBol);
        this.customAddDialog = new CustomDialogController({
            builder: () => {
                let jsDialog = new AddDialog(this, {
                    onConfirm: (value) => {
                        this.saveData(value);
                    }
                });
                jsDialog.setController(this.customAddDialog);
                ViewPU.create(jsDialog);
            },
            offset: {
                dy: -5,
                dx: 0
            },
            alignment: DialogAlignment.Bottom,
            autoCancel: false,
            customStyle: true
        }, this);
        this.__total = new ObservedPropertySimplePU(0, this, "total");
        this.__doneTotal = new ObservedPropertySimplePU(0, this, "doneTotal");
        this.__lastUpdateDate = new ObservedPropertySimplePU('', this, "lastUpdateDate");
        this.setInitiallyProvidedValue(params);
        this.declareWatch("isListItemChangeBol", this.onItemChange);
    }
    setInitiallyProvidedValue(params) {
        if (params.targetList !== undefined) {
            this.targetList = params.targetList;
        }
        if (params.isListItemChangeBol !== undefined) {
            this.isListItemChangeBol = params.isListItemChangeBol;
        }
        if (params.customAddDialog !== undefined) {
            this.customAddDialog = params.customAddDialog;
        }
        if (params.total !== undefined) {
            this.total = params.total;
        }
        if (params.doneTotal !== undefined) {
            this.doneTotal = params.doneTotal;
        }
        if (params.lastUpdateDate !== undefined) {
            this.lastUpdateDate = params.lastUpdateDate;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__targetList.purgeDependencyOnElmtId(rmElmtId);
        this.__total.purgeDependencyOnElmtId(rmElmtId);
        this.__doneTotal.purgeDependencyOnElmtId(rmElmtId);
        this.__lastUpdateDate.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__targetList.aboutToBeDeleted();
        this.__isListItemChangeBol.aboutToBeDeleted();
        this.__total.aboutToBeDeleted();
        this.__doneTotal.aboutToBeDeleted();
        this.__lastUpdateDate.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get targetList() {
        return this.__targetList.get();
    }
    set targetList(newValue) {
        this.__targetList.set(newValue);
    }
    get isListItemChangeBol() {
        return this.__isListItemChangeBol.get();
    }
    set isListItemChangeBol(newValue) {
        this.__isListItemChangeBol.set(newValue);
    }
    get total() {
        return this.__total.get();
    }
    set total(newValue) {
        this.__total.set(newValue);
    }
    get doneTotal() {
        return this.__doneTotal.get();
    }
    set doneTotal(newValue) {
        this.__doneTotal.set(newValue);
    }
    get lastUpdateDate() {
        return this.__lastUpdateDate.get();
    }
    set lastUpdateDate(newValue) {
        this.__lastUpdateDate.set(newValue);
    }
    aboutToAppear() {
        targetDataModel.setMockData();
    }
    onItemChange() {
        this.total = this.targetList.length;
        this.doneTotal = this.targetList.filter(item => item.progress === 100).length;
        this.lastUpdateDate = utils.getNow();
    }
    handleOpenAddDialog() {
        this.customAddDialog.open();
    }
    saveData(value) {
        targetDataModel.addData(value);
        this.targetList = targetDataModel.getData();
        this.isListItemChangeBol = !this.isListItemChangeBol;
        this.customAddDialog.close();
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/Index.ets(52:5)");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#f1f2f5');
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/Index.ets(53:7)");
            __Column__normalColumnContainerSty();
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('工作目标');
            Text.debugLine("pages/Index.ets(54:9)");
            Text.fontSize(25);
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
            Column.create();
            Column.debugLine("pages/Index.ets(55:9)");
            Column.width('100%');
            Column.backgroundColor('#ffffff');
            Column.borderRadius(15);
            Column.padding(15);
            Column.margin({ top: 15 });
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.debugLine("pages/Index.ets(56:11)");
            Row.height(90);
            Row.width('100%');
            Row.margin({ bottom: 10 });
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create({ "id": 16777224, "type": 20000, params: [], "bundleName": "com.example.targetmanagementv2", "moduleName": "entry" });
            Image.debugLine("pages/Index.ets(57:13)");
            Image.clip(true);
            Image.objectFit(ImageFit.Cover);
            Image.height('100%');
            Image.aspectRatio(1);
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/Index.ets(58:13)");
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Start);
            Column.padding({ left: 15 });
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('第一季度运营目标');
            Text.debugLine("pages/Index.ets(59:15)");
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('实现用户量与用户活跃是提升');
            Text.debugLine("pages/Index.ets(60:15)");
            Text.fontSize(15);
            Text.fontColor('gray');
            Text.margin({ top: 10 });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.debugLine("pages/Index.ets(64:11)");
            Row.width('100%');
            Row.height(50);
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.alignItems(VerticalAlign.Center);
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/Index.ets(65:13)");
            Column.alignItems(HorizontalAlign.Start);
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('整体进度');
            Text.debugLine("pages/Index.ets(66:15)");
            Text.fontWeight(FontWeight.Bold);
            Text.fontSize(15);
            Text.margin({ bottom: 3 });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(`更新时间：${this.lastUpdateDate || '----'}`);
            Text.debugLine("pages/Index.ets(67:15)");
            Text.fontColor('gray');
            Text.fontSize(14);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Stack.create();
            Stack.debugLine("pages/Index.ets(70:13)");
            if (!isInitialRender) {
                Stack.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Progress.create({ value: (this.doneTotal / this.total) * 100, type: ProgressType.Ring });
            Progress.debugLine("pages/Index.ets(71:15)");
            Progress.height('90%');
            if (!isInitialRender) {
                Progress.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create();
            Text.debugLine("pages/Index.ets(72:15)");
            Text.fontSize(14);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Span.create(this.doneTotal.toString());
            Span.debugLine("pages/Index.ets(73:17)");
            Span.fontColor({ "id": 16777222, "type": 10001, params: [], "bundleName": "com.example.targetmanagementv2", "moduleName": "entry" });
            if (!isInitialRender) {
                Span.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Span.create('/');
            Span.debugLine("pages/Index.ets(74:17)");
            if (!isInitialRender) {
                Span.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Span.create(this.total.toString());
            Span.debugLine("pages/Index.ets(75:17)");
            if (!isInitialRender) {
                Span.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Stack.pop();
        Row.pop();
        Column.pop();
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/Index.ets(87:7)");
            __Column__normalColumnContainerSty();
            Column.height('67%');
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        {
            this.observeComponentCreation((elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                if (isInitialRender) {
                    ViewPU.create(new TargetList(this, {
                        targetList: this.__targetList,
                        handleOpenAddDialog: () => this.handleOpenAddDialog()
                    }, undefined, elmtId));
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
                ViewStackProcessor.StopGetAccessRecording();
            });
        }
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
function __Column__normalColumnContainerSty() {
    Column.width('100%');
    Column.alignItems(HorizontalAlign.Start);
    Column.padding({ left: 15, right: 15, top: 15 });
}
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadDocument(new Index(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
//# sourceMappingURL=Index.js.map