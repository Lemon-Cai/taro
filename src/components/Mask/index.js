import React from 'react'

import { View } from '@tarojs/components'
import './index.less'

function Index(props) {
  const { controlMask } = props
  const handleMask = () => {
    controlMask && controlMask()
  }
  return (
    <View className="mask" onClick={() => handleMask()}></View>
  )
}

export default Index