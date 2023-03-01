/*
 * @Author: CaiPeng
 * @Date: 2023-02-23 19:58:52
 * @LastEditors: caipeng
 * @LastEditTime: 2023-02-23 20:16:10
 * @FilePath: \React\Taro\myTaroApp\src\components\Dialog\index.js
 * @Description:
 */
import { useState, useImperativeHandle, forwardRef, useEffect, useMemo } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.less'

function Index(props, ref) {
  const { windowWidth, statusBarHeight, safeArea } = Taro.getSystemInfoSync()
  const { children = '', width, show = false, onClickMask } = props

  const top = useMemo(() => {
    return statusBarHeight - safeArea.top
  }, [statusBarHeight, safeArea])
  
  const transferedWidth = useMemo(() => {
    if (typeof width === 'number') {
      if (width > 0 && width <= 1) {
        return windowWidth * width
      } else {
        return 305
      }
    }
    if (typeof width === 'string') {
      if (width.match(/^(\d*(\.\d+)?)px$/)) {
        return parseFloat(width)
      }

      if (width.match(/^(\d*(\.\d+)?)%$/)) {
        let temp = Math.floor((parseFloat(width) * windowWidth) / 100)
        return temp > windowWidth ? windowWidth : temp
      }
    }
    return 305
  }, [width, windowWidth])
  // 暴露给父组件的实例值
  useImperativeHandle(ref, () => ({
    handleShowModal,
    handleHideModal
  }))
  //  创建一个动画实例 animation
  let animation = Taro.createAnimation({
    duration: 100, // 动画持续时间，单位 ms
    timingFunction: 'ease', // 动画的效果,可选linear、ease、ease-in、ease-in-out、ease-out、step-start、step-end
    delay: 0 // 动画延迟时间，单位 ms
  })
  const [animationData, setAnimationData] = useState({})
  const [showModal, setShowModal] = useState(show)

  useEffect(() => {
    if (show) {
      handleShowModal()
    } else {
      handleHideModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  const handleShowModal = () => {
    setShowModal(true)
    setTimeout(() => {
      fadeInOrDown(0)
    }, 100)
  }
  const handleHideModal = () => {
    fadeInOrDown(transferedWidth)
    setTimeout(() => {
      setShowModal(false)
    }, 100)
  }
  const fadeInOrDown = postionX => {
    // step()表示一组动画完成。可以在一组动画中调用任意多个动画方法，一组动画中的所有动画会同时开始，一组动画完成后才会进行下一组动画。
    animation.translateX(postionX).step() // 对 X 轴平移
    setAnimationData(animation.export()) //动画实例的export方法导出动画数据传递给组件的animation属性
  }

  return (
    <>
      {showModal && (
        <>
          <View className='mask' onClick={onClickMask}></View>
          <View
            className='filter_container'
            style={`top: ${top}px; transform: translate(${show ? 0 : transferedWidth}px, 0)`}
            animation={animationData}
          >
            {children}
          </View>
        </>
      )}
    </>
  )
}

export default forwardRef(Index)
