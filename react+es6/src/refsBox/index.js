import React from "react";

function logProps(Components) {
  class LogProps extends React.Component {
    render() {
      const { forwardedRef, ...rest } = this.props;
      return <Components ref={forwardedRef} {...rest} />;
    }
    componentDidMount() {

    }
  }

  return React.forwardRef((props, ref) => {
    console.log(ref);
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
class FancyButton extends React.Component {
  render() {
    return (
      <div className="fancyBox">
        <p>
          <span>aaaa</span>
        </p>
        <p>
          <span>bbbb</span>
        </p>
        <a href="/">back App</a>
        <a href="/refs/demo">go demo</a>
      </div>
    );
  }
}
const Gaojie = logProps(FancyButton);
class Box1 extends React.Component {
  render() {
    const ref = React.createRef();
    return (
      <div>
        <Gaojie ref={ref} value1="123" color="red"></Gaojie>
      </div>
    );
  }
}
// 普通ref
class Box2 extends React.Component {
  clck() {
    console.log(123)
  }
  render() {
    const ref = React.createRef();
    const FancyButton = React.forwardRef((props, ref) => {
      return (
        <button ref={ref} className="FancyButton" onClick={()=>this.clck()}>
          {props.children}
        </button>
      );
    });
    return <FancyButton ref={ref}>Click me!</FancyButton>;
  }
}

// test
class Box3 extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    const node = this.myRef.current;
    return <div ref={this.myRef} />;
  }
}
export default Box1;
