import { FormItem } from '@bundle:com.example.formlistv2/entry/ets/types/index';
export default class Constants {
}
Constants.formList = [
    new FormItem({
        label: '昵称',
        icon: { "id": 16777227, "type": 20000, params: [], "bundleName": "com.example.formlistv2", "moduleName": "entry" },
        isBlank: false,
        type: 'input',
        value: '',
        placeholder: '昵称',
        key: 'nick'
    }),
    new FormItem({
        label: '出生日期',
        icon: { "id": 16777218, "type": 20000, params: [], "bundleName": "com.example.formlistv2", "moduleName": "entry" },
        isBlank: true,
        type: 'datePicker',
        value: '',
        key: 'birthday'
    }),
    new FormItem({
        label: '性别',
        icon: { "id": 16777230, "type": 20000, params: [], "bundleName": "com.example.formlistv2", "moduleName": "entry" },
        isBlank: true,
        type: 'radio',
        value: '0',
        key: 'sex',
        selectList: [
            {
                label: '男',
                value: '1'
            },
            {
                label: '女',
                value: '0'
            }
        ]
    }),
    new FormItem({
        label: '个性签名',
        icon: { "id": 16777229, "type": 20000, params: [], "bundleName": "com.example.formlistv2", "moduleName": "entry" },
        isBlank: false,
        type: 'input',
        placeholder: '个性签名',
        value: '',
        key: 'sign'
    }),
    new FormItem({
        label: '兴趣爱好（多选）',
        icon: { "id": 16777226, "type": 20000, params: [], "bundleName": "com.example.formlistv2", "moduleName": "entry" },
        isBlank: true,
        type: 'select',
        value: '',
        key: 'hobbies',
        selectList: [
            {
                label: '踢足球',
                value: '0'
            },
            {
                label: '打篮球',
                value: '1'
            },
            {
                label: '打游戏',
                value: '2'
            },
            {
                label: '听音乐',
                value: '3'
            },
            {
                label: '弹吉他',
                value: '4'
            },
        ]
    }),
];
//# sourceMappingURL=index.js.map