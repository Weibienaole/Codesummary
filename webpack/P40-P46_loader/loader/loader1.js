function loader(source){
  // source是源码
  console.log('loader1');
  return source
}
module.exports = loader