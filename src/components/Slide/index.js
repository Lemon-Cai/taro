import { MovableArea, MovableView, View } from '@tarojs/components'
import { useState } from 'react'

import './index.less'

const Slide = ({ field = {}, index, onDelete, onTouchstart }) => {
  const [state, setState] = useState({
    x: 0, // 注意，这里通过x属性设置的宽度的单位是px
    start_x: 0,
    start_y: 0,
    operations_visible: false
  })
  const handleTouchStart = e => {
    const { clientX, clientY } = e.touches[0];

    // 开始滑动前，把已有处于滑动状态的复位，清空所有滑动状态
    onTouchstart?.()

    setState(prev => ({
      ...prev,
      start_x: clientX,// 触摸开始时的横坐标
      start_y: clientY
    }))
  }
  const handleTouchEnd = e => {
    const { clientX, clientY } = e.changedTouches[0];

    if (Math.abs(clientY - state.start_y) > 50)  return; // 处理上下滑动误触左右滑动的情况

    const direction = clientX - state.start_x // 判断滑动的方向

    // // 这里使用1来判断方向，保证用户在非滑动时不触发滚动（有时点击也会产生些许x轴坐标的变化）
    // if (direction < -1) {
    //   showOperations()
    // } else if (direction > 1) {
    //   hideOperations()
    // } else {
    //   toBrandDetail()
    // }

    if (Math.abs(clientY - state.start_y) < Math.abs(clientX - state.start_x)) {
      // 判断是左右滑动
      if (direction >= 0) {

      } else {
        if (state.start_x - clientX >= 20) {
          // 偏移大于阈值时才显示操作按钮
          showOperations()
        } else {
          // 偏移小于阈值，恢复
          hideOperations()
        }
      }
    } else {
      // 上下滑动置为 0
      hideOperations()
    }
  }

  const toBrandDetail = () => {

  }

  const toggle = () => {
    let operations_visible = state.operations_visible

    if (operations_visible) {
      hideOperations()
    } else {
      showOperations()
    }
  }
  const handleDelete = () => {
    hideOperations()
    onDelete?.(field, index)
  }
  const showOperations = () => {
    setState(prev => ({
      ...prev,
      x: -140,
      operations_visible: true
    }))
  }

  const hideOperations = () => {
    setState(prev => ({
      ...prev,
      x: 0,
      operations_visible: false
    }))
  }
  const emptyFunc = () => {
    return false
  }

  return (
    <View class='container'>
      <MovableArea>
        <MovableView
          direction='horizontal'
          outOfBounds
          friction={100}
          damping={100}
          x={state.x}
          onTouchstart={handleTouchStart}
          onTouchend={handleTouchEnd}>
          <View className='card-container'>
            <View>{field.text}</View>
            <View className='show-operations' catchTouchStart={toggle} catchTouchEnd={emptyFunc}>
              ...
            </View>
          </View>
        </MovableView>
      </MovableArea>
      <View className='operations-content'>
        <View className='operation-button' onClick={handleDelete}>
          删除
        </View>
      </View>
    </View>
  )
}

export default Slide
