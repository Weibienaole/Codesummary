import React from "react";
import "./index.css";
const data = [
  {
    category: "Sporting Goods",
    price: "$49.99",
    stocked: true,
    name: "Football"
  },
  {
    category: "Sporting Goods",
    price: "$9.99",
    stocked: true,
    name: "Baseball"
  },
  {
    category: "Sporting Goods",
    price: "$29.99",
    stocked: false,
    name: "Basketball"
  },
  {
    category: "Electronics",
    price: "$99.99",
    stocked: true,
    name: "iPod Touch"
  },
  {
    category: "Electronics",
    price: "$399.99",
    stocked: false,
    name: "iPhone 5"
  },
  { category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7" }
];

function dataInit() {
  const titleArr = {};
  const arr = [];
  data.map(item => {
    if (arr.indexOf(item.category) === -1) {
      arr.push(item.category);
      titleArr[item.category] = {};
    }
  });
  for (let i in titleArr) {
    let arrs = [];
    data.map(item => {
      if (i === item.category) {
        arrs.push(item);
      }
    });
    titleArr[i] = arrs;
  }
  return titleArr;
}
class FormBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      showCargo: false,
      value: ""
    };
    this.checkBoxChange = this.checkBoxChange.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
  }
  componentDidMount() {
    this.setState({
      data: dataInit()
    });
    console.log(this.props.history.location.state)
  }
  checkBoxChange(e) {
    e.persist();
    const showFalse = e.target.checked;
    this.setState({ showCargo: showFalse });
  }
  onChangeInput(e) {
    e.persist();
    const value = e.target.value;
    this.setState({ value: value });
  }
  render() {
    return (
      <div className="formBox">
        <SearchBox onChangeInput={this.onChangeInput}>
          <div>
            <input type="checkbox" onChange={this.checkBoxChange}></input>
            只看有货
          </div>
        </SearchBox>
        <ShowDataBox
          data={this.state.data}
          showCargo={this.state.showCargo}
          changeValue={this.state.value}
        ></ShowDataBox>
        <a href="/">back App</a>
      </div>
    );
  }
}

class SearchBox extends React.Component {
  render() {
    return (
      <div className="searchBox">
        <input
          type="text"
          placeholder="请输入..."
          onChange={e => this.props.onChangeInput(e)}
        ></input>
        {this.props.children}
      </div>
    );
  }
}
class ShowDataBox extends React.Component {
  render() {
    const data = this.props.data;
    const title = Object.keys(data);
    const showBoolean = this.props.showCargo;
    const changeValue = this.props.changeValue;
    return (
      <div className="showData">
        <div className="titleName">
          <div className="title textL">Name</div>
          <div className="title textR">Price</div>
        </div>
        <div className="ShowData">
          {title.map((item, index) => {
            return (
              <ul className="listData" key={index}>
                <span className="title">{item}</span>
                <DataItem
                  data={data[item]}
                  showBoolean={showBoolean}
                  changeValue={changeValue}
                ></DataItem>
              </ul>
            );
          })}
        </div>
      </div>
    );
  }
}
class DataItem extends React.Component {
  dataRetrun() {
    const data = this.props.data;
    const changeValue = this.props.changeValue;
    const obj = [];
    if (changeValue.length !== 0) {
      for (let i in data) {
        if (data[i].name.indexOf(changeValue) !== -1) {
          obj.push(data[i]);
        }
      }
      return obj;
    } else return data;
  }
  render() {
    const showBoolean = this.props.showBoolean;
    const data = this.dataRetrun();
    return (
      <div>
        {data.map((item, index) => {
          if (showBoolean && item.stocked) {
            return <ItemLi data={item} key={index}></ItemLi>;
          } else if (!showBoolean) {
            return <ItemLi data={item} key={index}></ItemLi>;
          }
        })}
      </div>
    );
  }
}
function ItemLi(props) {
  let data = props.data;
  let color = data.stocked ? "" : "noMuch";
  return (
    <li className={"itemData" + " " + color}>
      <div className="textL">{data.name}</div>
      <div className="textR">{data.price}</div>
    </li>
  );
}
export default FormBox;
