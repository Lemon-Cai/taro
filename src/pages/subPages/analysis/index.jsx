/*
 * @Author: CaiPeng
 * @Date: 2023-02-09 13:19:02
 * @LastEditors: caipeng
 * @LastEditTime: 2023-03-30 19:28:48
 * @FilePath: \React\Taro\taro\src\pages\subPages\analysis\index.jsx
 * @Description:
 */
import { useReady } from "@tarojs/taro";
import { useRef, useState } from "react";
import { View, Text, MovableArea, MovableView } from "@tarojs/components";
import "./index.less";

function Analysis() {

  let {current: moveRef} = useRef({})
  const [state, setState] = useState({
    branchid: "",
    appdocid: "",
    tabList: [
      {
        name: "十步杀一人"
      },
      {
        name: "千里不留行"
      },
      {
        name: "事了拂衣去"
      },
      {
        name: "深藏身与名"
      }
    ],
    //移动的是哪个元素块
    moveId: null,
    //最终停止的位置
    endX: 0,
    endY: 0
  });

  function initMove(list) {
    let tabList = [...list];
    var tarr = [];
    tabList.forEach(function(ele, index) {
      let obj = ele;
      obj.id = index;
      obj.x = 30;
      obj.y = 100 * index + 20;
      tarr.push(obj);
    });
    console.log(tarr);
    setState(prev => ({
      ...prev,
      tabList: tarr
    }));
  }
  function handleMoveEnd(e) {
    console.log(e);
    let arr = [...state.tabList].map(item => {
      if (item.id === moveRef.moveId) {
        return {
          ...item,
          x: moveRef.endX,
          y: moveRef.endY
        }
      }
      return {...item}
    })
    initMove(arr.sort(compare));
    setTimeout(function() {
      
    }, 500);

    //计算位置
  }
  function handleMoving(e) {
    // console.log(e)
    //移动的块ID
    var moveid = e.currentTarget.dataset.moveid;
    //最终坐标
    let x = e.detail.x;
    let y = e.detail.y;
    moveRef = {
      moveId: moveid,
      endX: x,
      endY: y
    }
    // setState(prev => ({
    //   ...prev,
      
    // }));
  }
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  useReady(() => {
    initMove(state.tabList);
  });
  return (
    <View className="Analysis">
      <MovableArea
        className="padding text-center bg-grey"
        style={{width:'100%', height:'500px'}}
      >
        {state.tabList.map((item, index) => (
          <MovableView
            className="radius shadow bg-white"
            style={{
              width: "80%",
              height: "80px",
              zIndex: index === state.moveId ? 2 : 1
            }}
            key={`${uuid()}_${index}`}
            x={item.x}
            y={item.y}
            direction="all"
            onChange={handleMoving}
            onTouchEnd={handleMoveEnd}
            data-moveid={index}
          >
            {item.name}
          </MovableView>
        ))}
      </MovableArea>
    </View>
  );
}

function uuid (a) {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, function (a) {
    return (a^Math.random()*16>>a/4).toString(16)
  })
}

var compare = function(obj1, obj2) {
  var val1 = obj1.y;
  var val2 = obj2.y;
  if (val1 < val2) {
    return -1;
  } else if (val1 >= val2) {
    return 1;
  } else {
    return 0;
  }
};

export default Analysis;
