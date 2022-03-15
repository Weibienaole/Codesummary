
/*
将一个给定字符串 s 根据给定的行数 numRows ，以从上往下、从左到右进行 Z 字形排列。

比如输入字符串为 "PAYPALISHIRING" 行数为 3 时，排列如下：

P   A   H   N
A P L S I I G
Y   I   R
之后，你的输出需要从左往右逐行读取，产生出一个新的字符串，比如："PAHNAPLSIIGYIR"。

请你实现这个将字符串进行指定行数变换的函数：

string convert(string s, int numRows);
 

示例 1：

输入：s = "PAYPALISHIRING", numRows = 3
输出："PAHNAPLSIIGYIR"
示例 2：
输入：s = "PAYPALISHIRING", numRows = 4
输出："PINALSIGYAHRPI"
解释：
P     I   5 0
A   L     3 1
Y A       1 2
P         0 3
示例 3：

输入：s = "A", numRows = 1
输出："A"
*/
/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */


/*
  按数组
  row为数组num
  循环+到上限再-
*/
console.time()
var convert = function (s, numRows) {
  if(numRows === 1){
    return s
  }
  let nowRow = 0
  let sort = true
  let resArr = Array.from(new Array(numRows), () => '')
  let res = ''

  for (let i = 0; i < s.length; i++) {
    resArr[nowRow] += s[i]
    nowRow += sort ? 1 : -1
    if (nowRow === numRows - 1 || nowRow === 0) {
      sort = !sort
    }
  }
  res = resArr.join('')
  return res
  // return '1  3 \n2  4'.split('\n').join('').replace(/\s* /g, '')
};
console.log(convert('PAYPALISHIRING', 3), 'answer');
console.timeLog()

// PAYPALISHIRING 4