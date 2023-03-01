import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import { Icons } from '@/components/Icons'

export default props => {
  const { value } = props

  // 点击地址，查看地图
  const handleClick = () => {
    let latlon = value?.location_c?.split(',')
    Taro.openLocation({
      latitude: Number(latlon[0]), // 纬度
      longitude: Number(latlon[1]), // 经度
      name: value?.publish_name, // 位置名
      address: value?.location_a,
      scale: 8
    })
  }

  return (
    <View className="wq-blog-address" onClick={handleClick}>
      <Icons value="location" />
      {value?.location_a}
    </View>
  )
}
