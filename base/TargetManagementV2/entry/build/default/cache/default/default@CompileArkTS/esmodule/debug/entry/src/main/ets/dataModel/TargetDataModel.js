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
        currentItem.id = this.generateRandomId();
        this.targetList.splice(currentItemIndex, 1, currentItem);
    }
    generateRandomId() {
        return Math.round(Math.random() * 100000);
    }
}
const targetDataModel = new TargetDataModel();
export default targetDataModel;
export class TargetItem {
    constructor(name, progress, lastUpdateDate) {
        this.isFold = true;
        this.name = name;
        this.progress = progress;
        this.lastUpdateDate = lastUpdateDate;
        this.id = Math.round(Math.random() * 100000);
    }
}
//# sourceMappingURL=TargetDataModel.js.map