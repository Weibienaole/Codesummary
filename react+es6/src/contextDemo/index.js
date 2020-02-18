import React, {useContext} from "react";
/**
 * {
  themes: themes.dark, // 默认值
  toggleTheme: () => {}
}
 */
const ThemeContext = React.createContext();
class Box extends React.Component {
  render() {
    const themes = {
      light: {
        foreground: "#000000",
        background: "#eeeeee"
      },
      dark: {
        foreground: "#ffffff",
        background: "#222222"
      }
    };
    return (
      <>
      <ThemeContext.Provider value={themes.light}>
        <ChildrenBox></ChildrenBox>
      </ThemeContext.Provider>
        <a href="/">back App</a>
      </>
    );
  }
}
class ChildrenBox extends React.Component {
  render() {
    return <ChildrenChildBox1 />; // 正常
    // return <ChildrenChildBox2 />; // Hook
  }
}
class ChildrenChildBox1 extends React.Component {
  // 普通使用context，如果使用hook的 useContext 则不需要
  static contextType = ThemeContext
  render() {
    let theme
    theme = this.context;
    // 若使用hook
    // theme = useContext(ThemeContext)
    console.log(theme);
    return (
      <>
        <span>{theme.background}</span>
        <span>{theme.foreground}</span>
      </>
    );
  }
}
function ChildrenChildBox2() {
  let theme
  theme = useContext(ThemeContext)
  console.log(theme);
  return (
    <>
      <span>{theme.background}</span>
      <span>{theme.foreground}</span>
    </>
  );
}
// Box.contextType = Context;
export default Box;
