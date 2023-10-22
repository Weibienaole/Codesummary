export default function virtualCodePlugin(){
  const virtualName = 'virtual:fn'
  const virtualEnv = 'virtual:env'
  let c
  return {
    name: 'plugin:virtual-code',
    configResolved(config){
      c =config
    },
    resolveId(id){
      if(id === virtualName){
        return '\0' + virtualName
      }
      if(id === virtualEnv){
        return '\0' + virtualEnv
      }
    },
    load(id){
      if(id === '\0' + virtualName){
        return 'export default function fn(){return 1 + 3}'
      }
      if(id === '\0' + virtualEnv){
        return `export default ${JSON.stringify(c.env)}`
      }
    }
  } 
}