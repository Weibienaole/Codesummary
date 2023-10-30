_jsx_

```javascript
function Page({ history }) {
  let [fromData, setFromData] = useState([
    {
      label: "真实姓名",
      value: "",
      errorTips: "您输入的姓名有误",
      checkVal: (val) => nameTest(val),
      errorLineShow: false,
    },
    {
      label: "手机号",
      value: "",
      type: "number",
      errorTips: "您输入的格式不正确",
      checkVal: (val) => phoneTest(val),
      errorLineShow: false,
    },
    {
      label: "验证码",
      value: "",
      type: "number",
      phoneCode: true,
      errorTips: "您输入的验证码格式不正确",
      checkVal: (val) => hobbieTest(val),
      errorLineShow: false,
    },
    {
      label: "id",
      value: "",
      disable: true,
      errorLineShow: false,
      // 项目需要，反正就是这个逻辑，只可意会不可言传。
    },
    {
      label: "擅长才艺",
      value: "",
      select: true,
      errorTips: "您没有选择才艺",
      checkVal: (val) => hobbieTest(val),
      errorLineShow: false,
    },
  ]);
  // 更新值
  const setmData = (val, idx) => {
    let oldData = [...fromData];
    oldData[idx].value = val;
    setFromData(oldData);
  };
  // 校验
  const submitFrom = () => {
    let data = [...fromData];
    for (let item of data) {
      if (item.errorTips) item.errorLineShow = !item.checkVal(item.value);
    }
    setFromData(data);
    if (!data.every((item) => item.errorLineShow !== true)) return;
    // 如果走到这里，就说明校验已经通过，可以进行提交了。
  };
  return (
    <div className="fromBox">
      {fromData.map((item, index) => (
        <FromLine
          {...item}
          key={index}
          index={index}
          setmData={(val, idx) => setmData(val, idx)}
          fromData={fromData}
          setData={(data) => setFromData(data)}
        ></FromLine>
      ))}
    </div>
  );
}
function FromLine({
  label,
  value,
  type = "text",
  phoneCode = false,
  disable = false,
  select = false,
  index,
  setmData,
  errorTips,
  errorLineShow,
  fromData,
  setData,
}) {
  const [codeTxt, setCodeTxt] = useState("获取验证码");
  let timer;
  const showActionSheet = () => {
    const BUTTONS = [
      "唱歌",
      "舞蹈",
      "演讲",
      "搞笑",
      "带货",
      "颜值",
      "情感",
      "其他",
      "关闭",
    ];
    ActionSheet.showActionSheetWithOptions(
      {
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        title: "请选择擅长才艺",
        maskClosable: true,
        "data-seed": "logId",
        wrapProps,
      },
      (buttonIndex) => {
        if (buttonIndex === BUTTONS.length - 1) return;
        setmData(BUTTONS[buttonIndex], 4);
      }
    );
  };
  const getCode = async () => {
    if (codeTxt !== "获取验证码") return;
    let data = [...fromData];
    let { value, checkVal } = data[1];
    if (!checkVal(value)) return Toast.offline("请输入正确的手机号！");
    let res = await request("这个值为你的接口返回的shu ju");
    console.log(res);
    data[3].value = res.identifier;
    setData(data);
    startTime(60);
    function startTime(time) {
      setCodeTxt(time);
      if (time === 0) {
        clearTimeout(timer);
        let timer2 = setTimeout(() => {
          setCodeTxt("获取验证码");
          clearTimeout(timer2);
        }, 1000);
        return;
      }
      timer = setTimeout(() => startTime(--time), 1000);
    }
  };
  return (
    <div className="fromLineBox">
      <div className="label">
        {label.split("").map((item, index) => (
          <span className="txt" key={index}>
            {item}
          </span>
        ))}
      </div>
      <div className="valueBox">
        <input
          type={type}
          value={value}
          disabled={disable}
          className="inpVal"
          onChange={(e) => {
            e.stopPropagation();
            !select && setmData(e.target.value, index);
          }}
          onClick={() => select && showActionSheet()}
        />
        {phoneCode && (
          <div className="getCode" onClick={getCode}>
            {codeTxt}
          </div>
        )}
        {select && (
          <span className="selectBtn" onClick={showActionSheet}>
            请选择
          </span>
        )}
      </div>
      {errorTips && errorLineShow && (
        <div className="errorTipsLine">* {errorTips}</div>
      )}
    </div>
  );
}
function phoneTest(phone) {
  return /^1(3\d|4\d|5\d|6\d|7\d|8\d|9\d)\d{8}$/g.test(phone);
}
function nameTest(name) {
  let ChinaTxtReg = new RegExp("^[\u4e00-\u9fa5]+$");
  return ChinaTxtReg.test(name);
}
function hobbieTest(val) {
  return !!val;
}

export default withRouter(Page);
```

_css_

```css
.fromBox {
  width: 43.13rem;
  height: 37.5rem;
  margin: 3.06rem auto 5rem;
  display: flex;
  align-content: space-between;
  flex-wrap: wrap;
  .fromLineBox {
    width: 100%;
    height: 5.63rem;
    background: #ecedef;
    border-radius: 3.28rem;
    display: flex;
    align-items: center;
    position: relative;
    .label {
      width: 7.5rem;
      padding: 0 1.56rem 0 2.25rem;
      height: 3.88rem;
      font-size: 1.8rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #6a6a7c;
      line-height: 3.88rem;
      display: flex;
      justify-content: space-between;
      border-right: 0.06rem solid #d8d8d8;
    }
    .valueBox {
      width: 29.5rem;
      height: 3.88rem;
      display: flex;
      align-items: center;
      position: relative;
      .inpVal {
        width: 100%;
        font-size: 1.8rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.8);
        line-height: 3.88rem;
        background: none;
        text-indent: 1rem;
      }
      .getCode {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
        width: 10.06rem;
        height: 3.38rem;
        background: #c91220;
        border-radius: 1.69rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
      .selectBtn {
        position: absolute;
        right: 2.19rem;
        top: 50%;
        transform: translate(0, -50%);
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #6a6a7c;
        font-size: 1.88rem;
      }
    }
    .errorTipsLine {
      position: absolute;
      left: 2.25rem;
      bottom: -30%;
      font-size: 1.25rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #c91220;
      line-height: 1.75rem;
    }
  }
}
```

_最后大概就是这个样子_

![在这里插入图片描述](https://img-blog.csdnimg.cn/aca5dc5fc9fb452d8c98b0766e757ce9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5oOz5b-F5piv5rij5rij5a6H5LqG,size_20,color_FFFFFF,t_70,g_se,x_16)

# 如果转载，请标明地址，谢谢。
