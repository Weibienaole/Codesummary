export default class Constants {
}
Constants.BANNER_LIST = [
    { "id": 16777225, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" },
    { "id": 16777229, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" },
    { "id": 16777235, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" },
    { "id": 16777226, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" }
];
Constants.FOOD_LIST = [
    { "id": 16777229, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" },
    { "id": 16777222, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" },
];
Constants.LIFE_LIST = [
    { "id": 16777235, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" },
    { "id": 16777231, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" },
    { "id": 16777219, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" },
    { "id": 16777230, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" },
    { "id": 16777237, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" },
    { "id": 16777220, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" },
];
Constants.MEN_LIST = [
    { "id": 16777226, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" },
    { "id": 16777227, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" },
    { "id": 16777218, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" },
];
Constants.SCENE_LIST = [
    { "id": 16777236, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" },
    { "id": 16777225, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" },
    { "id": 16777224, "type": 20000, params: [], "bundleName": "com.example.photo", "moduleName": "entry" },
];
Constants.IMG_ARR = [
    new Array().concat(Constants.SCENE_LIST, Constants.LIFE_LIST, Constants.MEN_LIST),
    new Array().concat(Constants.MEN_LIST, Constants.LIFE_LIST, Constants.SCENE_LIST),
    new Array().concat(Constants.FOOD_LIST, Constants.SCENE_LIST, Constants.SCENE_LIST),
    new Array().concat(Constants.LIFE_LIST, Constants.FOOD_LIST, Constants.MEN_LIST)
];
Constants.CATCH_IMAGE_ARR = ['', '', '', ''];
Constants.DEFAULT_WIDTH = 360;
//# sourceMappingURL=Constant.js.map