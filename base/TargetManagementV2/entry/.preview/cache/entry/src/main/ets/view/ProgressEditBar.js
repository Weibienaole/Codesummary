class ProgressEditBar extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.onConfirm = undefined;
        this.onCancel = undefined;
        this.__long = new SynchedPropertySimpleOneWayPU(params.long, this, "long");
        this.__isActived = new SynchedPropertySimpleOneWayPU(params.isActived, this, "isActived");
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.onConfirm !== undefined) {
            this.onConfirm = params.onConfirm;
        }
        if (params.onCancel !== undefined) {
            this.onCancel = params.onCancel;
        }
        if (params.long !== undefined) {
            this.__long.set(params.long);
        }
        else {
            this.__long.set(0);
        }
    }
    updateStateVars(params) {
        this.__long.reset(params.long);
        this.__isActived.reset(params.isActived);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__long.purgeDependencyOnElmtId(rmElmtId);
        this.__isActived.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__long.aboutToBeDeleted();
        this.__isActived.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get long() {
        return this.__long.get();
    }
    set long(newValue) {
        this.__long.set(newValue);
    }
    get isActived() {
        return this.__isActived.get();
    }
    set isActived(newValue) {
        this.__isActived.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("view/ProgressEditBar.ets(10:5)");
            Column.width('100%');
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.debugLine("view/ProgressEditBar.ets(11:7)");
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Slider.create({
                value: this.long,
                style: SliderStyle.InSet
            });
            Slider.debugLine("view/ProgressEditBar.ets(12:9)");
            Slider.width('80%');
            Slider.clip(true);
            Slider.enabled(this.isActived);
            Slider.onChange((long) => {
                this.long = Number(long.toFixed());
            });
            if (!isInitialRender) {
                Slider.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.debugLine("view/ProgressEditBar.ets(19:9)");
            Row.width(40);
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(`${this.long}%`);
            Text.debugLine("view/ProgressEditBar.ets(20:11)");
            Text.fontSize(14);
            Text.margin({ left: 5 });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Row.pop();
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.debugLine("view/ProgressEditBar.ets(24:7)");
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceEvenly);
            Row.margin({ top: 10 });
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        {
            this.observeComponentCreation((elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                if (isInitialRender) {
                    ViewPU.create(new NormalButton(this, {
                        value: '取消',
                        handleClickBtn: () => {
                            this.onCancel();
                        }
                    }, undefined, elmtId));
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        value: '取消'
                    });
                }
                ViewStackProcessor.StopGetAccessRecording();
            });
        }
        {
            this.observeComponentCreation((elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                if (isInitialRender) {
                    ViewPU.create(new NormalButton(this, {
                        value: '确定',
                        handleClickBtn: () => {
                            this.onConfirm(this.long);
                        }
                    }, undefined, elmtId));
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        value: '确定'
                    });
                }
                ViewStackProcessor.StopGetAccessRecording();
            });
        }
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export default ProgressEditBar;
class NormalButton extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__value = new SynchedPropertySimpleOneWayPU(params.value, this, "value");
        this.handleClickBtn = undefined;
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.handleClickBtn !== undefined) {
            this.handleClickBtn = params.handleClickBtn;
        }
    }
    updateStateVars(params) {
        this.__value.reset(params.value);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__value.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__value.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get value() {
        return this.__value.get();
    }
    set value(newValue) {
        this.__value.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.value);
            Text.debugLine("view/ProgressEditBar.ets(50:5)");
            Text.fontColor({ "id": 16777222, "type": 10001, params: [], "bundleName": "com.example.targetmanagementv2", "moduleName": "entry" });
            Text.fontSize(14);
            Text.onClick(() => {
                this.handleClickBtn();
            });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
//# sourceMappingURL=ProgressEditBar.js.map