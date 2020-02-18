import React, { useState, useEffect, useContext } from "react";
import "./demo.scss";

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

function HookGameBox() {
  const [chessStep, setChessStep] = useState(0);
  const [chessArrs, setChessArrs] = useState([
    { chessArr: Array(9).fill(null) }
  ]);
  useEffect(() => {
    if (calculateWinner(chessArrs[chessStep].chessArr) !== null) {
      setGoit(false);
    } else {
      setGoit(true);
    }
    setChessStep(chessArrs.length - 1);
  }, [chessArrs, chessStep]);
  const [chessBoolean, setChessBoolean] = useState(false);
  useEffect(() => {
    // console.log(chessBoolean)
  });

  const [title, setTitle] = useState("X");

  const [goit, setGoit] = useState(true);
  useEffect(() => {
    // console.log(goit)
  });

  const [chessGoStep, setChessGoStep] = useState([null]);
  useEffect(() => {
    // console.log(chessGoStep)
  });

  function onChessClick(index, axis) {
    chessGoStep.push(index);
    setChessBoolean(!chessBoolean);
    let arr = chessArrs[chessStep].chessArr.slice();
    if (arr[index] !== null || goit === false) return;
    if (chessBoolean === false) {
      arr[index] = "X";
      setTitle("O");
    } else {
      arr[index] = "O";
      setTitle("X");
    }
    chessArrs.push({ chessArr: arr, axis: axis });
  }

  function titleSay(i, arr) {
    winnerLine(arr);
    const returnis = arr.every(item => {
      return item !== null;
    });
    if (returnis && calculateWinner(arr) === null) return "no winner";
    if (calculateWinner(arr) === null) {
      return `Now ${i} Go`;
    } else if (calculateWinner(arr) !== null) {
      return `Winner is ${calculateWinner(arr).winner}`;
    }
  }

  function winnerLine(arr) {
    if(document.getElementById("chessBox") === null) return
    const dots = document.getElementById("chessBox").children
    if (calculateWinner(arr) === null) {
      for(let i in dots){
        if(dots[i].classList !== undefined){
          dots[i].classList.remove('lineColor')
        }
      }
    } else {
      const winArr = calculateWinner(arr).winnerArr;
      winArr.forEach(item=>{
        dots[item].classList.add('lineColor')
      })
    }
  }

  function onHisClick(i) {
    if (calculateWinner(chessArrs[chessStep].chessArr) !== null) {
      setGoit(false);
    } else {
      setGoit(true);
    }
    const arr = chessArrs.slice(0, i + 1);
    const stepArr = chessGoStep.slice(0, i + 1);
    setChessGoStep(stepArr);
    setChessArrs(arr);
    setChessStep(i);
    setChessBoolean(i % 2 !== 0);
    if (i % 2 !== 0) {
      setTitle("O");
    } else {
      setTitle("X");
    }
  }

  function onStepMouseEnter(i) {
    if (i === 0 || chessGoStep[i] === null) return;
    const dot = document.getElementById("chessBox").children[chessGoStep[i]];
    dot.classList.add("active");
  }

  function onStepMouseLeave(i) {
    if (i === 0 || chessGoStep[i] === null) return;
    const dot = document.getElementById("chessBox").children[chessGoStep[i]];
    dot.classList.remove("active");
  }

  return (
    <div className="gameBox">
      <span>{titleSay(title, chessArrs[chessStep].chessArr)}</span>
      <ChessBox
        arr={chessArrs[chessStep].chessArr}
        onChessClickBtn={(data, axis) => onChessClick(data, axis)}
      ></ChessBox>
      <HistoryBox
        arr={chessArrs}
        clickHisStep={i => onHisClick(i)}
        StepMouseEnter={i => onStepMouseEnter(i)}
        StepMouseLeave={i => onStepMouseLeave(i)}
      ></HistoryBox>
      <a href="/">back App</a>
    </div>
  );
}

function ChessBox(props) {
  const arr = [];
  for (let i = 0; i < 9; i += 3) {
    arr.push(props.arr.slice(i, i + 3));
  }
  return (
    <ul id="chessBox">
      {arr.map((item, i) => {
        return item.map((list, index) => {
          let indexs;
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
            <Chess
              key={indexs}
              index={indexs}
              data={list}
              axis={[i, index]}
              onClick={(data, axis) => props.onChessClickBtn(data, axis)}
            ></Chess>
          );
        });
      })}
    </ul>
  );
}

function Chess(props) {
  function clickChess() {
    props.onClick(props.index, props.axis);
  }
  return (
    <li className="chessList" onClick={clickChess}>
      {props.data}
    </li>
  );
}

function HistoryBox(props) {
  const arr = props.arr;
  function clickStep(i) {
    props.clickHisStep(i);
  }
  function say(index) {
    if (index === 0) {
      return "start";
    } else {
      const Y = arr[index].axis[0] + 1;
      const X = arr[index].axis[1] + 1;
      return "step " + index + " " + "横 " + X + " " + "纵 " + Y;
    }
  }
  return (
    <div className="historyBox">
      {arr.map((item, index) => {
        return (
          <li
            className="historyStep"
            key={index}
            onClick={() => clickStep(index)}
            onMouseEnter={() => props.StepMouseEnter(index)}
            onMouseLeave={() => props.StepMouseLeave(index)}
          >
            {say(index)}
          </li>
        );
      })}
    </div>
  );
}

export default HookGameBox;
