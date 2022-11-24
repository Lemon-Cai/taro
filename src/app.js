// class 模式
// import { Component } from 'react'
// import './app.less'

// class App extends Component {

//   componentDidMount () {}

//   componentDidShow () {}

//   componentDidHide () {}

//   render () {
//     // this.props.children 是将要会渲染的页面
//     return this.props.children
//   }
// }

// export default App

import React, { useEffect } from 'react'

// Taro 额外添加的 hooks 要从 '@tarojs/taro' 中引入
import { useDidShow, useDidHide, useLaunch } from '@tarojs/taro'

import './app.less'

function App (props) {

  useEffect(() => {}, [])

  // 对应 onShow
  useDidShow(() => {})

  // 对应 onHide
  useDidHide(() => {})

  // onLaunch 
  useLaunch((options) => {
    console.log(options)
  })

  return props.children
}

export default App
