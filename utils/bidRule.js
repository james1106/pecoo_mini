const app = getApp();
/**
 * 竞价规则
 */
function reduceRule (val) {
  if (val <= 100) {
    return 10
  } else if (val <= 500) {
    return 50
  } else if (val <= 1000) {
    return 100
  } else if (val <= 2000) {
    return 200
  } else if (val <= 5000) {
    return 250
  } else if (val <= 10000) {
    return 500
  } else if (val <= 20000) {
    return 1000
  } else if (val <= 50000) {
    return 2000
  } else if (val <= 100000) {
    return 5000
  } else {
    return 10000
  }
}
function AddRule (val) {
  if (val < 100) {
    return 10
  } else if (val < 500) {
    return 50
  } else if (val < 1000) {
    return 100
  } else if (val < 2000) {
    return 200
  } else if (val < 5000) {
    return 250
  } else if (val < 10000) {
    return 500
  } else if (val < 20000) {
    return 1000
  } else if (val < 50000) {
    return 2000
  } else if (val < 100000) {
    return 5000
  } else {
    return 10000
  }
}
/**
 * 减价规则
 * params curPrice 当前输入空价格  maxVal 最大值
 */
function reduceMoney(curPrice) {
  let priceVal = ''
  let step = reduceRule(curPrice); // 当前输入空的值每次减多少
  if (curPrice % step == 0) {
    priceVal = curPrice - step
  } else {
    priceVal = curPrice - curPrice % step
  }
  return priceVal
}
/**
 * 加价规则
 */
function addMoney(curPrice) {
  let priceVal = ''
  let step = AddRule(curPrice); // 当前输入空的值每次减多少
  if (curPrice % step == 0) {
    priceVal = curPrice + step
  } else {
    priceVal = curPrice + curPrice % step
  }
  return priceVal
}
/**
 * 推荐价格
 */
function recommendMoney(price) {
  let list = new Array();
  // 生成价格
  if (price < 100) {
    // 100生成 0-100价格区间50
    var i = 0;
    for (var j = 0; j < 10; j++) {
      i = i + 10;
      if (i <= 100) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 100 && price < 500) {
    // 500生成 100-500价格区间50
    var i = 100;
    for (var j = 0; j < 8; j++) {
      i = i + 50;
      if (i <= 500) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 500 && price < 1000) {
    var i = 500;
    for (var j = 0; j < 5; j++) {
      i = i + 100;
      if (i <= 1000) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 1000 && price < 2000) {
    var i = 1000;
    for (var j = 0; j < 5; j++) {
      i = i + 200;
      if (i <= 2000) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 2000 && price < 5000) {
    var i = 2000;
    for (var j = 0; j < 12; j++) {
      i = i + 250;
      if (i <= 5000) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 5000 && price < 10000) {
    var i = 5000;
    for (var j = 0; j < 10; j++) {
      i = i + 500;
      if (i <= 10000) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 10000 && price < 20000) {
    var i = 10000;
    for (var j = 0; j < 10; j++) {
      i = i + 1000;
      if (i <= 20000) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 20000 && price < 50000) {
    var i = 20000;
    for (var j = 0; j < 15; j++) {
      i = i + 2000;
      if (i <= 50000) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 50000 && price < 100000) {
    var i = 50000;
    for (var j = 0; j < 15; j++) {
      i = i + 5000;
      if (i <= 100000) {
        list.push(i);
      }
    }
    return list;
  } else if (price > 100000) {
    var i = 100000;
    for (var j = 0; j < 15; j++) {
      i = i + 100000;
      list.push(i);
    }
    return list;
  }
  return list;
}
module.exports = {
  reduceMoney: reduceMoney,
  addMoney: addMoney,
  recommendMoney: recommendMoney,
  AddRule: AddRule,
  reduceRule: reduceRule
}    