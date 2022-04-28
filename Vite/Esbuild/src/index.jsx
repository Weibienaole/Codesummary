// import Server from 'react-dom/server'


// const Gre = () => <div>hello Arthas!</div>

// console.log(Server.renderToString(<Gre />))


// 应用了 env 插件后，构建时将会被替换成 process.env 对象
// import { PATH } from 'env'
// console.log(PATH, 'PATHPATHPATH', PATH.NODE_ENV);




import { render } from "https://cdn.skypack.dev/react-dom";
import React from "https://cdn.skypack.dev/react";
// import { render } from "react-dom";
// import React from "react";

let Greet = () => <h1>Hello, juejin!</h1>;

render(<Greet />, document.getElementById("root"));
