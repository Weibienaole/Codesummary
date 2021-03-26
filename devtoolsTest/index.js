const { devtools, regModules } = require('zzy-javascript-devtools')
const comments1 = [
  { id: 1, parentId: null },
  { id: 2, parentId: 1 },
  { id: 3, parentId: 1 },
  { id: 4, parentId: 2 },
  { id: 5, parentId: 4 }
];
console.log(devtools.formatNowTime(1616748659996))