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
}
export default new TargetDataModel();
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