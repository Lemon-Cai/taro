/*
 * @Author: CaiPeng
 * @Date: 2022-10-26 20:09:00
 * @LastEditors: caipeng
 * @LastEditTime: 2023-02-28 20:43:59
 * @FilePath: \qince-taro\src\pages\Blog\AttentionList\index.js
 * @Description:
 */
import Taro, { useReachBottom } from '@tarojs/taro'
import { useEffect, useState, useRef } from 'react'
import { View, ScrollView, Image } from '@tarojs/components'
import _throttle from 'lodash/throttle'

import { Page, PageBody } from '@/components/Page'
import fetch from '@/utils/request'

import './index.less'
// 数据请求状态
let loading = false

const AttentionList = function() {
  const { windowHeight } = Taro.getSystemInfoSync()

  const { current: pagination } = useRef({
    page: 1,
    rows: 20
  })
  const [state, setState] = useState({
    hasMore: true,
    loading: true,
    refreshing: false, // 是否处于刷新状态
    list: []
  })

  useEffect(() => {
    _initData()
  }, []) // eslint-disable-line

  const _updateState = (val = {}) => {
    setState(prev => ({
      ...prev,
      ...val
    }))
  }

  const _initData = flag => {
    // 分页
    if (flag) {
      pagination.page++
    } else {
      pagination.page = 1
    }
    if (!flag) {
      // flag： true：上拉加载， false： 下拉刷新
      _updateState({ refreshing: true })
    }
    fetch({
      url: `/app/blog/v8/getMyBlogAttention.action`,
      method: 'POST',
      params: {
        'params.attention_type': '1',
        'params.rows': pagination.rows,
        'params.page': pagination.page
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      let { total, code, data } = response
      let hasMore = true
      let newList = []
      if (code === '1') {
        newList =
          pagination.page === 1
            ? (data?.attention || []).map(v => ({ ...v, isFollowed: true }))
            : [...state.list, ...(data?.attention || []).map(v => ({ ...v, isFollowed: true }))]
        // 判断是否无更多数据
        if (newList.length >= total) {
          hasMore = false
        }
        // 判断是否暂无数据
        if ((data?.attention || []).length === 0 && newList.length === 0) {
          hasMore = false
        }
      } else {
        hasMore = false
      }
      setState({
        ...state,
        list: newList,
        refreshing: false,
        hasMore
      })
    })
  }

  // 滑动加载
  useReachBottom(async () => {
    if (state.hasMore) {
      _initData(true)
    }
  })

  // 下拉刷新
  const handleRefresh = e => {
    console.log('first: 刷新', e)
    _initData()
  }

  const handlePageScroll = _throttle(function(e) {
    // currentPage.scrollTop = e.detail.scrollTop
    // _updateRedux()
  }, 500)
  // 触底下拉加载
  const handleScrollBottom = e => {
    console.log('first: 触底', e)
    if (state.hasMore) {
      // 修改加载状态
      // dispatchChangeState({
      //   currentPage: {...currentPage, status: 1},
      //   pages: {
      //     ...state.pages,
      //     [`${focusBlogTypes[activeIndex].id}`]: {...currentPage, status: 1}
      //   }
      // })
      _initData(true)
    }
  }
  const handleLinkToUserDetail = id => {
    const user = Taro.getStorageSync('qince-loginInfo')?.userInfo
    Taro.navigateTo({
      title: '个人动态',
      url: `/pages/Blog/Person/index?id=${id}&userId=${user?.id}&tempUserCode=${id}`
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
  const dispatchUpdateUserAttention = params => {
    if (loading) {
      return
    }
    loading = true
    fetch({
      url: '/app/blog/v8/updateBlogAttentionForEmployee.action',
      params: params,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      if (response.code === '1') {
        let newList = state.list.map(item => {
          return {
            ...item,
            isFollowed: item.id === params['params.user_id'] ? !item.isFollowed : item.isFollowed
          }
        })
        let pages = Taro.getCurrentPages()
        let currentPage = pages[pages.length - 1]
        const eventChannel = currentPage.getOpenerEventChannel()
        // 通知列表页面刷新数据
        let attendList = newList.filter(v => v.isFollowed) // 现在关注的列表
        eventChannel.emit(
          'reloadData',
          attendList.length !== 0,
          newList
        )
        _updateState({
          list: newList
        })
      }
      loading = false
    }).catch(() => {
      loading = false
    })
  }

  return (
    <Page>
      <PageBody>
        <View>
          <ScrollView
            className='scrollView'
            scrollY
            enhanced
            enableBackToTop
            scrollWithAnimation
            refresherEnabled
            // pagingEnabled
            onScroll={handlePageScroll}
            refresherTriggered={state.refreshing}
            onScrollToLower={handleScrollBottom}
            onRefresherRefresh={handleRefresh}
            style={{ maxHeight: `${windowHeight}px` }}
          >
            {state.list?.length > 0 &&
              state.list.map(item => (
                <View class='attention-list-item' key={item.id}>
                  <View class='att-left-info'>
                    <View class='base-info'>
                      <View class='info-avatar' onClick={() => handleLinkToUserDetail(item.id)}>
                        <Image src={item.small_face} alt />
                      </View>
                      <View class='info-main'>
                        <View class='info-name'>{item.name}</View>
                        <View class='info-position'>{item.depart_name}</View>
                      </View>
                    </View>
                  </View>
                  <View
                    class='att-right-btn'
                    onClick={() => handleToggleAttention(item.isFollowed, item.id)}
                  >
                    {!item.isFollowed ? (
                      <View class='btn-not' v-if=''>
                        关注
                      </View>
                    ) : (
                      <View class='btn-followed' v-else>
                        已关注
                      </View>
                    )}
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
      </PageBody>
    </Page>
  )
}

export default AttentionList
