import Constants from '@bundle:com.example.formlistv2/entry/ets/Constants/index';
PersistentStorage.PersistProp('formObj', '{}');
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__formList = new ObservedPropertyObjectPU(Constants.formList, this, "formList");
        this.__finallyVal = this.createStorageLink('formObj', '', "finallyVal");
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.formList !== undefined) {
            this.formList = params.formList;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__formList.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__formList.aboutToBeDeleted();
        this.__finallyVal.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get formList() {
        return this.__formList.get();
    }
    set formList(newValue) {
        this.__formList.set(newValue);
    }
    get finallyVal() {
        return this.__finallyVal.get();
    }
    set finallyVal(newValue) {
        this.__finallyVal.set(newValue);
    }
    aboutToAppear() {
        const setsData = AppStorage.Get('formObj');
        this.setData(JSON.parse(setsData));
    }
    onPageHide() {
        PersistentStorage.PersistProp('formObj', this.finallyVal);
    }
    setData(obj) {
        if (Object.keys(obj).length > 0) {
            const oldD = [...this.formList];
            oldD.forEach((_, index) => {
                oldD[index].value = obj[oldD[index].key];
            });
            this.formList = oldD;
        }
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/Index.ets(33:5)");
            Column.width('100%');
            Column.backgroundColor('#f2f3f4');
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Navigation.create();
            Navigation.debugLine("pages/Index.ets(34:7)");
            Navigation.titleMode(NavigationTitleMode.Mini);
            if (!isInitialRender) {
                Navigation.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/Index.ets(35:9)");
            Column.width('100%');
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/Index.ets(36:11)");
            Column.width('100%');
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create({ "id": 16777225, "type": 20000, params: [], "bundleName": "com.example.formlistv2", "moduleName": "entry" });
            Image.debugLine("pages/Index.ets(37:13)");
            Image.width(50);
            Image.margin({ bottom: 10 });
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('个人信息');
            Text.debugLine("pages/Index.ets(38:13)");
            Text.fontSize(13);
            Text.fontWeight(FontWeight.Medium);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            List.create({ space: 15 });
            List.debugLine("pages/Index.ets(41:11)");
            List.margin(10);
            if (!isInitialRender) {
                List.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const formItem = _item;
                {
                    const isLazyCreate = true;
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        ListItem.create(deepRenderFunction, isLazyCreate);
                        ListItem.width('100%');
                        ListItem.debugLine("pages/Index.ets(43:15)");
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
                                    ViewPU.create(new Item(this, { formItem }, undefined, elmtId));
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {
                                        formItem
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
                                    ViewPU.create(new Item(this, { formItem }, undefined, elmtId));
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {
                                        formItem
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
            this.forEachUpdateFunction(elmtId, this.formList, forEachItemGenFunction, ({ key }) => key, false, false);
            if (!isInitialRender) {
                ForEach.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        ForEach.pop();
        List.pop();
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel('confirm');
            Button.debugLine("pages/Index.ets(50:9)");
            Button.onClick(() => {
                this.finallyVal = JSON.stringify(Object.fromEntries(this.formList.map(item => ([item.key, item.value]))));
            });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.finallyVal);
            Text.debugLine("pages/Index.ets(53:9)");
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel('set');
            Button.debugLine("pages/Index.ets(54:9)");
            Button.onClick(() => {
                const setsData = {
                    nick: 'Arthas',
                    birthday: '2000-6-30',
                    sex: '1',
                    sign: 'I am Arthas',
                    hobbies: ['2', '3', '4']
                };
                this.setData(setsData);
            });
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        Navigation.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
class Item extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__formItem = new SynchedPropertyNesedObjectPU(params.formItem, this, "formItem");
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        this.__formItem.set(params.formItem);
    }
    updateStateVars(params) {
        this.__formItem.set(params.formItem);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__formItem.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__formItem.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get formItem() {
        return this.__formItem.get();
    }
    handleInputChange(val) {
        this.formItem.value = val;
    }
    handleOpenSelectModal() {
        if (this.formItem.type === 'datePicker') {
            //  日期选择
            DatePickerDialog.show({
                selected: this.formItem.value && new Date(this.formItem.value) || new Date(),
                onAccept: ({ year, month, day }) => {
                    this.formItem.value = `${year}-${month + 1}-${day}`;
                }
            });
        }
        else if (this.formItem.type === 'radio') {
            //   单选
            TextPickerDialog.show({
                range: this.formItem.selectList.map(item => item.label),
                selected: this.formItem.selectList.findIndex(item => item.value === this.formItem.value),
                onAccept: ({ index }) => {
                    this.formItem.value = this.formItem.selectList[index].value;
                }
            });
        }
        else if (this.formItem.type === 'select') {
            //   多选
            const multipleSelectDialog = new CustomDialogController({
                builder: () => {
                    let jsDialog = new MultipleSelectDialog(this, {
                        title: this.formItem.label,
                        selectList: this.formItem.selectList,
                        defaultSelect: this.formItem.value,
                        cancel: () => {
                            multipleSelectDialog.close();
                        },
                        confirm: (selected) => {
                            this.formItem.value = selected;
                            multipleSelectDialog.close();
                        }
                    });
                    jsDialog.setController(this.multipleSelectDialog);
                    ViewPU.create(jsDialog);
                },
                autoCancel: false,
                alignment: DialogAlignment.Bottom,
                offset: { dx: 0, dy: -20 }
            }, this);
            multipleSelectDialog.open();
        }
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.debugLine("pages/Index.ets(121:5)");
            Row.backgroundColor('#fff');
            Row.borderRadius(10);
            Row.padding({ top: 15, bottom: 15, left: 5, right: 5 });
            Row.width('100%');
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create(this.formItem.icon);
            Image.debugLine("pages/Index.ets(122:7)");
            Image.width(20);
            Image.margin({ left: 10 });
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            if (this.formItem.type === 'input') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        TextInput.create({ placeholder: this.formItem.placeholder || '', text: this.formItem.value });
                        TextInput.debugLine("pages/Index.ets(124:9)");
                        TextInput.backgroundColor('#fff');
                        TextInput.padding({ left: 10, right: 0, top: 0, bottom: 0 });
                        TextInput.placeholderFont({
                            size: 13
                        });
                        TextInput.fontSize(13);
                        TextInput.onChange(val => this.handleInputChange(val));
                        if (!isInitialRender) {
                            TextInput.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create(this.formItem.label);
                        Text.debugLine("pages/Index.ets(133:9)");
                        Text.margin({ left: 10 });
                        Text.fontSize(13);
                        Text.fontWeight(FontWeight.Bold);
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
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            if (this.formItem.isBlank) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Blank.create();
                        Blank.debugLine("pages/Index.ets(136:9)");
                        if (!isInitialRender) {
                            Blank.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Blank.pop();
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
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            if (['select', 'radio', 'datePicker'].includes(this.formItem.type)) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create();
                        Text.debugLine("pages/Index.ets(139:9)");
                        Text.fontSize(13);
                        Text.margin({ right: 10 });
                        Text.onClick(() => this.handleOpenSelectModal());
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        If.create();
                        if (['select', 'radio'].includes(this.formItem.type)) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                    var _a;
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    Span.create(((_a = this.formItem.selectList.find(item => item.value === this.formItem.value)) === null || _a === void 0 ? void 0 : _a.label) || '请选择');
                                    Span.debugLine("pages/Index.ets(141:13)");
                                    if (!isInitialRender) {
                                        Span.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                });
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    Span.create(this.formItem.value || '请选择');
                                    Span.debugLine("pages/Index.ets(143:13)");
                                    if (!isInitialRender) {
                                        Span.pop();
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
                    Text.pop();
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Image.create({ "id": 16777219, "type": 20000, params: [], "bundleName": "com.example.formlistv2", "moduleName": "entry" });
                        Image.debugLine("pages/Index.ets(147:9)");
                        Image.width(20);
                        if (!isInitialRender) {
                            Image.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
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
    rerender() {
        this.updateDirtyElements();
    }
}
class MultipleSelectDialog extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.title = undefined;
        this.defaultSelect = undefined;
        this.selectList = undefined;
        this.controller = undefined;
        this.cancel = undefined;
        this.confirm = undefined;
        this.__selected = new ObservedPropertyObjectPU([], this, "selected");
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.title !== undefined) {
            this.title = params.title;
        }
        if (params.defaultSelect !== undefined) {
            this.defaultSelect = params.defaultSelect;
        }
        if (params.selectList !== undefined) {
            this.selectList = params.selectList;
        }
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
        if (params.cancel !== undefined) {
            this.cancel = params.cancel;
        }
        if (params.confirm !== undefined) {
            this.confirm = params.confirm;
        }
        if (params.selected !== undefined) {
            this.selected = params.selected;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__selected.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__selected.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    setController(ctr) {
        this.controller = ctr;
    }
    get selected() {
        return this.__selected.get();
    }
    set selected(newValue) {
        this.__selected.set(newValue);
    }
    aboutToAppear() {
        this.selected = [...this.selected, ...this.defaultSelect];
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/Index.ets(169:5)");
            Column.width('100%');
            Column.margin({ bottom: 10 });
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.title);
            Text.debugLine("pages/Index.ets(170:7)");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ top: 15 });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            List.create({ space: 10 });
            List.debugLine("pages/Index.ets(171:7)");
            List.padding(15);
            if (!isInitialRender) {
                List.pop();
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
                        ListItem.width('100%');
                        ListItem.debugLine("pages/Index.ets(173:11)");
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
                            Row.create();
                            Row.debugLine("pages/Index.ets(174:13)");
                            Row.width('100%');
                            if (!isInitialRender) {
                                Row.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Text.create(item.label);
                            Text.debugLine("pages/Index.ets(175:15)");
                            Text.fontWeight(FontWeight.Bold);
                            Text.fontSize(14);
                            if (!isInitialRender) {
                                Text.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        Text.pop();
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Blank.create();
                            Blank.debugLine("pages/Index.ets(176:15)");
                            if (!isInitialRender) {
                                Blank.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        Blank.pop();
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Checkbox.create({ name: item.label, group: this.title });
                            Checkbox.debugLine("pages/Index.ets(177:15)");
                            Checkbox.select(this.selected.indexOf(item.value) !== -1);
                            Checkbox.onClick(() => {
                                if (this.selected.includes(item.value)) {
                                    this.selected = this.selected.filter(it => it !== item.value);
                                }
                                else {
                                    this.selected.push(item.value);
                                }
                            });
                            if (!isInitialRender) {
                                Checkbox.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        Checkbox.pop();
                        Row.pop();
                        ListItem.pop();
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.updateFuncByElmtId.set(elmtId, itemCreation);
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Row.create();
                            Row.debugLine("pages/Index.ets(174:13)");
                            Row.width('100%');
                            if (!isInitialRender) {
                                Row.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Text.create(item.label);
                            Text.debugLine("pages/Index.ets(175:15)");
                            Text.fontWeight(FontWeight.Bold);
                            Text.fontSize(14);
                            if (!isInitialRender) {
                                Text.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        Text.pop();
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Blank.create();
                            Blank.debugLine("pages/Index.ets(176:15)");
                            if (!isInitialRender) {
                                Blank.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        Blank.pop();
                        this.observeComponentCreation((elmtId, isInitialRender) => {
                            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                            Checkbox.create({ name: item.label, group: this.title });
                            Checkbox.debugLine("pages/Index.ets(177:15)");
                            Checkbox.select(this.selected.indexOf(item.value) !== -1);
                            Checkbox.onClick(() => {
                                if (this.selected.includes(item.value)) {
                                    this.selected = this.selected.filter(it => it !== item.value);
                                }
                                else {
                                    this.selected.push(item.value);
                                }
                            });
                            if (!isInitialRender) {
                                Checkbox.pop();
                            }
                            ViewStackProcessor.StopGetAccessRecording();
                        });
                        Checkbox.pop();
                        Row.pop();
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
            this.forEachUpdateFunction(elmtId, this.selectList, forEachItemGenFunction);
            if (!isInitialRender) {
                ForEach.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        ForEach.pop();
        List.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.debugLine("pages/Index.ets(191:7)");
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceBetween);
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel('取消');
            Button.debugLine("pages/Index.ets(192:9)");
            __Button__dialogButtonStyle(false);
            Button.onClick(() => this.cancel());
            if (!isInitialRender) {
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Button.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Button.createWithLabel('确认');
            Button.debugLine("pages/Index.ets(193:9)");
            __Button__dialogButtonStyle(true);
            Button.onClick(() => {
                this.confirm(ObservedObject.GetRawObject(this.selected));
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
function __Button__dialogButtonStyle(isConfirm = true) {
    Button.fontSize(15);
    Button.fontColor(isConfirm ? '#0f99f6' : 'red');
    Button.fontWeight(FontWeight.Bold);
    Button.backgroundColor('#fff');
    Button.width('50%');
}
ViewStackProcessor.StartGetAccessRecordingFor(ViewStackProcessor.AllocateNewElmetIdForNextComponent());
loadDocument(new Index(undefined, {}));
ViewStackProcessor.StopGetAccessRecording();
//# sourceMappingURL=Index.js.map