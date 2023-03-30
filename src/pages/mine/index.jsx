import { View, Text, MovableArea, MovableView, Icon } from '@tarojs/components'
import './index.less'
import { useState, useMemo, useEffect, useRef } from 'react'
import Taro, { useReady } from '@tarojs/taro'

import './index.less'


const ROW_HEIGHT = 44 // 行高
const ROW_MARGIN = [12, 12] // 行 margin-top margin-bottom
const columns = 3 // 展示列数

function Mine () {

  let {current: moveRef} = useRef({})
  const wrapperWidth = useRef()

  const [list, setList] = useState(
    [{"id":"-1","name":"全部","title":"全部","type":"1","default":true, disable: true},{"id":"-2","name":"关注","title":"关注","type":"5","default":true},{"id":"-3","name":"@我的","title":"@我的","type":"2","default":true},{"id":"-4","name":"直属下级","title":"直属下级","type":"4","default":true},{"id":"-5","name":"评论","title":"评论","type":"1","default":true},{"id":"-6","name":"我自己的","title":"我自己的","type":"3"},{"id":"1","name":"日报","title":"日报"},{"id":"4","name":"拜访","title":"拜访"},{"id":"6","name":"月报","title":"月报"},{"id":"2","name":"分享","title":"分享"},{"id":"5","name":"周报","title":"周报"}]
  )
  const [wrapperHeight, setWrapperHeight] = useState()
  const [dragList, setDragList] = useState([])

  useReady(() => {
    Taro.createSelectorQuery().select('.drag-wrapper').boundingClientRect(res => {
      // 读取容器的宽
      let padding = 12 // props传递过来， 默认 0，如果外层强制修改容器样式
      console.log(res)
      // 外层容器需要把 padding去掉
      wrapperWidth.current = res.width - padding * 2
      // 处理数据
      _assemblyData(list, wrapperWidth.current)
    }).exec()
  })

  useEffect(() => {

  }, [JSON.stringify(list)])


  // 初始化数据
  const _assemblyData = (list, width) => {
    const rows = Math.ceil(list.length / columns) // 获取到行数
    // 固定每行高 40px
    // 容器的高度 = 行高 * 行数 + 每行的 margin(top, bottom)其中（去掉第一行 margin-top 和最后一行 margin-bottom）
    let height = rows * ROW_HEIGHT + (rows - 1) * ROW_MARGIN.reduce((p, c) => p + c, 0)
    setWrapperHeight(height)

    let itemWidth = Math.floor(width / columns)
    
    setDragList(list.map((item, idx) => {
      // 计算每个元素的位置
      let x = idx % columns
      let y = parseInt(idx / columns)
      return {
        _data: item, // 缓存原始数据
        id: item.id,
        x: x * itemWidth,
        y: y * ROW_HEIGHT,
        name: item.name,
        disable: item.disable, // 默认展示，或设置了disable 不可拖动
        default: item.default,
        sortKey: idx // 排序标识
      }
    }))
  }

  const handleTouchEnd = (e) => {
    console.log('handleTouchEnd', e)
    let arr = [...dragList].map(item => {
      if (item.id === moveRef.moveId) {
        return {
          ...item,
          x: moveRef.endX,
          y: moveRef.endY
        }
      }
      return {...item}
    })
    arr = arr.sort(function (a, b) {
      let res = a.y - b.y
      if (res === 0) {
        res = a.x - b.x
      }
      return res
    })
    _assemblyData(arr, wrapperWidth.current)
  }

  const handleChange = (e) => {
    console.log('handleChange', e)
    var moveid = e.currentTarget.dataset.moveid;
    //最终坐标
    let x = e.detail.x;
    let y = e.detail.y;
    moveRef = {
      moveId: moveid,
      endX: x,
      endY: y
    }
  }

  const handleClickRemove = () => {}

  // 文本内容不确定，动态计算宽度
  const measureWidth = (text) => {
    let ctx = Taro.createCanvasContext('canvas')
    return ctx.measureText(text).width
  }

  
function uuid () {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, function (a) {
    return (a^Math.random()*16>>a/4).toString(16)
  })
}


  return (
    <View className='drag-wrapper'>
      <Text>mine Page</Text>


      <MovableArea style='height: 400px; width: 100%; border: 1px solid; display: flex;'>
        {
          dragList.map((item, idx) => (
            <MovableView
              key={`${uuid()}_${idx}`} // 没次都刷新
              data-moveid={item.id}
              direction='all'
              // onDragStart={handleDragStart}
              // onDragEnd={handleDragEnd}
              // onTouchStart={handleTouchStart}
              // onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              // 拖动过程中触发的事件
              onChange={handleChange}
              className='drag-item'
              disabled={item.disable}
              x={item.x}
              y={item.y}
              style={{ width: `calc(${100 / columns}% - 16px)` }}
            >
              <View
                className="wq-navtab-item"
                data-id={item.id}
                style={{ width: '100%' }}
              >
                <View className="wq-navtab-badge">{item.name}</View>
                {!item.default && (
                  <Icon
                    size='20'
                    className="wq-icon-clear"
                    type="clear"
                    color='#fa6666'
                    onClick={() => handleClickRemove(item)}
                  ></Icon>
                )}
              </View>
            </MovableView>
          ))
        }
        {/* <MovableView
          // onDragStart={handleDragStart}
          // onDragEnd={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          // // 拖动过程中触发的事件
          // onChange={handleChange}
          // // 拖动结束触发的事件
          // onChangeEnd={handleChangeEnd}
          // onHTouchMove={handleHTouchMove}
          // onVTouchMove={handleVTouchMove}
          x="30"
          y={100}
          style='height: 50px; width: 50px; background: blue;' direction='all'></MovableView> */}

      </MovableArea>
    </View>
  )
}

export default Mine