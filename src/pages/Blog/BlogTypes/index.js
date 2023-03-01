import Taro from '@tarojs/taro'

import { useEffect, useState } from 'react'

import { View, Image } from '@tarojs/components'

import { connect } from 'react-redux'

import fetch from '@/utils/request'
import * as actions from '@/store/Blog'
import './index.less'

// 选则日报模板
const BlogTypes = props => {
  const { dispatchChangeState } = props

  // 新增日报模板
  const [templates, setTemplates] = useState(() => {
    // 读取缓存的 日报模板
    // let tmp = Taro.getStorageSync('qince-blog-templates') || []
    // return tmp
    return []
  })

  useEffect(() => {
    // Taro.setNavigationBarTitle({
    //   title: `新增日报`
    // })
    _init()
  }, [])

  const _init = () => {
    fetch({
      url: `/app/blog/v8/getBlogModel.do`,
      method: 'POST',
      params: {
        hasRange: 1,
        model_ids: ''
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      if (response.code === '1') {
        if (Array.isArray(response.data?.models)) {
          let data = response.data?.models || []
          if (!!!data.find(item => item.model_id === 'share')) {
            data.push({
              model_id: 'share',
              model_name: '分享',
              blog_type: '2',
              visible_range: '1'
            })
          }
          setTemplates(data)
          // TODO:不知道有什么意义
          // Taro.setStorageSync('qince-blog-templates', response.data?.models)
        }
      }
    })
  }

  // 从缓存中读取数据
  const _loadCache = (model, key) => {
    let newModel = {...model}
    let cacheTabData = Taro.getStorageSync(key) || ''
    newModel.lastSaveTime = cacheTabData?.lastSaveTime || ''
    if (cacheTabData) {
      // 存在缓存
      if (newModel.model_format) {
        // 模板存在
        newModel.model_format = newModel.model_format.map(attr => {
          let cacheVal = cacheTabData[attr.id]
          // if (cacheVal) {
          //   if (attr.input === '3' || attr.input === '4') {
          //     // 单选、多选
          //     cacheVal = cacheVal
          //     attr.option.forEach((v, i) => {
          //       let tmp = cacheVal?.find(tag => tag.key === `${attr.id}-${i}`)
          //       v.checked = !!tmp?.checked
          //     })
          //   }
          // }
          return {
            ...attr,
            value: cacheVal || ''
          }
        })
      } else {
        if (cacheTabData[newModel.model_id]) {
          newModel.value = cacheTabData[newModel.model_id] || ''
        }
      }
    }
    return newModel
  }
  // 点击模板
  const handleItemClick = item => {
    const { app_param = {}, userInfo = {} } = Taro.getStorageSync('qince-loginInfo') || {}
    let obj = {}
    
    
    if (item.blog_type === '2') {
      // 分享
      if (app_param?.blog?.blogall === '1') {
        obj.selectedDeployKey = '0'
      } else {
        obj.selectedDeployKey = '1'
      }
      obj.selectedDeploy = (props.deployRangeEnum || []).find(v => v.key === obj.selectedDeployKey)
    
    } else {
      if (item.visible_range === '2') {
        // 所在部门可见
        obj.selectedDeployKey = '1'
      } else if (item.visible_range === '3' && app_param?.blog?.blogall === '1') {
        // 全公司可见
        obj.selectedDeployKey = '0'
      } else {
        // 仅自己和领导可见
        obj.selectedDeployKey = '-1'
      }
      obj.selectedDeploy = (props.deployRangeEnum || []).find(v => v.key === obj.selectedDeployKey)
    }

    let storeKey = `qince-blog-${userInfo?.userId}-${item.model_id}`
    
    dispatchChangeState({
      selectedTemplate: _loadCache(item, storeKey),
      ...obj
    })
    Taro.navigateTo({
      title: '发日报',
      url: `/pages/Blog/Edit/index?id=${item.model_id}`
    })
  }

  return (
    <View>
      {templates.map(item => {
        return (
          <View key={item.model_id} className='wq-cell' onClick={() => handleItemClick(item)}>
            <Image
              class='wq-media-thumb'
              src={`//res.waiqin365.com/d/wework/blog/model/icon-${item.blog_type}.png`}
            />
            <View class='wq-media-title'>{item.model_name}</View>
            <View className='wq-cell-ft'></View>
          </View>
        )
      })}
    </View>
  )
}

const mapStateToProps = state => ({
  ...state.Blog
})

const mapDispatchToProps = {
  ...actions
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogTypes)
