export default class LinkDataModel {
    constructor(superId, superName, id, courseName, imageUrl, price) {
        this.superId = superId;
        this.superName = superName;
        this.id = id;
        this.courseName = courseName;
        this.imageUrl = imageUrl;
        this.price = price;
    }
}
export class mockItem {
    constructor(fid, title, childs) {
        this.fid = fid;
        this.title = title;
        this.childs = childs || [];
    }
}
export class mockItemChilds {
    constructor(id, name, icon, price) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.price = price;
    }
}
//# sourceMappingURL=index.js.map