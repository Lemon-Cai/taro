/*
 * @Author: CaiPeng
 * @Date: 2023-02-09 13:19:02
 * @LastEditors: caipeng
 * @LastEditTime: 2023-02-09 13:29:31
 * @FilePath: \React\Taro\myTaroApp\src\pages\subPages\analysis\index.jsx
 * @Description: 
 */
import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.less'

export default class Analysis extends Component {


  componentDidMount () {
    console.log(this.props)
   }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='Analysis'>
        <Text>分包 Analysis </Text>
      </View>
    )
  }
}
