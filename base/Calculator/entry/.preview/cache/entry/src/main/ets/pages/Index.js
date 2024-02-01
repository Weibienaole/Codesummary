import { CalculatorList, units } from '@bundle:com.example.calculator/entry/ets/Constants/index';
import { verifyInput } from '@bundle:com.example.calculator/entry/ets/utils/index';
import CalculateUtil from '@bundle:com.example.calculator/entry/ets/utils/CalculateUtil';
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__showFinallyResult = new ObservedPropertySimplePU(false, this, "showFinallyResult");
        this.__inputContent = new ObservedPropertyObjectPU([''], this, "inputContent");
        this.__finallyOutputContent = new ObservedPropertySimplePU('0', this, "finallyOutputContent");
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.showFinallyResult !== undefined) {
            this.showFinallyResult = params.showFinallyResult;
        }
        if (params.inputContent !== undefined) {
            this.inputContent = params.inputContent;
        }
        if (params.finallyOutputContent !== undefined) {
            this.finallyOutputContent = params.finallyOutputContent;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__showFinallyResult.purgeDependencyOnElmtId(rmElmtId);
        this.__inputContent.purgeDependencyOnElmtId(rmElmtId);
        this.__finallyOutputContent.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__showFinallyResult.aboutToBeDeleted();
        this.__inputContent.aboutToBeDeleted();
        this.__finallyOutputContent.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get showFinallyResult() {
        return this.__showFinallyResult.get();
    }
    set showFinallyResult(newValue) {
        this.__showFinallyResult.set(newValue);
    }
    get inputContent() {
        return this.__inputContent.get();
    }
    set inputContent(newValue) {
        this.__inputContent.set(newValue);
    }
    get finallyOutputContent() {
        return this.__finallyOutputContent.get();
    }
    set finallyOutputContent(newValue) {
        this.__finallyOutputContent.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/Index.ets(13:5)");
            Column.width('100%');
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/Index.ets(14:7)");
            Column.height('40%');
            Column.backgroundColor('rgba(245, 245, 245, 1)');
            Column.padding({ top: '38%' });
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            if (this.showFinallyResult) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        // 最终结果
                        Text.create('123123123');
                        Text.debugLine("pages/Index.ets(17:11)");
                        __Text__showTextStyle(50);
                        // 最终结果
                        Text.fontColor('rgba(160, 162, 166, 1)');
                        if (!isInitialRender) {
                            // 最终结果
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    // 最终结果
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        // 输入内容
                        TextInput.create({ text: this.inputContent.join('') });
                        TextInput.debugLine("pages/Index.ets(22:11)");
                        // 输入内容
                        TextInput.fontSize(this.inputContent.join('').length > 15 ? 25 : 30);
                        // 输入内容
                        TextInput.fontColor('rgba(160, 162, 166, 1)');
                        // 输入内容
                        TextInput.backgroundColor('#00000000');
                        // 输入内容
                        TextInput.caretColor('#00000000');
                        // 输入内容
                        TextInput.textAlign(TextAlign.End);
                        // 输入内容
                        TextInput.margin({ bottom: 10 });
                        if (!isInitialRender) {
                            // 输入内容
                            TextInput.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        // 实时结果
                        Text.create(this.finallyOutputContent);
                        Text.debugLine("pages/Index.ets(30:11)");
                        __Text__showTextStyle(30);
                        if (!isInitialRender) {
                            // 实时结果
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    // 实时结果
                    Text.pop();
                });
            }
            if (!isInitialRender) {
                If.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        If.pop();
        Column.pop();
        {
            this.observeComponentCreation((elmtId, isInitialRender) => {
                ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                if (isInitialRender) {
                    ViewPU.create(new CalculatorInputContainer(this, {
                        inputContent: this.__inputContent
                    }, undefined, elmtId));
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
                ViewStackProcessor.StopGetAccessRecording();
            });
        }
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
class CalculatorInputContainer extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__inputContent = new SynchedPropertyObjectTwoWayPU(params.inputContent, this, "inputContent");
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__inputContent.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__inputContent.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get inputContent() {
        return this.__inputContent.get();
    }
    set inputContent(newValue) {
        this.__inputContent.set(newValue);
    }
    handleInput(item) {
        if (item.type === 'operate') {
            if (item.key === 'clear') {
                this.inputContent = [];
            }
            else if (item.key === 'del') {
                const last = this.inputContent.length - 1;
                const lastContent = this.inputContent[last];
                if (lastContent.length === 1) {
                    last === 0 ? this.inputContent = [''] : this.inputContent.pop();
                }
                else {
                    this.inputContent[last] = lastContent.slice(0, lastContent.length - 1);
                }
            }
            else if (item.key === 'equ') {
                console.log(JSON.stringify(this.inputContent));
            }
        }
        else {
            const [bol, index, delIndex, value] = verifyInput(item, this.inputContent);
            if (!bol)
                return;
            if (delIndex === 0) {
                this.inputContent.splice(index + 1, delIndex, value);
            }
            else {
                this.inputContent.splice(index, delIndex, value);
            }
        }
        if (item.type === 'number' &&
            !units.includes(item.label) &&
            item.label !== '.') {
            this.computeArs(this.inputContent);
        }
    }
    computeArs(ars) {
        let calResult = CalculateUtil.parseExpression(Array.from(ars));
        console.log(JSON.stringify(calResult));
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Grid.create();
            Grid.debugLine("pages/Index.ets(86:5)");
            Grid.backgroundColor('rgba(249, 247, 255, 1)');
            Grid.height('60%');
            Grid.width('100%');
            Grid.padding(20);
            Grid.layoutDirection(GridDirection.Column);
            Grid.rowsTemplate('1fr 1fr 1fr 1fr 1fr');
            Grid.columnsGap(15);
            Grid.rowsGap(10);
            if (!isInitialRender) {
                Grid.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            ForEach.create();
            const forEachItemGenFunction = (_item, index) => {
                const item = _item;
                this.observeComponentCreation((elmtId, isInitialRender) => {
                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                    If.create();
                    if (item.type === 'operate' && item.key === 'equ') {
                        this.ifElseBranchUpdateFunction(0, () => {
                            {
                                const isLazyCreate = true && (Grid.willUseProxy() === true);
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    GridItem.create(deepRenderFunction, isLazyCreate);
                                    GridItem.width(66);
                                    GridItem.height(132);
                                    GridItem.backgroundColor('rgba(0, 117, 253, 1)');
                                    GridItem.borderRadius(33);
                                    GridItem.rowStart(1);
                                    GridItem.rowEnd(item.placeHolderLen);
                                    GridItem.onClick(() => this.handleInput(item));
                                    GridItem.debugLine("pages/Index.ets(89:11)");
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
                                        Text.create(item.label);
                                        Text.debugLine("pages/Index.ets(90:13)");
                                        Text.fontSize(35);
                                        Text.fontColor(item.color);
                                        if (!isInitialRender) {
                                            Text.pop();
                                        }
                                        ViewStackProcessor.StopGetAccessRecording();
                                    });
                                    Text.pop();
                                    GridItem.pop();
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.updateFuncByElmtId.set(elmtId, itemCreation);
                                    this.observeComponentCreation((elmtId, isInitialRender) => {
                                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                        Text.create(item.label);
                                        Text.debugLine("pages/Index.ets(90:13)");
                                        Text.fontSize(35);
                                        Text.fontColor(item.color);
                                        if (!isInitialRender) {
                                            Text.pop();
                                        }
                                        ViewStackProcessor.StopGetAccessRecording();
                                    });
                                    Text.pop();
                                    GridItem.pop();
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
                        this.ifElseBranchUpdateFunction(1, () => {
                            {
                                const isLazyCreate = true && (Grid.willUseProxy() === true);
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    GridItem.create(deepRenderFunction, isLazyCreate);
                                    GridItem.width(66);
                                    GridItem.aspectRatio(1);
                                    GridItem.backgroundColor('white');
                                    GridItem.borderRadius(33);
                                    GridItem.onClick(() => this.handleInput(item));
                                    GridItem.debugLine("pages/Index.ets(100:11)");
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
                                        If.create();
                                        if (typeof item.label === 'string') {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                                    Text.create(item.label);
                                                    Text.debugLine("pages/Index.ets(102:15)");
                                                    Text.fontSize(35);
                                                    Text.fontColor(item.color);
                                                    if (!isInitialRender) {
                                                        Text.pop();
                                                    }
                                                    ViewStackProcessor.StopGetAccessRecording();
                                                });
                                                Text.pop();
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                                    Image.create(item.label);
                                                    Image.debugLine("pages/Index.ets(104:15)");
                                                    Image.width(30);
                                                    Image.aspectRatio(1);
                                                    Image.margin({ right: 5 });
                                                    if (!isInitialRender) {
                                                        Image.pop();
                                                    }
                                                    ViewStackProcessor.StopGetAccessRecording();
                                                });
                                            });
                                        }
                                        if (!isInitialRender) {
                                            If.pop();
                                        }
                                        ViewStackProcessor.StopGetAccessRecording();
                                    });
                                    If.pop();
                                    GridItem.pop();
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.updateFuncByElmtId.set(elmtId, itemCreation);
                                    this.observeComponentCreation((elmtId, isInitialRender) => {
                                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                        If.create();
                                        if (typeof item.label === 'string') {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                                    Text.create(item.label);
                                                    Text.debugLine("pages/Index.ets(102:15)");
                                                    Text.fontSize(35);
                                                    Text.fontColor(item.color);
                                                    if (!isInitialRender) {
                                                        Text.pop();
                                                    }
                                                    ViewStackProcessor.StopGetAccessRecording();
                                                });
                                                Text.pop();
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                                    Image.create(item.label);
                                                    Image.debugLine("pages/Index.ets(104:15)");
                                                    Image.width(30);
                                                    Image.aspectRatio(1);
                                                    Image.margin({ right: 5 });
                                                    if (!isInitialRender) {
                                                        Image.pop();
                                                    }
                                                    ViewStackProcessor.StopGetAccessRecording();
                                                });
                                            });
                                        }
                                        if (!isInitialRender) {
                                            If.pop();
                                        }
                                        ViewStackProcessor.StopGetAccessRecording();
                                    });
                                    If.pop();
                                    GridItem.pop();
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
                    if (!isInitialRender) {
                        If.pop();
                    }
                    ViewStackProcessor.StopGetAccessRecording();
                });
                If.pop();
            };
            this.forEachUpdateFunction(elmtId, CalculatorList, forEachItemGenFunction, ({ key }) => key, true, false);
            if (!isInitialRender) {
                ForEach.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        ForEach.pop();
        Grid.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
function __Text__showTextStyle(size) {
    Text.fontSize(size);
    Text.textAlign(TextAlign.End);
    Text.width('100%');
    Text.padding({ right: 15 });
}
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadDocument(new Index(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
//# sourceMappingURL=Index.js.map