import LinkDataModel, { mockItem, mockItemChilds } from '@bundle:com.example.secondlevelscrollbox/entry/ets/types/index';
class ClassifyModel {
    getMockData() {
        const mockListIds = [];
        let mockList = [];
        // tree
        LINK_DATA.forEach((item, index) => {
            const findIndex = mockListIds.indexOf(item.superId);
            if (findIndex !== -1) {
                mockList[findIndex].childs.push(new mockItemChilds(item.id, item.courseName, item.imageUrl, item.price));
            }
            else {
                mockList.push(new mockItem(item.superId, item.superName, []));
                mockListIds.push(item.superId);
            }
        });
        return mockList;
    }
}
const classifyModel = new ClassifyModel();
export default classifyModel;
const LINK_DATA = [
    new LinkDataModel(1, '热门课程', 1, '应用市场介绍', { "id": 16777227, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(1, '热门课程', 2, '上架流程', { "id": 16777237, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 100),
    new LinkDataModel(1, '热门课程', 3, '应用出海', { "id": 16777238, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 50),
    new LinkDataModel(1, '热门课程', 4, '审核政策', { "id": 16777239, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 222),
    new LinkDataModel(1, '热门课程', 5, 'CaaS Kit - HMS Core精品实战课', { "id": 16777240, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 256),
    new LinkDataModel(1, '热门课程', 6, '机器学习在图像分割场景中的应用', { "id": 16777241, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(1, '热门课程', 7, '一分钟了解华为应用内支付服务', { "id": 16777242, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(1, '热门课程', 8, '一分钟了解华为位置服务', { "id": 16777243, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 400),
    new LinkDataModel(2, '最新课程', 9, 'Excel函数在商业中的应用', { "id": 16777244, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 65),
    new LinkDataModel(2, '最新课程', 10, '“震动”手机锁屏制作', { "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(2, '最新课程', 11, '“流体动效”手机锁屏制作', { "id": 16777229, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 50),
    new LinkDataModel(2, '最新课程', 12, 'HUAWEI GT自定义表盘制作', { "id": 16777230, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 70),
    new LinkDataModel(2, '最新课程', 13, '商务表盘制作', { "id": 16777231, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(2, '最新课程', 14, '5分钟了解跨应用、跨形态无缝登录', { "id": 16777232, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 80),
    new LinkDataModel(2, '最新课程', 15, 'oCPC进阶功能及最新政策解读', { "id": 16777233, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 120),
    new LinkDataModel(2, '最新课程', 16, 'HUAWEI Ads 游戏行业投放指南', { "id": 16777234, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 160),
    new LinkDataModel(3, 'HarmonyOS', 17, 'HarmonyOS物联网开发课程', { "id": 16777235, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(3, 'HarmonyOS', 18, '【Hello系列直播课】第1期：手把手教你搭建开发环境', { "id": 16777236, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(3, 'HarmonyOS', 19, 'HarmonyOS技术训练营-10分钟快速体验HarmonyOS分布式应用', { "id": 16777244, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(3, 'HarmonyOS', 20, '应用开发基础：JS FA开发基础（第一期）', { "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(3, 'HarmonyOS', 21, 'HarmonyOS Connect设备开发基础：OpenHarmony基础', { "id": 16777227, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 60),
    new LinkDataModel(3, 'HarmonyOS', 22, '组件开发和集成：SDK集成指南（第五期）', { "id": 16777237, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 120),
    new LinkDataModel(4, '精彩活动', 23, 'HUAWEI Developer Day•2018北京精彩回顾', { "id": 16777238, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(4, '精彩活动', 24, '华为AR帮你轻松打造酷炫应用', { "id": 16777239, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 99),
    new LinkDataModel(4, '精彩活动', 25, 'AR VR应用创新大赛获奖作品', { "id": 16777240, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 30),
    new LinkDataModel(4, '精彩活动', 26, '华为HiLink智能家居生态介绍', { "id": 16777241, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 80),
    new LinkDataModel(4, '精彩活动', 27, '华为校园千帆行丨武汉站', { "id": 16777242, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 160),
    new LinkDataModel(4, '精彩活动', 28, 'HUAWEI Developer Day•杭州站精彩回顾', { "id": 16777243, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(5, '开发者说', 29, '优秀实践分享 - 掌阅科技', { "id": 16777244, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(5, '开发者说', 30, '极限试驾', { "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 130),
    new LinkDataModel(5, '开发者说', 31, 'AR狙击手', { "id": 16777229, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 100),
    new LinkDataModel(5, '开发者说', 32, '宇宙解码', { "id": 16777230, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 100),
    new LinkDataModel(5, '开发者说', 33, 'Wars of Stone', { "id": 16777231, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 1200),
    new LinkDataModel(5, '开发者说', 34, 'ROCK ME', { "id": 16777232, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 156),
    new LinkDataModel(5, '开发者说', 35, '神奇AR智能宝宝', { "id": 16777233, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 130),
    new LinkDataModel(6, '后端开发', 36, '从零开始学架构', { "id": 16777234, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 120),
    new LinkDataModel(6, '后端开发', 37, '架构设计之异步化技术', { "id": 16777235, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(6, '后端开发', 38, '架构设计之页面静态化技术', { "id": 16777236, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(6, '后端开发', 39, 'Python极简入门', { "id": 16777244, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(6, '后端开发', 40, 'Python实践指南', { "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 2001),
    new LinkDataModel(6, '后端开发', 41, 'Java高级特性', { "id": 16777227, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 30),
    new LinkDataModel(6, '后端开发', 42, 'C++核心编程', { "id": 16777237, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 50),
    new LinkDataModel(7, '移动开发', 43, 'EMUI 9.1主题转10.0主题适配指导', { "id": 16777238, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(7, '移动开发', 44, '“流体动效”手机锁屏制作', { "id": 16777239, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(7, '移动开发', 45, '“震动”手机锁屏制作', { "id": 16777240, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(8, '前端开发', 46, 'DevOps新技术入门', { "id": 16777241, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 50),
    new LinkDataModel(8, '前端开发', 47, 'Vue.js 框架开发系列课程', { "id": 16777234, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 60),
    new LinkDataModel(8, '前端开发', 48, 'jQuery实例精讲', { "id": 16777243, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 80),
    new LinkDataModel(8, '前端开发', 49, 'JavaScript 编程技巧与实战', { "id": 16777244, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 300),
    new LinkDataModel(8, '前端开发', 50, '基于 Bootstrap 框架开发技巧实战', { "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 150),
    new LinkDataModel(8, '前端开发', 51, 'Java Web开发课程', { "id": 16777229, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 200),
    new LinkDataModel(8, '前端开发', 52, 'JavaScript 设计模式', { "id": 16777230, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(8, '前端开发', 53, 'HTML入门基础系列课程', { "id": 16777231, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(8, '前端开发', 54, '前端系列第7期-微前端–架构介绍篇', { "id": 16777232, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0),
    new LinkDataModel(8, '前端开发', 55, 'Web安全系列课程', { "id": 16777233, "type": 20000, params: [], "bundleName": "com.example.secondlevelscrollbox", "moduleName": "entry" }, 0)
];
//# sourceMappingURL=index.js.map