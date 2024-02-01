var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import utils from '@bundle:com.example.targetmanagementv2/entry/ets/Common/utils';
class TargetDataModel {
    constructor() {
        this.targetList = [];
    }
    getData() {
        return this.targetList;
    }
    setMockData() {
        this.addData('111');
        this.addData('222');
        this.addData('333');
    }
    addData(name) {
        this.targetList.push(new TargetItem(name, 0, utils.getNow()));
    }
    deleteData(indexArs) {
        this.targetList = this.targetList.filter((item) => indexArs.indexOf(item.id.toString()) === -1);
    }
    setDataLong(long, id) {
        const currentItemIndex = this.targetList.findIndex(item => item.id === id);
        const currentItem = this.targetList[currentItemIndex];
        currentItem.progress = long;
        currentItem.lastUpdateDate = utils.getNow();
        // currentItem.id = this.generateRandomId()
        this.targetList.splice(currentItemIndex, 1, currentItem);
    }
    generateRandomId() {
        return Math.round(Math.random() * 100000);
    }
}
const targetDataModel = new TargetDataModel();
export default targetDataModel;
let TargetItem = class TargetItem {
    constructor(name, progress, lastUpdateDate) {
        this.isFold = true;
        this.name = name;
        this.progress = progress;
        this.lastUpdateDate = lastUpdateDate;
        this.id = Math.round(Math.random() * 100000);
    }
};
TargetItem = __decorate([
    Observed
], TargetItem);
export { TargetItem };
//# sourceMappingURL=TargetDataModel.js.map