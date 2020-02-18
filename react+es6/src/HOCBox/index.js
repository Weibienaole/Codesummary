import React, { Component } from "react";
import {Link} from 'react-router-dom'
const DataSource = {
  banana: [
    {
      value: "banana",
      name: "香蕉",
      id: 1,
      isShow: false
    },
    {
      value: "orange",
      name: "橙子",
      id: 2,
      isShow: false
    }
  ],
  apple: {
    value: "apple",
    name: "苹果",
    id: 3,
    isShow: true
  }
};
class HOCBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data1: DataSource.banana,
      data2: DataSource.apple
    };
    this.box1 = WrappedComponent(Comment, this.state.data1);
    this.box2 = WrappedComponent(Comment, this.state.data2);
  }
  render() {
    const Box1 = this.box1
    const Box2 = this.box2
    return (
      <>
        <Box1 />
        <Box2 />
        <Link to='/'>back Appasd</Link>
      </>
    );
  }
}

function WrappedComponent(Module, data) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.buttonClick = this.buttonClick.bind(this)
      this.state = {answer: '无'}
    }
    buttonClick(item) {
      this.setState({answer: item.name})
    }
    render() {
      return (
        <div className='box'>
          <Module buttonClick = {this.buttonClick} data={data}></Module>
          <span>answer :{this.state.answer}</span>
        </div>
      );
    }
  };
}
function Comment(props) {
    let data
    const arr = [];
    if (props.data.length > 1) {
      for (let i in props.data) {
        arr.push(props.data[i]);
      }
    } else {arr.push(props.data)}
    data = arr.map(item => {
      return (
        <React.Fragment key={item.id}>
          <span>{item.name}</span>
          <button onClick={()=>props.buttonClick(item)}>
            Click this {item.value}
          </button>
         </React.Fragment>
      );
    });
    return <>{data}</>;
}
export default HOCBox;
