import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.less'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }
  
  componentDidHide () { }

  render () {
    const html = `<h1 style="color: red">Wallace is way taller than other reporters.</h1>`

    return (
      <View className='index'>
        <View dangerouslySetInnerHTML={{__html: html}}></View>
        <Text>Hello world!</Text>
      </View>
    )
  }
}
