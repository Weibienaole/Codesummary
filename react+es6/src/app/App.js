import React from "react";
import {Link}from 'react-router-dom'
import "./App.css";

class Gamebox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chessArrs: [
        {
          chessArr: Array(9).fill(null)
        }
      ],
      chessBoolean: true,
      chessArrIndex: 0,
      nowChessGoIndex: [],
      XYAxis: []
    };
  }
  onBtnClick(i, x, y) {
    const arrayBox = this.state.chessArrs;
    const arr = arrayBox[this.state.chessArrIndex].chessArr.slice();
    const newChessIndex = this.state.nowChessGoIndex;
    if (arr[i] || calculateWinner(arr)) return;
    arr[i] = this.state.chessBoolean ? "X" : "O";
    this.setState({
      chessArrs: arrayBox.concat([{ chessArr: arr, XYAxis: [x, y] }]),
      chessArrIndex: arrayBox.length,
      nowChessGoIndex: newChessIndex.concat({ index: i }),
      chessBoolean: !this.state.chessBoolean
    });
  }
  jumpClick(index) {
    const arr = this.state.chessArrs;
    const indexArr = this.state.nowChessGoIndex;
    this.setState({
      chessArrs: arr.slice(0, index + 1),
      chessArrIndex: index,
      chessBoolean: index % 2 === 0,
      nowChessGoIndex: indexArr.slice(0, index)
    });
    if (calculateWinner(arr) === null) {
      const dotList = this.getDotList();
      for (let i = 0; i < dotList.length; i++) {
        dotList[i].style.color = "#000000";
      }
    }
  }
  enterChess(index) {
    if (index === 0) return;
    const dotIndex = this.state.nowChessGoIndex[index - 1].index;
    const dotList = this.getDotList();
    dotList[dotIndex].style.background = "green";
  }
  leaveChess(index) {
    if (index === 0) return;
    const dotIndex = this.state.nowChessGoIndex[index - 1].index;
    const dotList = this.getDotList();
    dotList[dotIndex].style.background = "#fff";
  }
  whoWinner(winner) {
    let title;
    if (winner) {
      const dotList = this.getDotList();
      for (let i = 0; i < dotList.length; i++) {
        winner.winnerArr.forEach(item => {
          if (i === item) {
            dotList[i].style.color = "red";
          }
        });
      }
      title = winner.winner + " winner";
    } else {
      const arr = this.state.chessArrs[this.state.chessArrIndex].chessArr;
      const arrBoolean = arr.every((item, index) => {
        if (item) {
          return true;
        }
      });
      if (arrBoolean) {
        title = "平局";
      } else {
        title = this.state.chessBoolean ? "X Go" : "O Go";
      }
    }
    return title;
  }
  getDotList() {
    const dotLine = document.getElementsByClassName("tableBox")[0].childNodes;
    const dotList = [];
    for (let i in dotLine) {
      if (dotLine[i].childNodes) {
        for (let k in dotLine[i].childNodes) {
          if (typeof dotLine[i].childNodes[k] === "object") {
            dotList.push(dotLine[i].childNodes[k]);
          }
        }
      }
    }
    return dotList;
  }
  getCoord(index){
    let coord
    if(index === 0){
      coord = '横 无 纵 无'
    } else {
      const XYAxis =this.state.chessArrs[index].XYAxis
      coord = '横' +( XYAxis[0] + 1) + ' 纵' + (XYAxis[1] + 1)
    }
    return coord
  }
  render() {
    const newArr = this.state.chessArrs[this.state.chessArrIndex]
    const arr = newArr.chessArr;
    const historyBox = this.state.chessArrs;
    const historyArr = historyBox.map((item, index) => {
      return (
        <li key={index}>
          <button
            onClick={() => this.jumpClick(index)}
            onMouseEnter={() => this.enterChess(index)}
            onMouseLeave={() => this.leaveChess(index)}
          >
            步骤{index} :{this.getCoord(index)}
          </button>
        </li>
      );
    });
    const winner = calculateWinner(arr);
    return (
      <div className="gameBox">
        <div>{this.whoWinner(winner)}</div>
        <Chessbox
          chessArr={arr}
          onBtnClick={(i, x, y) => this.onBtnClick(i, x, y)}
        ></Chessbox>
        <div>历史记录</div>
        <ul className="historyBox">{historyArr}</ul>
        <Link to='/Inputs'>Go Inputs</Link>
        <Link to='/Comment'>Go Comment</Link>
        <Link to='/StoreBox'>Go StoreBox</Link>
        <Link to='/ContextDemo'>Go ContextDemo</Link>
        <Link to='/refs/index'>Go refsBox</Link>
        <Link to='/HOCBox'>Go HOCBox</Link>
        <Link to='/Hook'>Go Hook</Link>
        <Link to='/todolist'>Go todolist</Link>
        <Link to='/ES6/index'>Go ES6</Link>
        <Link to='/RouterBox'>Go router Box</Link>
      </div>
    );
  }
}

class Chessbox extends React.Component {
  render() {
    const chessBox = [];
    for (let i = 0; i < this.props.chessArr.length; i++) {
      chessBox.push(this.props.chessArr.slice(i, (i += 2) + 1));
    }
    const chesss = chessBox.map((arrs, i) => {
      const chessLine = arrs.map((item, index) => {
        let xAxis, yAxis;
        let indexs;
        xAxis = i;
        yAxis = index;
        switch (i) {
          case 0:
            indexs = (i + 1) * (index + 1) - 1;
            break;
          case 1:
            indexs = (i + 1) * (index + 2) - index - 1;
            break;
          default:
            indexs = i * (index + 3) - index;
        }
        return (
          <Chesss
            key={indexs}
            value={item}
            onBtnClick={() => this.props.onBtnClick(indexs, xAxis, yAxis)}
            onMouseEnter={() => this.enterChess(indexs)}
            onMouseLeave={() => this.leaveChess(indexs)}
          ></Chesss>
        );
      });
      return (
        <div key={i} className="chessLine">
          {chessLine}
        </div>
      );
    });
    return <div className="tableBox">{chesss}</div>;
  }
}

function Chesss(props) {
  return (
    <button className="tables" onClick={props.onBtnClick}>
      {props.value}
    </button>
  );
}

function calculateWinner(arr) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (arr[a] && arr[a] === arr[b] && arr[a] === arr[c]) {
      const obj = {
        winner: arr[a],
        winnerArr: [a, b, c]
      };
      return obj;
    }
  }
  return null;
}

export default Gamebox;
