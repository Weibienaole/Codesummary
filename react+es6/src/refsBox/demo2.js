import React from "react";
class Btn extends React.Component {
  btnclick() {
    console.log("dianji ");
  }
  render() {
    return (
      <button ref={this.props.btnEl} onClick={() => this.btnclick()}>
        asdasdasd
      </button>
    );
  }
}
class Box3 extends React.Component {
  constructor(props) {
    super(props);
    this.onclickdiv = this.onclickdiv.bind(this);
  }
  render() {
    return (
      <div>
        ss
        <Btn
          btnEl={el => {
            this.els = el;
          }}
        ></Btn>
        <div onClick={this.onclickdiv}>click</div>
        <a href="/">back App</a>
      </div>
    );
  }
  onclickdiv() {
    this.els.click();
  }
}

function Foo(props) {
  return (
    <div>
      <input type="text" ref={props.inputEle} />
    </div>
  );
}

class Box2 extends React.Component {
  constructor(props) {
    super(props);
    this.handle = this.handle.bind(this);
  }
  render() {
    return (
      <div>
        <Foo
          inputEle={el => {
            this.eleInput = el;
            console.log(el);
          }}
        />
        el为子组件上对应的DOM节点
        <button onClick={this.handle}>聚焦</button>
      </div>
    );
  }

  handle() {
    this.eleInput.focus();
  }
}
export default Box3;
