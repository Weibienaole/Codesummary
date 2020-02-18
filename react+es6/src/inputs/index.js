import React from "react";
class InputBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "o",
      tempera: null
    };
    this.onChangeTemO = this.onChangeTemO.bind(this);
    this.onChangeTemT = this.onChangeTemT.bind(this);
    this.GoStore = this.GoStore.bind(this);
    this.back = this.back.bind(this);
  }
  onChangeTemO(value) {
    this.setState({
      type: "t",
      tempera: value
    });
  }
  onChangeTemT(value) {
    this.setState({
      type: "o",
      tempera: value
    });
  }
  GoStore() {
    this.props.history.push({
      pathname: "/StoreBox",
      state: {
        id: 3
      }
    });
  }
  back() {
    this.props.history.goBack()
  }
  render() {
    const tempera = this.state.tempera;
    const typeNew = this.state.type;
    
    return (
      <div className="box">
        <TemperaBox
          type="o"
          typeNew={typeNew}
          tempera={tempera}
          onChangeTem={this.onChangeTemO}
        >
          {this.children}
        </TemperaBox>
        <TemperaBox
          type="t"
          typeNew={typeNew}
          tempera={tempera}
          onChangeTem={this.onChangeTemT}
        ></TemperaBox>
        <ChildrenBox border="blue">
          <div className="childrenBox">
            <ul className="childrenUl">
              <li className="childrenLi"></li>
              <li className="childrenLi"></li>
              <li className="childrenLi"></li>
            </ul>
            <p>这是函数组件 children的demo</p>
          </div>
        </ChildrenBox>
        <a href="/">back App</a>
        <button onClick={this.GoStore}> go store (携带参数)</button>
        <button onClick={this.back}>返回上一级</button>
      </div>
    );
  }
}
class TemperaBox extends React.Component {
  onchange(e, a) {
    console.log(e,a)
    let value;
    let oldValue = `${Number(e.target.value)}` === "NaN" ? "" : e.target.value;
    if (!oldValue) return;
    if (this.props.type === "o") {
      value = Math.round(toT(oldValue));
    } else {
      value = Math.round(toO(oldValue));
    }
    this.props.onChangeTem(value);
  }
  render() {
    const tempera = this.props.tempera;
    const typeNew = this.props.typeNew;
    const type = this.props.type;
    let title;
    if (type === "o") {
      title = "摄氏度";
    } else {
      title = "华氏度";
    }
    let value;
    if (typeNew === type) {
      value = tempera;
    }
    return (
      <div>
        <span>{title}</span>
        <input value={value} onChange={(e, a = 123) => this.onchange(e, a)}></input>
      </div>
    );
  }
}

function ChildrenBox(props) {
  return (
    <div className={"childrenBox border" + props.border}>{props.children}</div>
  );
}
function toO(t) {
  return ((t - 32) * 5) / 9;
}

function toT(o) {
  return (o * 9) / 5 + 32;
}
export default InputBox;
