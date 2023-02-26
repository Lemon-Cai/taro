/*
 * @Author: CaiPeng
 * @Date: 2023-02-09 09:13:49
 * @LastEditors: caipeng
 * @LastEditTime: 2023-02-09 13:24:28
 * @FilePath: \React\Taro\myTaroApp\src\pages\report\index.jsx
 * @Description: 
 */
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { View, Text, Button } from '@tarojs/components'
import './index.less'

export default function Home() {
  const [state, setState] = useState({
    html: `<h1 style="color: red">Wallace is way taller than other reporters.</h1>`
  })

  const handleGo = () => {
    Taro.navigateTo({
      url: '/pages/subPages/analysis/index?id=1',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function(data) {
          console.log(data)
        },
        someEvent: function(data) {
          console.log(data)
        }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
  }
  return (
    <View className='page'>
      <View className='section'>
        <View dangerouslySetInnerHTML={{ __html: state.html }}></View>
        <Text>Hello world!</Text>
      </View>


      <View className='section'>
        <Button onClick={handleGo}>go to analysis</Button>
      </View>
    </View>
  )
}
