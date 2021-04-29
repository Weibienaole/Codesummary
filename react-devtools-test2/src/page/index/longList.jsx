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

export default class App extends React.Component {
  state = { scrollTop: 0 };
  height = 800;
  total = 10000;
  rowHeight = 80;
  bufferSize = 5;

  scrollingContainer = React.createRef();

  limit = Math.ceil(this.height / this.rowHeight);
  originStartIdx = 0;
  startIndex = 0;
  endIndex = Math.min(
    this.originStartIdx + this.limit + this.bufferSize,
    this.total - 1
  );

  onScroll = (e) => {
    if (e.target === this.scrollingContainer.current) {
      const { scrollTop } = e.target;
      const { originStartIdx, bufferSize, total, limit } = this;
      const currentStartIndex = Math.floor(scrollTop / this.rowHeight);
      if (currentStartIndex !== originStartIdx) {
        this.originStartIdx = currentStartIndex;
        this.startIndex = Math.max(currentStartIndex - bufferSize, 0);
        this.endIndex = Math.min(
          currentStartIndex + limit + bufferSize,
          total - 1
        );
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
            borderBottom: "1px solid #000",
            width: "100%"
          }
        })
      );
    }
    return content;
  };

  getTransform() {
    const { scrollTop } = this.state;
    const { rowHeight, bufferSize, originStartIdx } = this;

    return `translate3d(0,${
      scrollTop -
      (scrollTop % rowHeight) -
      Math.min(originStartIdx, bufferSize) * rowHeight
    }px,0)`;
  }

  render() {
    const { height, total, rowHeight } = this;
    return (
      <div
        ref={this.scrollingContainer}
        style={{
          overflowX: "hidden",
          overflowY: "auto",
          height: height,
          backgroundColor: "#e8e8e8",
          position: "relative"
        }}
        onScroll={this.onScroll}
      >
        <div
          style={{
            height: total * rowHeight,
            position: "relative",
            zIndex: -1
          }}
        ></div>
        <div
          style={{
            width: "100%",
            position: "absolute",
            top: 0,
            transform: this.getTransform()
          }}
        >
          {this.renderDisplayContent()}
        </div>
      </div>
    );
  }
}
