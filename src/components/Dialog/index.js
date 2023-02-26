/*
 * @Author: CaiPeng
 * @Date: 2023-02-23 19:58:52
 * @LastEditors: caipeng
 * @LastEditTime: 2023-02-24 16:20:30
 * @FilePath: \React\Taro\myTaroApp\src\components\Dialog\index.js
 * @Description: 
 */
import Taro from '@tarojs/taro'
import React, { useState, useImperativeHandle, forwardRef } from 'react'
import { View } from '@tarojs/components'
import { useEffect } from 'react'

import Mask from '../Mask'
import './index.less'

function Index (props, ref) {
  const app = Taro.getSystemInfoSync();
  const { top } = app.safeArea;
  const { children = '', width = 305, show = false, onClickMask } = props
  // 暴露给父组件的实例值
  useImperativeHandle(ref, () => ({
    handleShowModal,
    handleHideModal
  }))
  //  创建一个动画实例 animation
  let animation = Taro.createAnimation({
    duration: 300, // 动画持续时间，单位 ms
    timingFunction: "ease", // 动画的效果,可选linear、ease、ease-in、ease-in-out、ease-out、step-start、step-end
    delay: 0 // 动画延迟时间，单位 ms
  });
  const [animationData, setAnimationData] = useState({})
  const [showModal, setShowModal] = useState(show)

  useEffect(() => {
    if (show) {
      handleShowModal()
    } else {
      handleHideModal()
    }
  }, [show])
  const handleShowModal = () => {
    setShowModal(true)
    setTimeout(() => {
      fadeInOrDown(0)
    }, 100)
  }
  const handleHideModal = () => {
    fadeInOrDown(width)
    setTimeout(() => {
      setShowModal(false)
    }, 300)
  }
  const fadeInOrDown = (postionX) => {
    // step()表示一组动画完成。可以在一组动画中调用任意多个动画方法，一组动画中的所有动画会同时开始，一组动画完成后才会进行下一组动画。
    animation.translateX(postionX).step() // 对 X 轴平移
    setAnimationData(animation.export())//动画实例的export方法导出动画数据传递给组件的animation属性
  }

  return (
    <>
      {
          showModal && 
          <>
            <Mask controlMask={onClickMask} />
            <View className="filter_container" style={`top: ${0}px; transform: translate(${show ? 0 : width}px, 0)`}  animation={animationData}>
              {
                children
              }
            </View>
          </>
        }
    </>
  )
}

export default forwardRef(Index)