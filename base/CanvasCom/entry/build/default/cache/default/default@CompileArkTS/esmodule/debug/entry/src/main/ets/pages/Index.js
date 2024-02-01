import window from '@ohos:window';
import hilog from '@ohos:hilog';
import DrawModel from '@bundle:com.example.canvascom/entry/ets/DrawModel/drawModel';
const context = getContext(this);
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.canvasSettings = new RenderingContextSettings(true);
        this.canvasContext = new CanvasRenderingContext2D(this.canvasSettings);
        this.__screenWidth = new ObservedPropertySimplePU(0, this, "screenWidth");
        this.__screenHeight = new ObservedPropertySimplePU(0, this, "screenHeight");
        this.__drawModel = new ObservedPropertyObjectPU(new DrawModel(), this, "drawModel");
        this.__enableFlag = new ObservedPropertySimplePU(true, this, "enableFlag");
        this.__rotateDegree = new ObservedPropertySimplePU(0, this, "rotateDegree");
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.canvasSettings !== undefined) {
            this.canvasSettings = params.canvasSettings;
        }
        if (params.canvasContext !== undefined) {
            this.canvasContext = params.canvasContext;
        }
        if (params.screenWidth !== undefined) {
            this.screenWidth = params.screenWidth;
        }
        if (params.screenHeight !== undefined) {
            this.screenHeight = params.screenHeight;
        }
        if (params.drawModel !== undefined) {
            this.drawModel = params.drawModel;
        }
        if (params.enableFlag !== undefined) {
            this.enableFlag = params.enableFlag;
        }
        if (params.rotateDegree !== undefined) {
            this.rotateDegree = params.rotateDegree;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__screenWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__screenHeight.purgeDependencyOnElmtId(rmElmtId);
        this.__drawModel.purgeDependencyOnElmtId(rmElmtId);
        this.__enableFlag.purgeDependencyOnElmtId(rmElmtId);
        this.__rotateDegree.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__screenWidth.aboutToBeDeleted();
        this.__screenHeight.aboutToBeDeleted();
        this.__drawModel.aboutToBeDeleted();
        this.__enableFlag.aboutToBeDeleted();
        this.__rotateDegree.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get screenWidth() {
        return this.__screenWidth.get();
    }
    set screenWidth(newValue) {
        this.__screenWidth.set(newValue);
    }
    get screenHeight() {
        return this.__screenHeight.get();
    }
    set screenHeight(newValue) {
        this.__screenHeight.set(newValue);
    }
    get drawModel() {
        return this.__drawModel.get();
    }
    set drawModel(newValue) {
        this.__drawModel.set(newValue);
    }
    get enableFlag() {
        return this.__enableFlag.get();
    }
    set enableFlag(newValue) {
        this.__enableFlag.set(newValue);
    }
    get rotateDegree() {
        return this.__rotateDegree.get();
    }
    set rotateDegree(newValue) {
        this.__rotateDegree.set(newValue);
    }
    aboutToAppear() {
        window.getLastWindow(context).then((windowClass) => {
            const windowProperties = windowClass.getWindowProperties();
            this.screenWidth = px2vp(windowProperties.windowRect.width);
            this.screenHeight = px2vp(windowProperties.windowRect.height);
        }).catch((error) => {
            hilog.error(1, 'canvasCom', 'Failed to obtain the window size. Cause' + JSON.stringify(error));
        });
    }
    startAnimator() {
        let randomAngle = Math.round(Math.random() * 360);
        Context.animateTo({
            duration: 4000,
            curve: Curve.Ease,
            delay: 0,
            iterations: 1,
            playMode: PlayMode.Normal,
            onFinish: () => {
                this.rotateDegree = 40 - randomAngle;
                // Display prize information pop-up window.
                // this.dialogController.open();
            }
        }, () => {
            this.rotateDegree = 360 * 5 +
                270 - randomAngle;
        });
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Stack.create({ alignContent: Alignment.Center });
            Stack.height('100%');
            Stack.width('100%');
            Stack.backgroundImage({ "id": 16777233, "type": 20000, params: [], "bundleName": "com.example.canvascom", "moduleName": "entry" }, ImageRepeat.NoRepeat);
            Stack.backgroundImageSize({
                width: '100%',
                height: '38.7%'
            });
            if (!isInitialRender) {
                Stack.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Canvas.create(this.canvasContext);
            Canvas.width('100%');
            Canvas.height('100%');
            Canvas.onReady(() => {
                this.drawModel.draw(this.canvasContext, this.screenWidth, this.screenHeight);
            });
            Canvas.rotate({
                x: 0,
                y: 0,
                z: 1,
                angle: this.rotateDegree,
                centerX: this.screenWidth / 2,
                centerY: this.screenHeight / 2
            });
            if (!isInitialRender) {
                Canvas.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Canvas.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create({ "id": 16777236, "type": 20000, params: [], "bundleName": "com.example.canvascom", "moduleName": "entry" });
            Image.width('19.3%');
            Image.height('10.6%');
            Image.enabled(this.enableFlag);
            Image.onClick(() => {
                this.enableFlag = !this.enableFlag;
                this.startAnimator();
            });
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Stack.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadDocument(new Index(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
//# sourceMappingURL=Index.js.map