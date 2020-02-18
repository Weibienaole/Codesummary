import React from "react";
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

class TodoListBox extends React.Component {
  constructor(props) {
    super(props);
    dataBox.forEach(item => {
      item.sex = item.sex === 0 ? "男" : "女";
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
    this.state = {
      data: dataBox,
      addSaveData: { name: "", age: "", school: "", phone: "", sex: "" },
      type: null,
      noBtn: false,
      saveIndex: null
    };
    this.onBtnCLickNo = this.onBtnCLickNo.bind(this);
    this.reversal = this.reversal.bind(this);
  }

  onSaveClick = (i, type) => {
    const saveData = Object.assign(this.state.data[i], {});
    this.setState({
      addSaveData: saveData,
      type: type,
      saveIndex: i
    });
    const dot = document.getElementsByClassName("activityBox")[0];
    dot.style.display = "block";
  };

  onDelClick = i => {
    const newData = this.state.data.slice();
    newData.splice(i, 1);
    this.setState({
      data: newData
    });
  };

  onAddClick = type => {
    this.setState({
      type: type
    });
    const dot = document.getElementsByClassName("activityBox")[0];
    dot.style.display = "block";
  };

  onSearchClick = () => {
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
    this.pushArr(newData);
  };

  pushArr(arr) {
    const newArr = [];
    arr = arr.reduce((item, next) => {
      if (!newArr[next.id]) {
        newArr[next.id] = true && item.push(next);
      }
      return item;
    }, []);
    this.setState({
      data: arr
    });
  }

  onBtnSubmit(arr) {
    const olDdata = this.state.data;
    const newArr = Object.assign(arr, {});
    if (this.state.type === 0) {
      newArr.id = olDdata.length;
      olDdata.push(newArr);
      this.setState({
        data: olDdata
      });
    }else {
      const newData = this.state.data
      newData.splice(this.state.saveIndex, 1, arr)
      this.setState({
        data: newData
      })
    }
    this.onBtnCLickNo()
  }

  onBtnCLickNo() {
    this.setState({
      addSaveData: { name: "", age: "", school: "", phone: "", sex: "" },
      noBtn: true
    });
    const dot = document.getElementsByClassName("activityBox")[0];
    dot.style.display = "none";
  }

  reversal() {
    this.setState({
      noBtn: false
    });
  }

  render() {
    return (
      <div className="Box">
        <a href="/">back App</a>
        <a href="/todolist/hook">Go Hook</a>
        <SearchBox
          onAddClick={type => this.onAddClick(type)}
          onSearchClick={this.onSearchClick}
        ></SearchBox>
        <TableBox
          data={this.state.data}
          onSaveClick={(i, type) => this.onSaveClick(i, type)}
          onDelClick={i => this.onDelClick(i)}
        ></TableBox>
        <ActivityBox
          data={this.state.addSaveData}
          noBtn={this.state.noBtn}
          onBtnSubmit={arr => this.onBtnSubmit(arr)}
          onBtnCLickNo={this.onBtnCLickNo}
          reversal={this.reversal}
        ></ActivityBox>
      </div>
    );
  }
}

class ActivityBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      age: "",
      school: "",
      phone: "",
      sex: ""
    };
    this.onBtnCLick = this.onBtnCLick.bind(this);
  }
  componentDidUpdate() {
    if (this.props.noBtn) {
      this.setState({
        name: "",
        age: "",
        school: "",
        phone: "",
        sex: "",
        id: undefined
      });
      this.props.reversal();
    }
    if (this.state.id !== undefined || this.props.data.id === this.state.id)
      return;
    this.setState(this.props.data);
  }
  onInputChange(e, i) {
    e.persist();
    const value = e.target.value;
    this.setState({
      [i]: value
    });
  }
  onBtnCLick() {
    const data = this.state;
    this.props.onBtnSubmit(data);
  }
  render() {
    return (
      <div className="activityBox">
        <div className="opacity"></div>
        <div className="box">
          <div className="list">
            <span className="name">姓名：</span>
            <input
              value={this.state.name}
              className="content"
              type="text"
              onChange={e => this.onInputChange(e, "name")}
            ></input>
          </div>
          <div className="list">
            <span className="name">年龄：</span>
            <input
              value={this.state.age}
              className="content"
              type="text"
              onChange={e => this.onInputChange(e, "age")}
            ></input>
          </div>
          <div className="list">
            <span className="name">学校：</span>
            <input
              value={this.state.school}
              className="content"
              type="text"
              onChange={e => this.onInputChange(e, "school")}
            ></input>
          </div>
          <div className="list">
            <span className="name">手机号：</span>
            <input
              value={this.state.phone}
              className="content"
              type="text"
              onChange={e => this.onInputChange(e, "phone")}
            ></input>
          </div>
          <div className="list">
            <span className="name">性别：</span>
            <input
              value={this.state.sex}
              className="content"
              type="text"
              onChange={e => this.onInputChange(e, "sex")}
            ></input>
          </div>
          <button onClick={this.onBtnCLick}>确定</button>
          <button onClick={this.props.onBtnCLickNo}>取消</button>
        </div>
      </div>
    );
  }
}

class SearchBox extends React.Component {
  render() {
    return (
      <div className="searchBox">
        <input type="text" className="searchInput" id="inputText"></input>
        <span className="searchBtn" onClick={this.props.onSearchClick}>
          Search!
        </span>
        <span className="searchBtn" onClick={() => this.props.onAddClick(0)}>
          Add!
        </span>
      </div>
    );
  }
}

class TableBox extends React.Component {
  dataTable = () => {
    const data = this.props.data;
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
              <button onClick={() => this.props.onSaveClick(index, 1)}>
                修改
              </button>
              <button onClick={() => this.props.onDelClick(index)}>删除</button>
            </div>
          </li>
        );
      });
    } else {
      return <li className="noList">暂无信息</li>;
    }
  };

  render() {
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
          {this.dataTable()}
        </ul>
      </div>
    );
  }
}

export default TodoListBox;
