/*
 * @Author: CaiPeng
 * @Date: 2022-10-26 18:34:05
 * @LastEditors: caipeng
 * @LastEditTime: 2023-03-01 10:57:27
 * @FilePath: \qince-taro\src\pages\Blog\components\Attention\index.js
 * @Description:
 */
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { Empty } from '@/components/Empty'
import { useEffect } from 'react'

import './index.less'

const Attention = ({
  userId,
  attentionTotal,
  attentionList = [],
  attendLoadComplete,
  dispatchFetchAttendList,
  uploadAttentionBlog,
  dispatchUpdateUserAttention,
}) => {
  useEffect(() => {
    _initAttentionList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const _initAttentionList = () => {
    dispatchFetchAttendList('1').then(async res => {
      if (res.code === '1') {
        let data = (res.data?.attention || []).map(v => ({...v, isFollowed: true}))
        if (data.length === 0) {
          let response = await dispatchFetchAttendList('0')
          if (response.code === '1') {
            data = (response.data?.attention || []).map(v => ({...v, isFollowed: false}))
          }
          uploadAttentionBlog(false, data, 0)
        } else {
          uploadAttentionBlog(true, data, data.length)
        }
      }
    })
  }

  const handleLinkToUserDetail = id => {
    Taro.navigateTo({
      title: '个人动态',
      url: `/pages/Blog/Person/index?id=${id}&userId=${userId}&tempUserCode=${id}`
    })
  }

  const handleToggleAttention = (isFollowed, id) => {
    if (isFollowed) {
      Taro.showModal({
        title: '',
        content: '确定要取消关注吗？',
        success: function(res) {
          if (res.confirm) {
            const params = {
              'params.user_id': id,
              'params.is_attention': '0'
            }
            dispatchUpdateUserAttention(params)
          }
        }
      })
    } else {
      const params = {
        'params.user_id': id,
        'params.is_attention': '1'
      }
      dispatchUpdateUserAttention(params)
    }
  }

  const handleLinkToMyAttention = () => {
    // 跳转到全部关注
    Taro.navigateTo({
      url: '/pages/Blog/AttentionList/index',
      events: {
        async reloadData (flag, list = []) {
          let newArr = attentionList.map(item => {
            let temp = list.find(v => v.id === item.id)
            if (temp) {
              return {
                ...item,
                isFollowed: temp.isFollowed
              }
            } 
            return { ...item }
          }).filter(v => v.isFollowed)
          if (newArr.length === 0) {
            // 已关注列表为0，获取未关注人员列表
            let response = await dispatchFetchAttendList('0')
            if (response.code === '1') {
              let data = (response.data?.attention || []).map(v => ({...v, isFollowed: false}))
              uploadAttentionBlog(flag, data, 0)
            }
          } else {
            uploadAttentionBlog(flag, newArr, newArr.length)
          }
        }
      }
    })
  }

  return attendLoadComplete && (
    <View>
      {!attentionTotal ? (
        <View className='empty-attention'>
          <View className='attention-header'>
            <Text className='header-main'>关注的对象动态都会在这里实时呈现</Text>
            <Text className='header-sub'>在“日报”中点击个人头像，可在个人主页中关注TA哦！</Text>
          </View>
          <View className='attention-list-wrap'>
            <View className='attention-list-header'>您可能感兴趣的人</View>
            {attentionList.length > 0 ? (
              <View className='attention-list-body'>
                {attentionList.map(item => (
                  <View className='attention-list-item' key={item.id}>
                    <View className='att-left-info'>
                      <View className='base-info'>
                        <View
                          className='info-avatar'
                          onClick={() => handleLinkToUserDetail(item.id)}
                        >
                          <Image src={item.small_face} alt />
                        </View>
                        <View className='info-main'>
                          <View className='info-name'>{item.name}</View>
                          <View className='info-position'>{item.depart_name}</View>
                        </View>
                      </View>
                      <View className='recommend-reason'>
                        <Text>{item.reason}</Text>
                      </View>
                    </View>
                    <View
                      className='att-right-btn'
                      onClick={() => handleToggleAttention(item.isFollowed, item.id)}
                    >
                      {!item.isFollowed ? (
                        <View className='btn-not'>关注</View>
                      ) : (
                        <View className='btn-followed'>已关注</View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View className='not-interested'>
                <Empty show='true'></Empty>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View className='has-attention' onClick={handleLinkToMyAttention}>
          <View className='my-attention'>
            <View className='my-attention-text'>我的关注</View>
            <View className='my-attention-num'>
              <Text>{attentionTotal}</Text>
              <Text>人</Text>
              <Text className='right-icon'></Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default Attention
