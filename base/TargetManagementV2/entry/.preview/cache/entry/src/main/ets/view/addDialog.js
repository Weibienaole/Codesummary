import promptAction from '@ohos:promptAction';
export default class AddDialog extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.onConfirm = undefined;
        this.controller = undefined;
        this.__inputVal = new ObservedPropertySimplePU('', this, "inputVal");
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.onConfirm !== undefined) {
            this.onConfirm = params.onConfirm;
        }
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
        if (params.inputVal !== undefined) {
            this.inputVal = params.inputVal;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__inputVal.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__inputVal.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    setController(ctr) {
        this.controller = ctr;
    }
    get inputVal() {
        return this.__inputVal.get();
    }
    set inputVal(newValue) {
        this.__inputVal.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("view/addDialog.ets(9:5)");
            Column.width('90.3%');
            Column.backgroundColor('#ffffff');
            Column.borderRadius(15);
            Column.padding({ left: 15, right: 15, top: 10, bottom: 10 });
            Column.alignItems(HorizontalAlign.Start);
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('添加子目标');
            Text.debugLine("view/addDialog.ets(10:7)");
            Text.fontWeight(FontWeight.Bold);
            Text.fontSize(16);
            Text.margin({ bottom: 15 });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            TextInput.create({ placeholder: '请输入...' });
            TextInput.debugLine("view/addDialog.ets(11:7)");
            TextInput.backgroundColor('#f1f2f5');
            TextInput.borderRadius(15);
            TextInput.width('100%');
            TextInput.padding(10);
            TextInput.fontSize(13);
            TextInput.onChange(value => {
                this.inputVal = value;
            });
            if (!isInitialRender) {
                TextInput.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.debugLine("view/addDialog.ets(20:7)");
            Row.width('100%');
            Row.justifyContent(FlexAlign.Center);
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel('取消');
            Button.debugLine("view/addDialog.ets(21:9)");
            __Button__normalBtnSty();
            Button.onClick(() => {
                this.controller.close();
            });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel('确认');
            Button.debugLine("view/addDialog.ets(24:9)");
            __Button__normalBtnSty();
            Button.onClick(() => {
                if (this.inputVal === '') {
                    promptAction.showToast({
                        message: '内容不能为空',
                        duration: 2000,
                        bottom: 60
                    });
                    return;
                }
                this.onConfirm(this.inputVal);
            });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
function __Button__normalBtnSty() {
    Button.width('40%');
    Button.backgroundColor('#00ffffff');
    Button.fontColor({ "id": 16777222, "type": 10001, params: [], "bundleName": "com.example.targetmanagementv2", "moduleName": "entry" });
    Button.fontSize(15);
    Button.fontWeight(FontWeight.Bold);
}
//# sourceMappingURL=addDialog.js.map