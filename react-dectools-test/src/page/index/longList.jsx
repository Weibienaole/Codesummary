import React from "react";

const rowRenderer = ({ index, style }) => {
  // const item = this.state.list[index];
  const item = index;
  return (
    <li
      key={item}
      style={style}
      onClick={() => {
        console.log("item-", index);
      }}
    >
      item-{item}
    </li>
  );
};

class App extends React.Component {
  // 初始化高度为0
  state = { scrollTop: 0 };
  // 设定容器高度 -- 需要滚动的容器
  height = 736;
  // 消息条目
  total = 10000;
  // 每条信息/单个栏的高度
  rowHeight = 80;

  // 向上取当前容器内最大可以显示多少条/栏信息
  limit = Math.ceil(this.height / this.rowHeight);
  // 设置起始下标
  startIndex = 0;
  // 设置结束坐标 -> Math.min(起始值 + 容器所能存放的最大条目数, 总条目 - 1)
  endIndex = Math.min(this.startIndex + this.limit, this.total - 1);

  // 滚动容器的ref
  scrollingContainer = React.createRef();

  // scroll监听函数
  onScroll = (e) => {
    // 判断当前监听的容器是否是需要相应的事件
    if (e.target === this.scrollingContainer.current) {
      // 当前滚动高度
      const { scrollTop } = e.target;
      const { startIndex, total, rowHeight, limit } = this;
      // 计算当前最上方显示的是哪个栏  高度 / 单个栏高度
      const currIndex = Math.floor(scrollTop / rowHeight);

      // 如果 currIndex 不再是 起始下标的值，说明试图上对应的栏发生了变化
      if (startIndex !== currIndex) {
        // 重新赋值
        this.startIndex = currIndex;
        // 重新设置 结束坐标 原理同上
        this.endIndex = Math.min(currIndex + limit, total - 1);
        // 更新改动下标之后的 scrollTop
        this.setState({ scrollTop: scrollTop });
      }
    }
  };

  renderDisplayContent = () => {
    const { rowHeight } = this;

    const content = [];
    for (let i = this.startIndex; i <= this.endIndex; ++i) {
      content.push(
        rowRenderer({
          index: i,
          style: {
            height: rowHeight - 1 + "px",
            lineHeight: rowHeight + "px",
            left: 0,
            right: 0,
            position: "absolute",
            // 动态计算top
            top: i * rowHeight,
            borderBottom: "1px solid #000",
            width: "100%"
          }
        })
      );
    }
    console.log(content);
    return content;
  };

  render() {
    const { height, total, rowHeight } = this;
    return (
      <div
        ref={this.scrollingContainer}
        style={{
          overflowX: "hidden",
          overflowY: "auto",
          height: height,
          backgroundColor: "#e8e8e8"
        }}
        onScroll={this.onScroll}
      >
        <div style={{ height: total * rowHeight, position: "relative" }}>
          {this.renderDisplayContent()}
        </div>
      </div>
    );
  }
}


export default App