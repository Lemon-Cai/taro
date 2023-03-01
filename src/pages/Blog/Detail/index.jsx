/*
 * @Author: CaiPeng
 * @Date: 2023-02-20 14:06:44
 * @LastEditors: caipeng
 * @LastEditTime: 2023-02-20 15:55:53
 * @FilePath: \qince-taro\src\pages\Blog\Detail\index.jsx
 * @Description: 
 */
import Taro, { useReady, useRouter } from '@tarojs/taro'
import { WebView } from '@tarojs/components'

import { useState } from 'react'

import './index.less'

const Detail = () => {

  const router = useRouter()

  const [url, setUrl] = useState('')

  useReady(() => {
    const host = Taro.getStorageSync('appsvrUrl')
    const token = Taro.getStorageSync('qince-token')
    let {params = {}} = router
    if (params.url && token) {
      let path = decodeURIComponent(params.url)
      setUrl(`${host}${path}${path.lastIndexOf('?') !== -1 ? '&' : '?'}token=${token}`)
    }
  })

  const handleWebviewLoad = (e) => {
    console.log(e)
  }

  return url && (
    <WebView src={url} onLoad={handleWebviewLoad} />
  )
}
export default Detail