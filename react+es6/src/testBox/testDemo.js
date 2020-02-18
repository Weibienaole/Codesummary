import React from "react";

class CommentBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      author: {
        name: "Arthas",
        authorUrl: "https://pic.cnblogs.com/face/1077281/20170614005535.png"
      },
      text: "这是一个text",
      time: new Date().toLocaleTimeString(),
      numArr: [1, 2, 3, 4, 5],
      optionBox: [
        {
          value: "banana",
          name: "香蕉",
          isShow: false
        },
        {
          value: "apple",
          name: "苹果",
          isShow: true
        },
        {
          value: "orange",
          name: "橘子",
          isShow: false
        }
      ]
    };
    // this.onOptionChange = this.onOptionChange.bind(this)
  }
  componentDidMount() {
    this.Timer = setInterval(() => {
      this.setState({
        time: new Date().toLocaleTimeString()
      });
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.Timer);
  }
  onOptionChange(event) {
    console.log(event + 'a');
  }
  render() {
    return (
      <>
      <Comment
        author={this.state.author}
        text={this.state.text}
        numArr={this.state.numArr}
        optionArr={this.state.optionBox}
        optionChange={(value)=>{this.onOptionChange(value)}}
      ></Comment>
      <a href="/">back App</a>
      </>
    );
  }
}
class Comment extends React.Component {
  render() {
    return (
      <div className="Comment">
        <UserInfo author={this.props.author}></UserInfo>
        <CommentText text={this.props.text}></CommentText>
        <CommentDate time={this.props.time}></CommentDate>
        <NumberList arr={this.props.numArr}></NumberList>
        <OptionBox
          dataArr={this.props.optionArr}
          optionChange={(value) => this.props.optionChange(value)}
        ></OptionBox>
      </div>
    );
  }
}
class CommentDate extends React.Component {
  render() {
    const element = (
      <div className="Comment-date">{new Date().toLocaleTimeString()}</div>
    );
    return element;
  }
}

class NumberList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
    this.inputChange = this.inputChange.bind(this);
  }
  inputChange(event) {
    event.persist();
    this.setState({
      value: event.target.value
    });
    console.log(event);
  }
  render() {
    const arr = this.props.arr;
    return (
      <div className="listBox">
        <ul>
          {arr.map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
        </ul>
        <input
          type="text"
          placeholder="请输入"
          value={this.state.value}
          onChange={this.inputChange}
        />
        <span>{this.state.value}</span>
      </div>
    );
  }
}

class OptionBox extends React.Component {
  optionChange(event) {
    event.persist()
    const value = event.target.value
    this.props.optionChange(value)
  }
  render() {
    return (
      <select onChange={event=>this.optionChange(event)}>
        {this.props.dataArr.map((item, index) => {
          return (
            <Options
              key={index}
              valueItem={item.value}
              name={item.name}
              isShow={item.isShow}
            ></Options>
          );
        })}
      </select>
    );
  }
}
function Options(props) {
  // return props.isShow === true ? (
  // <option selected value={props.value}>{props.name}</option>
  // ) : (
  return <option value={props.value}>{props.name}</option>;
  // );
}
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <img
        className="Avatar"
        src={props.author.avatarUrl}
        alt={props.author.name}
      />
      <div className="UserInfo-name">{props.author.name}</div>
    </div>
  );
}
function CommentText(props) {
  return <div className="Comment-text">{props.text}</div>;
}
export default CommentBox;
