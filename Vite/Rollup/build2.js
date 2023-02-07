const rollup = require('rollup')
const util = require('util')

async function build(){
  const bundle = await rollup.rollup({
    input: ['./src/index2.js'],
  });
  // util.inspect 返回对象的字符串表现形式
  console.log(util.inspect(bundle));
}

build()