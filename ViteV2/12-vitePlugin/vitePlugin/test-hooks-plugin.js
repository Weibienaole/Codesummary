export default function testHookPlugin() {
  return {
    name: 'plugin:vite-hooks-test',
    config(config) {
      console.log('config', config)
    },
    configResolved(config) {
      console.log('configResolved', config)
    },
    options(opts) {
      console.log('options', opts)
      return opts
    },
    configureServer(server) {
      console.log('configureServer', server)
    },
    buildStart() {
      console.log('buildStart')
    },
    buildEnd() {
      console.log('buildEnd')
    },
    closeBundle() {
      console.log('closeBundle')
    }
  }
}
