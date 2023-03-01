/*
 * @Author: CaiPeng
 * @Date: 2022-10-27 14:35:47
 * @LastEditors: caipeng
 * @LastEditTime: 2023-02-23 16:16:02
 * @FilePath: \qince-taro\src\pages\Blog\Daily\index.js
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
      //   setUrl(`${host}/wework/#/blog/blogDaily?id=${params.id}&token=${token}&timestamp=${new Date().getTime()}`)
      // }
    }
  })

  useReady(() => {
    const host = Taro.getStorageSync('appsvrUrl')
    const token = Taro.getStorageSync('qince-token')
    let {params = {}} = router
    if (token) {
      setUrl(`${host.endsWith('/') ? host : (host + '/')}wework/#/blog/blogDaily?id=${params.id}&token=${token}`)
    }
  })

  useUnload(() => {
    console.log('onUnload')
  })

  const handleWebviewLoad = (e) => {
    console.log(e)
  }

  return url && (
    <WebView src={url} onLoad={handleWebviewLoad} />
  )
}

export default Daily