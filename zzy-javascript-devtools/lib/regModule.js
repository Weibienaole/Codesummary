class RegModules {
  // 身份证
  isIdCard(idCard) {
    if (typeof idCard === 'number') idCard = parseFloat(idCard) || String(idCard)
    idCard = idCard.trim()
    function validateIdCard(idCard) {
      var vcity = {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        54: '西藏',
        61: '陕西',
        62: '甘肃',
        63: '青海',
        64: '宁夏',
        65: '新疆',
        71: '台湾',
        81: '香港',
        82: '澳门',
        91: '国外',
      }
      //是否为空
      if (idCard === '') {
        return false
      }
      //校验长度，类型
      if (isCardNo(idCard) === false) {
        return false
      }
      //检查省份
      if (checkProvince(idCard, vcity) === false) {
        return false
      }
      //校验生日
      if (checkBirthday(idCard) === false) {
        return false
      }
      //检验位的检测
      if (checkParity(idCard) === false) {
        return false
      }
      return true
    }

    // 检查号码是否符合规范，包括长度，类型
    function isCardNo(card) {
      //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
      var reg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/
      if (reg.test(card) === false) {
        return false
      }
      return true
    }

    // 取身份证前两位,校验省份
    function checkProvince(card, vcity) {
      var province = card.substr(0, 2)
      if (vcity[province] == undefined) {
        return false
      }
      return true
    }

    // 检查生日是否正确
    function checkBirthday(card) {
      var len = card.length
      //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
      if (len == '15') {
        var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/
        var arr_data = card.match(re_fifteen)
        var year = arr_data[2]
        var month = arr_data[3]
        var day = arr_data[4]
        var birthday = new Date('19' + year + '/' + month + '/' + day)
        return verifyBirthday('19' + year, month, day, birthday)
      }
      //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
      if (len == '18') {
        var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/
        var arr_data = card.match(re_eighteen)
        var year = arr_data[2]
        var month = arr_data[3]
        var day = arr_data[4]
        var birthday = new Date(year + '/' + month + '/' + day)
        return verifyBirthday(year, month, day, birthday)
      }
      return false
    }

    // 校验日期
    function verifyBirthday(year, month, day, birthday) {
      var now = new Date()
      var now_year = now.getFullYear()
      //年月日是否合理
      if (
        birthday.getFullYear() == year &&
        birthday.getMonth() + 1 == month &&
        birthday.getDate() == day
      ) {
        //判断年份的范围（0岁到100岁之间)
        var time = now_year - year
        if (time >= 0 && time <= 100) {
          return true
        }
        return false
      }
      return false
    }
    // 校验位的检测
    function checkParity(card) {
      //15位转18位
      card = changeFivteenToEighteen(card)
      var len = card.length
      if (len == '18') {
        var arrInt = new Array(
          7,
          9,
          10,
          5,
          8,
          4,
          2,
          1,
          6,
          3,
          7,
          9,
          10,
          5,
          8,
          4,
          2
        )
        var arrCh = new Array(
          '1',
          '0',
          'X',
          '9',
          '8',
          '7',
          '6',
          '5',
          '4',
          '3',
          '2'
        )
        var cardTemp = 0,
          i,
          valnum
        for (i = 0; i < 17; i++) {
          cardTemp += card.substr(i, 1) * arrInt[i]
        }
        valnum = arrCh[cardTemp % 11]
        if (valnum == card.substr(17, 1).toLocaleUpperCase()) {
          return true
        }
        return false
      }
      return false
    }

    // 15位转18位身份证号
    function changeFivteenToEighteen(card) {
      if (card.length == '15') {
        var arrInt = new Array(
          7,
          9,
          10,
          5,
          8,
          4,
          2,
          1,
          6,
          3,
          7,
          9,
          10,
          5,
          8,
          4,
          2
        )
        var arrCh = new Array(
          '1',
          '0',
          'X',
          '9',
          '8',
          '7',
          '6',
          '5',
          '4',
          '3',
          '2'
        )
        var cardTemp = 0,
          i
        card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6)
        for (i = 0; i < 17; i++) {
          cardTemp += card.substr(i, 1) * arrInt[i]
        }
        card += arrCh[cardTemp % 11]
        return card
      }
      return card
    }
    return validateIdCard(idCard)
  }
  // 验证护照（包含香港、澳门）
  isPassport(val) {
    return /(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/g.test(val)
  }
  // 手机号
  isPhone(phone) {
    return /^1(3\d|4\d|5\d|6\d|7\d|8\d|9\d)\d{8}$/g.test(phone)
  }
  // 验证手机号中国(严谨), 根据工信部2019年最新公布的手机号段
  isPhoneStrict(phone) {
    return /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/g.test(phone);
  }
  // 验证座机电话(国内),如: 0341-86091234
  isLandlineTelephone(phone) {
    return /\d{3}-\d{8}|\d{4}-\d{7}/g.test(phone)
  }
  // 姓名
  isName(name) {
    let ChinaTxtReg = new RegExp('^[\u4e00-\u9fa5]+$')
    return ChinaTxtReg.test(name)
  }
  // 英文
  isEnglish(val) {
    let reg = /^[a-zA-Z]+$/
    return reg.test(val)
  }
  // 整数
  isInteger(val) {
    let reg = /^[-+]?\d*$/
    return reg.test(val)
  }
  // 密码 a-z A-Z 0-9  long 6 < val < 21
  isPassword(val) {
    let reg = /^[a-zA-Z0-9_]+$/;
    return reg.test(val) && val.length > 5 && val.length < 21
  }
  // 邮件 email
  isEmail(val) {
    let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return reg.test(val)
  }
  // 地址 链接
  isUrl(val) {
    const str = "^((https|http|ftp|rtsp|mms)://)?[a-z0-9A-Z]{3}\.[a-z0-9A-Z][a-z0-9A-Z]{0,61}?[a-z0-9A-Z]\.com|net|cn|cc (:s[0-9]{1-4})?/$";
    const reg = new RegExp(str);
    return reg.test(val)
  }
  // 价格、金额  带小数的正数，小数点后最多两位
  isMoney(val) {
    const reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    return reg.test(val)
  }
  // 验证邮政编码(中国)
  isPostcode(val) {
    return /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/g.test(val)
  }
  // 验证微信号，6至20位，以字母开头，字母，数字，减号，下划线
  isWeChatNum(val) {
    return /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/g.test(val);
  }
  // 验证16进制颜色
  isColor16(val) {
    return /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/g.test(val);
  }
  // 验证火车车次
  isTrainNum(val) {
    return /^[GCDZTSPKXLY1-9]\d{1,4}$/g.test(val);
  }
  // 验证手机机身码(IMEI)
  isIMEI(val) {
    return /^\d{15,17}$/g.test(val)
  }
  // 验证必须带端口号的网址(或ip)
  isHttpAndPort(val) {
    return /^((ht|f)tps?:\/\/)?[\w-]+(\.[\w-]+)+:\d{1,5}\/?$/g.test(val)
  }
  // 验证统一社会信用代码
  isCreditCode(val) {
    return /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/g.test(val)
  }
  // 验证迅雷链接
  isThunderLink(val) {
    return /^thunderx?:\/\/[a-zA-Z\d]+=$/g.test(val);
  }
  // 验证window"文件夹"路径
  isWindowsFolderPath(val) {
    return /^[a-zA-Z]:\\(?:\w+\\?)*$/g.test(val);
  }
  // 验证window下"文件"路径
  isWindowsFilePath(val) {
    return /^[a-zA-Z]:\\(?:\w+\\)*\w+\.\w+$/g.test(val);
  }
  // 验证版本号格式必须为X.Y.Z
  isVersion(val) {
    return /^\d+(?:\.\d+){2}$/g.test(val);
  }
  // 验证视频链接地址（视频格式可按需增删）
  isVideoUrl(val) {
    return /^https?:\/\/(.+\/)+.+(\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4))$/i.test(val);
  }
  // 验证图片链接地址（图片格式可按需增删）
  isImageUrl(val) {
    return /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(val);
  }
  // 验证银行卡号（10到30位, 覆盖对公/私账户, 参考微信支付）
  isAccountNumber(val) {
    return /^[1-9]\d{9,29}$/g.test(val)
  }
  // 验证车牌号(新能源+非新能源)
  isLicensePlateNumber(val) {
    return /^(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(?:(?:[0-9]{5}[DF])|(?:[DF](?:[A-HJ-NP-Z0-9])[0-9]{4})))|(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/g.test(val);
  }
  // 判读是否为外链 
  isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path);
  }
}

module.exports = RegModules