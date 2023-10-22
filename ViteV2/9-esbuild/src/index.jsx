import Server from 'react-dom/server'

const Dom = () => <h1>hello,world</h1>

console.log(Server.renderToString(<Dom />));