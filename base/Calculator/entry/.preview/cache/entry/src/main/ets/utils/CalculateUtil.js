class CalculateUtil {
    constructor() {
        this.OPERATORS = '+-×÷';
    }
    isEmpty(obj) {
        return (typeof obj === 'undefined' || obj === null || obj === '');
    }
    parseExpression(expressions) {
        if (this.isEmpty(expressions)) {
            return 'NaN';
        }
        let len = expressions.length;
        let outputStack = [];
        let outputQueue = [];
        expressions.forEach((item, index) => {
            // Handle % in the expression
            if (item.indexOf('%') !== -1) {
                expressions[index] = (this.mulOrDiv(item.slice(0, item.length - 1), '100', '÷')).toString();
            }
            // Whether the last digit is an operator.
            if ((index === len - 1) && this.isSymbol(item)) {
                expressions.pop();
            }
        });
        while (expressions.length > 0) {
            let current = expressions.shift();
            if (current !== undefined) {
                if (this.isSymbol(current)) {
                    // Processing addition, subtraction, multiplication and division.
                    while (outputStack.length > 0 && this.comparePriority(current, outputStack[outputStack.length - 1])) {
                        let popValue = outputStack.pop();
                        if (popValue !== undefined) {
                            outputQueue.push(popValue);
                        }
                    }
                    outputStack.push(current);
                }
                else {
                    // Processing the numbers.
                    outputQueue.push(current);
                }
            }
        }
        while (outputStack.length > 0) {
            let popValue = outputStack.pop();
            if (popValue !== undefined) {
                outputQueue.push(popValue);
            }
        }
        return this.dealQueue(outputQueue);
    }
    isSymbol(value) {
        if (this.isEmpty(value)) {
            return;
        }
        return (this.OPERATORS.indexOf(value) !== -1);
    }
    mulOrDiv(arg1, arg2, symbol) {
        let mulFlag = (symbol === '×');
        if (this.containScientificNotation(arg1) || this.containScientificNotation(arg2)) {
            if (mulFlag) {
                return Number(arg1) * Number(arg2);
            }
            return Number(arg1) / Number(arg2);
        }
        let leftLen = arg1.split('.')[1] ? arg1.split('.')[1].length : 0;
        let rightLen = arg2.split('.')[1] ? arg2.split('.')[1].length : 0;
        if (mulFlag) {
            return Number(arg1.replace('.', '')) *
                Number(arg2.replace('.', '')) / Math.pow(10, leftLen + rightLen);
        }
        return Number(arg1.replace('.', '')) /
            (Number(arg2.replace('.', '')) / Math.pow(10, rightLen - leftLen));
    }
    containScientificNotation(arg) {
        return (arg.indexOf('e') !== -1);
    }
    comparePriority(arg1, arg2) {
        if (this.isEmpty(arg1) || this.isEmpty(arg2)) {
            return false;
        }
        return (this.getPriority(arg1) <= this.getPriority(arg2));
    }
    getPriority(value) {
        if (this.isEmpty(value)) {
            return 0;
        }
        let result = 0;
        switch (value) {
            case '+':
            case '-':
                result = 1;
                break;
            case '×':
            case '÷':
                result = 2;
                break;
            default:
                result = 0;
                break;
        }
        return result;
    }
    dealQueue(queue) {
        var _a;
        if (this.isEmpty(queue)) {
            return 'NaN';
        }
        let outputStack = [];
        while (queue.length > 0) {
            let current = queue.shift();
            if (current !== undefined) {
                if (!this.isSymbol(current)) {
                    outputStack.push(current);
                }
                else {
                    let second = outputStack.pop();
                    let first = outputStack.pop();
                    if (first !== undefined && second !== undefined) {
                        let calResultValue = this.calResult(first, second, current);
                        outputStack.push(calResultValue);
                    }
                }
            }
        }
        if (outputStack.length !== 1) {
            return 'NaN';
        }
        else {
            let end = ((_a = outputStack[0]) === null || _a === void 0 ? void 0 : _a.endsWith('.')) ?
                outputStack[0].substring(0, outputStack[0].length - 1) : outputStack[0];
            return end;
        }
    }
    calResult(arg1, arg2, symbol) {
        if (this.isEmpty(arg1) || this.isEmpty(arg2) || this.isEmpty(symbol)) {
            return 'NaN';
        }
        let result = 0;
        switch (symbol) {
            case '+':
                result = this.add(arg1, arg2, '+');
                break;
            case '-':
                result = this.add(arg1, arg2, '-');
                break;
            case '×':
                result = this.mulOrDiv(arg1, arg2, '×');
                break;
            case '÷':
                result = this.mulOrDiv(arg1, arg2, '÷');
                break;
            default:
                break;
        }
        return this.numberToScientificNotation(result);
    }
    add(arg1, arg2, symbol) {
        let addFlag = (symbol === '+');
        if (this.containScientificNotation(arg1) || this.containScientificNotation(arg2)) {
            if (addFlag) {
                return Number(arg1) + Number(arg2);
            }
            return Number(arg1) - Number(arg2);
        }
        arg1 = (arg1 === '0.') ? '0' : arg1;
        arg2 = (arg2 === '0.') ? '0' : arg2;
        let leftArr = arg1.split('.');
        let rightArr = arg2.split('.');
        let leftLen = leftArr.length > 1 ? leftArr[1] : '';
        let rightLen = rightArr.length > 1 ? rightArr[1] : '';
        let maxLen = Math.max(leftLen.length, rightLen.length);
        let multiples = Math.pow(10, maxLen);
        if (addFlag) {
            return Number(((Number(arg1) * multiples + Number(arg2) * multiples) / multiples).toFixed(maxLen));
        }
        return Number(((Number(arg1) * multiples - Number(arg2) * multiples) / multiples).toFixed(maxLen));
    }
    numberToScientificNotation(result) {
        if (result === Number.NEGATIVE_INFINITY || result === Number.POSITIVE_INFINITY) {
            return 'NaN';
        }
        let resultStr = JSON.stringify(result);
        if (this.containScientificNotation(resultStr)) {
            return resultStr;
        }
        let prefixNumber = (resultStr.indexOf('-') === -1) ? 1 : -1;
        result *= prefixNumber;
        if (resultStr.replace('.', '').replace('-', '').length <
            16) {
            return resultStr;
        }
        let suffix = (Math.floor(Math.log(result) / Math.LN10));
        let prefix = (result * Math.pow(10, -suffix) * prefixNumber);
        return (prefix + 'e' + suffix);
    }
}
export default new CalculateUtil();
//# sourceMappingURL=CalculateUtil.js.map