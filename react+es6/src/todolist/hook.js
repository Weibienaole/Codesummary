import React, { useState, useEffect, useContext } from "react";
import "./index.scss";
const dataBox = [
  {
    name: "阿萨斯",
    age: "16",
    school: 0,
    phone: "12312341234",
    sex: 0,
    id: 0
  },
  {
    name: "阿萨飒",
    age: "20",
    school: 2,
    phone: "13465789009",
    sex: 1,
    id: 1
  },
  {
    name: "莫妮卡",
    age: "18",
    school: 1,
    phone: "12344652226",
    sex: 0,
    id: 2
  },
  {
    name: "胡诌",
    age: "22",
    school: null,
    phone: "98798608888",
    sex: 1,
    id: 3
  }
];

function TodoListBox() {
  dataBox.forEach(item => {
    item.sex = item.sex === 0 ? "男" : item.sex === 1 ? "女" : item.sex;
    switch (item.school) {
      case 0:
        return (item.school = "清华大学");
      case 1:
        return (item.school = "北京大学");
      case 2:
        return (item.school = "中央戏剧学院");
      case null:
        return (item.school = "暂无");
      default:
        return item.school;
    }
  });
  const [data, setData] = useState(dataBox);

  const [addSaveData, setAddSaveData] = useState({
    name: "",
    age: "",
    school: "",
    phone: "",
    sex: ""
  });

  const [type, setType] = useState(null);

  const [noBtn, setNoBtn] = useState(false);

  const [saveIndex, setSaveIndex] = useState(null);

  function onSaveClick(i, type) {
    const saveData = Object.assign(data[i], {});
    setAddSaveData(saveData);
    setType(type);
    setSaveIndex(i);
    const dot = document.getElementsByClassName("activityBox")[0];
    dot.style.display = "block";
  }

  function onDelClick(i) {
    const newData = data.slice();
    newData.splice(i, 1);
    setData(newData);
  }

  function onAddClick(type) {
    setType(type);
    const dot = document.getElementsByClassName("activityBox")[0];
    dot.style.display = "block";
  }

  function onSearchClick() {
    const value = document.getElementById("inputText").value;
    if (value.length === 0) return;
    const data = dataBox;
    const newData = [];
    data.forEach((item, index) => {
      for (let i in item) {
        if (i === "id" || item[i] === "暂无") return;
        if (item[i].indexOf(value) !== -1) {
          newData.push(item);
        }
      }
    });
    pushArr(newData);
  }

  function pushArr(arr) {
    const newArr = [];
    arr = arr.reduce((item, next) => {
      console.log(item, next);
      if (!newArr[next.id]) {
        newArr[next.id] = true && item.push(next);
      }
      return item;
    }, []);
    setData(arr);
  }

  function onBtnSubmit(arr) {
    const olDdata = data;
    const newArr = Object.assign(arr, {});
    if (type === 0) {
      newArr.id = olDdata.length;
      olDdata.push(newArr);
      setData(olDdata);
    } else {
      const newData = data;
      newData.splice(saveIndex, 1, arr);
      setData(newData);
    }
    onBtnCLickNo();
  }

  function onBtnCLickNo() {
    setAddSaveData({ name: "", age: "", school: "", phone: "", sex: "" });
    setNoBtn(true);
    const dot = document.getElementsByClassName("activityBox")[0];
    dot.style.display = "none";
  }

  function reversal() {
    setNoBtn(false);
  }

  return (
    <div className="Box">
      <a href="/">back App</a>
      <SearchBox
        onAddClick={type => onAddClick(type)}
        onSearchClick={onSearchClick}
      ></SearchBox>
      <TableBox
        data={data}
        onSaveClick={(i, type) => onSaveClick(i, type)}
        onDelClick={i => onDelClick(i)}
      ></TableBox>
      <ActivityBox
        data={addSaveData}
        noBtn={noBtn}
        onBtnSubmit={arr => onBtnSubmit(arr)}
        onBtnCLickNo={onBtnCLickNo}
        reversal={reversal}
      ></ActivityBox>
    </div>
  );
}

