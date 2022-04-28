const rollup = require('rollup')
const util = require('util')

async function build(){
  const bundle = await rollup.rollup({
    input: ['./src/index2.js'],
  });
  console.log(JSON.parse(util.inspect(bundle)));
}

build()