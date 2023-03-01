/*
 * @Author: CaiPeng
 * @Date: 2023-02-23 10:13:08
 * @LastEditors: caipeng
 * @LastEditTime: 2023-02-23 16:21:49
 * @FilePath: \qince-taro\src\pages\Blog\Person\index.jsx
 * @Description: 
 */
import Taro, { useReady, useRouter, useDidShow, useUnload } from '@tarojs/taro'
import { WebView } from '@tarojs/components'

import { useState } from 'react'

import './index.less'

// 日报
const Daily = function () {

  const router = useRouter()

  const [url, setUrl] = useState('')

  useDidShow(() => {
    let pages = Taro.getCurrentPages()
    if (pages.length > 0) {
      // let currPage = pages[pages.length - 1]
      // if (currPage?.data?.message?.action === 'reload') {
      //   let {params = {}} = router

      //   const host = Taro.getStorageSync('appsvrUrl')
      //   const token = Taro.getStorageSync('qince-token')
      //   setUrl(`${host}/wework/#/blog/blogPerson?id=${params.id}&userId=${params.userId}&tempUserCode=${params.tempUserCode}&token=${token}&timestamp=${new Date().getTime()}`)
      // }
    }
  })

  useReady(() => {
    const host = Taro.getStorageSync('appsvrUrl')
    const token = Taro.getStorageSync('qince-token')
    let {params = {}} = router
    if (token) {
      setUrl(`${host.endsWith('/') ? host : (host + '/')}wework/#/blog/blogPerson?id=${params.id}&userId=${params.userId}&tempUserCode=${params.tempUserCode}&token=${token}`)
    }
  })

  const handleWebviewLoad = (e) => {
    console.log(e)
  }

  const handleMessage = () => {
    console.log('handleMessage')
  }
  
  useUnload(() => {
    console.log('onUnload')
  })

  return url && (
    <WebView src={url} onLoad={handleWebviewLoad} onMessage={handleMessage} />
  )
}

export default Daily