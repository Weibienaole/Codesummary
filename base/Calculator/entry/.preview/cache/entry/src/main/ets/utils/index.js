import { units } from '@bundle:com.example.calculator/entry/ets/Constants/index';
const UNDEP_NUMBER = ['÷', '×'];
// return--[是否允许赋值，赋值内容下标处，允许替换位数（0 push，1 替换），值]
export const verifyInput = (item, val) => {
    const { type, label, key } = item;
    const len = val.length;
    const last = len - 1;
    const lastContent = len > 0 ? val[len - 1] : '';
    const lastSecContent = len > 1 ? val[len - 2] : '';
    if (type === 'unit') {
        // 首位只允许 -
        if (!lastContent) {
            if (label !== '-') {
                return [false];
            }
            else
                return [true, last, 0, label];
        }
        else if (!lastSecContent && lastContent === '-') {
            return [false];
        }
        if (units.includes(lastContent)) {
            // 上一个 乘除，当前 -
            if (UNDEP_NUMBER.includes(lastContent) && label === '-') {
                return [true, last, 0, label];
            }
            // 上二为符号，上一 - push，其余splice 2
            else if (UNDEP_NUMBER.includes(lastSecContent)) {
                if (lastContent === '-') {
                    return [true, last - 1, 2, label];
                }
                else {
                    return [false];
                }
            }
            else {
                return [true, last, 1, label];
            }
        }
        // 不是操作符
        else if (!units.includes(lastContent)) {
            return [true, last, 0, label];
        }
    }
    else if (type === 'number') {
        // 百分比之后不允许其余数字type
        if (lastContent.indexOf('%') !== -1)
            return [false];
        if (key === 'dot') {
            const preStr = '0' + label;
            if (UNDEP_NUMBER.includes(lastSecContent) && units.includes(lastContent)) {
                return [true, last, 1, lastContent + preStr];
            }
            else if (!lastContent || units.includes(lastContent)) {
                return [true, last, 0, preStr];
            }
            else if (lastContent.indexOf(label) === -1) {
                return [true, last, 1, lastContent + label];
            }
            else
                return [false];
        }
        else if (key === 'per') {
            // 不为空，且值不能为操作符，且单段不能包含多个
            if (lastContent.length &&
                !units.includes(lastContent) &&
                lastContent.indexOf(label.toString()) === -1) {
                return [true, last, 1, lastContent + label];
            }
            else
                return [false];
        }
        else {
            // 负号组合
            if (UNDEP_NUMBER.includes(lastSecContent) && units.includes(lastContent)) {
                return [true, last, 1, lastContent + label];
            }
            if (units.includes(lastContent)) {
                //   操作符,单分开
                return [true, last, 0, label];
            }
            else {
                return [true, last, 1, lastContent + label];
            }
        }
    }
};
//# sourceMappingURL=index.js.map