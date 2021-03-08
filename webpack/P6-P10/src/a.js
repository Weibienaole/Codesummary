class B{
  b = 1
}
function *gen(){
  yield 1
}
console.log(gen().next())