function ActivityBox(props) {
  const [obj, setObj] = useState({
    name: "",
    age: "",
    school: "",
    phone: "",
    sex: "",
    id: undefined
  });
  useEffect(() => {
    if (props.noBtn) {
      setObj({
        name: "",
        age: "",
        school: "",
        phone: "",
        sex: "",
        id: undefined
      });
      props.reversal();
    }
    if (obj.id !== undefined || props.data.id === obj.id) return;
    setObj(props.data);
  }, [props, obj.id]);

  const onInputChange = ({ target: { value } }, i) => {
    setObj({ ...obj, [i]: value });
  };

  /**
   *
   */


  //
  /**
   * 
   * 



   */
  // const onInputChange = (e, i) => {
  //   e.persist();
  //   const val = e.target.value;
  //   setObj({ ...obj, [i]: val });
  // };

  function onBtnCLick() {
    const data = obj;
    props.onBtnSubmit(data);
  }

  return (
    <div className="activityBox">
      <div className="opacity"></div>
      <div className="box">
        <div className="list">
          <span className="name">姓名：</span>
          <input
            value={obj.name}
            className="content"
            type="text"
            onChange={e => onInputChange(e, "name")}
          ></input>
        </div>
        <div className="list">
          <span className="name">年龄：</span>
          <input
            value={obj.age}
            className="content"
            type="text"
            onChange={e => onInputChange(e, "age")}
          ></input>
        </div>
        <div className="list">
          <span className="name">学校：</span>
          <input
            value={obj.school}
            className="content"
            type="text"
            onChange={e => onInputChange(e, "school")}
          ></input>
        </div>
        <div className="list">
          <span className="name">手机号：</span>
          <input
            value={obj.phone}
            className="content"
            type="text"
            onChange={e => onInputChange(e, "phone")}
          ></input>
        </div>
        <div className="list">
          <span className="name">性别：</span>
          <input
            value={obj.sex}
            className="content"
            type="text"
            onChange={e => onInputChange(e, "sex")}
          ></input>
        </div>
        <button onClick={onBtnCLick}>确定</button>
        <button onClick={props.onBtnCLickNo}>取消</button>
      </div>
    </div>
  );
}

function SearchBox(props) {
  return (
    <div className="searchBox">
      <input type="text" className="searchInput" id="inputText"></input>
      <span className="searchBtn" onClick={props.onSearchClick}>
        Search!
      </span>
      <span className="searchBtn" onClick={() => props.onAddClick(0)}>
        Add!
      </span>
    </div>
  );
}

function TableBox(props) {
  function dataTable() {
    const data = props.data;
    if (data.length > 0) {
      return data.map((item, index) => {
        return (
          <li key={index} className="dataList">
            <div className="dataLi">{item.name}</div>
            <div className="dataLi">{item.age}</div>
            <div className="dataLi">{item.school}</div>
            <div className="dataLi">{item.phone}</div>
            <div className="dataLi">{item.sex}</div>
            <div className="dataLi">
              <button onClick={() => props.onSaveClick(index, 1)}>修改</button>
              <button onClick={() => props.onDelClick(index)}>删除</button>
            </div>
          </li>
        );
      });
    } else {
      return <li className="noList">暂无信息</li>;
    }
  }
  return (
    <div className="tableBox">
      <ul>
        <li className="dataList">
          <div className="dataLi title">名字</div>
          <div className="dataLi title">年龄</div>
          <div className="dataLi title">学校</div>
          <div className="dataLi title">手机</div>
          <div className="dataLi title">性别</div>
          <div className="dataLi title">操作</div>
        </li>
        {dataTable()}
      </ul>
    </div>
  );
}

export default TodoListBox;
