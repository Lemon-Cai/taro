import Taro, { useShareAppMessage, useShareTimeline, useReady } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { ScrollView, RootPortal, View } from '@tarojs/components'
import { connect } from 'react-redux'
import classNames from 'classnames'
import _cloneDeep from 'lodash/cloneDeep'
import _throttle from 'lodash/throttle'

import { Page, PageAffix, PageBody } from '@/components/Page'
import { Tabs, TabsPanel } from '@/components/Tabs'
import { LoadMore } from '@/components/LoadMore'
import { Empty } from '@/components/Empty'

import fetch from '@/utils/request'

import * as actions from '@/store/Blog'

import Search from './components/Search'
import Panel from './components/Panel'
import Attention from './components/Attention'
import BlogNav from './components/BlogNav'
import BlogComment from './components/Comment'

import './index.less'
import Share from './components/Share'
// import PageSegment from '../../components/Page/PageSegment'


const Blog = props => {
  const {
    focusBlogTypes = [],
    unFocusBolgType = [],
    blogTypes = [],
    loading,
    pages = {},
    userId, // 当前登录人id
    userInfo,
    hasAuth,
    notifyStatus, // 提示刷新状态
    activeIndex,
    currentPage,
    attentionList = [], // 关注列表
    attentionTotal,
    showAttendanceList, // 显示关注列表
    attendLoadComplete, // 标识关注

    dispatchChangeState,
    dispatchBlogTypes,
    dispatchBlogTypeInit,
    dispatchBlogInit,
    dispatchBlogList,
    dispatchUpdateUserAttention,
    dispatchBlogCommentList,
    dispatchFetchAttendList,
    dispatchSaveBlogComment,
    dispatchFetchBlogCommentById
  } = props

  const { windowHeight } = Taro.getSystemInfoSync()

  const [state, setState] = useState({
    showSearch: false, // 搜索

    fixed: false,
    refreshing: false, // 是否处于刷新状态

    toggleTab: false,

    showComment: false,
    showStar: false,
    currentComment: null,
    currentItem: null,
    comment: ''
  })

  useShareTimeline((res) => {
    console.log('onShareTimeline', res, state.shareConfig)
    return {
      ...(state.shareConfig || {})
    }
  })

  useShareAppMessage((res) => {
    console.log(res, state.shareConfig)
    return {
      ...(state.shareConfig || {})
    }
  })

  useReady(() => {
    if (!userInfo) {
      const user = Taro.getStorageSync('qince-loginInfo')?.userInfo
      dispatchChangeState({
        userInfo: user,
        userId: user?.id
      })
    }
    _initData()
  })

  // 初始化
  useEffect(() => {
    
  }, []) // eslint-disable-line

  const _initData = async () => {
    Taro.showLoading({
      title: '加载中'
    })
    // 加载日报类型
    await dispatchBlogTypes()

    // 初始化当前类型数据
    // await dispatchBlogTypeInit()
    // 获取当前日报列表数据
    // _initBlogData()
    await dispatchBlogInit()
    Taro.hideLoading()
  }

  const _getList = flag => {
    Taro.showLoading({
      title: '加载中'
    })
    if (!flag) {
      // flag： true：上拉加载， false： 下拉刷新
      _updateState({ refreshing: true })
    }
    dispatchBlogList(flag).then(response => {
      if (response.code === '1') {
        Taro.hideLoading({
          success: () => {
            if (!flag) {
              _updateState({ refreshing: false })
            }
          }
        })
      } else {
        Taro.hideLoading()
        Taro.showToast({
          icon: 'none',
          title: response.message
        })
      }
    })
  }

  const handleUpdateAttention = async (flag, list = [], count) => {
    await dispatchChangeState({
      showAttendanceList: flag,
      attentionTotal: count,
      attentionList: list,
      attendLoadComplete: true
    })
    if (flag) {
      _getList()
    }
  }

  // 点击日报卡片
  const handleClickPanel = (item, index) => {
    if (item.blog_type === '3') {
      // 日报类型 (1:日报  2: 分享 3: 评论 4:拜访 5:周报 6:月报)
      Taro.navigateTo({
        title: '日报',
        url: `/pages/Blog/Daily/index?id=${item.model_id}`
      })
    }
  }
  // 点击查看详情链接
  const handleClickContentLink = item => {
    let url = ''
    if (item.blog_type === '4' && item.work_type !== '') {
      // 拜访
      url = encodeURIComponent(
        `/wework/#/blog/blogVisit?id=${item.id}&visitId=${item.work_id}&tempUserCode=${item.publish_id}`
      )
    } else if (item.blog_type === '102' && item.work_type !== '') {
      // 线索跟进
      url = encodeURIComponent(
        `/wework/#/blog/blogSalesLeadFollow?id=${item.id}&cluesId=${item.work_id}&tempUserCode=${item.publish_id}`
      )

      Taro.navigateTo({
        path: '/blog/blogSalesLeadFollow',
        query: {
          id: item.id,
          cluesId: item.work_id,
          tempUserCode: item.publish_id
        }
      })
    } else if (item.blog_type === '103' && item.work_type !== '') {
      // 新增线索
      url = encodeURIComponent(
        `/wework/#/blog/blogClues?id=${item.id}&cluesId=${item.work_id}&tempUserCode=${item.publish_id}`
      )
    } else if (item.blog_type === '104' && item.work_type !== '') {
      url = encodeURIComponent(
        `/wework/#/blog/blogOpportunity?id=${item.id}&opportunityId=${item.work_id}&tempUserCode=${item.publish_id}&face=${item.publish_small_face}`
      )
    } else if (item.udf_link) {
      // 来自超级表单
      url = encodeURIComponent(
        `/wework/#/blog/blogUserDefined?id=${item.id}&formId=${request(
          'id',
          item.udf_link
        )}&funcId=${request('funcId', item.udf_link)}`
      )
    } else {
      let content = (item.content || '').replace(/<a (.*)>查看详情<\/a>/gi, '')
      let reg = new RegExp('<wqhref>(.*)##.*##<\\/wqhref>', 'gi')
      if (reg.test(content)) {
        let link = RegExp.$1
        if (link) {
          if (link.indexOf('.action') !== -1 || link.indexOf('.do') !== -1) {
            url = link
          } else if (link.indexOf('.html') !== -1) {
            url = link.replace(/webview:/, '')
          } else {
            url = link
          }
        }
      }
    }
    if (url) {
      Taro.navigateTo({
        url: `/pages/Blog/Detail/index?url=${url}`
      })
    }
  }

  // 点击头像
  const handleClickAvatar = item => {
    Taro.navigateTo({
      title: '个人动态',
      url: `/pages/Blog/Person/index?id=${item.publish_id}&userId=${userId}&tempUserCode=${item.publish_id}`
    })
  }
  // 点赞
  const handleClickPraise = item => {
    fetch({
      url: '/app/blog/v8/sendBlogSupport.do',
      params: {
        commented_id: item.id,
        commented_type: item.blog_type,
        terminal_type: '3',
        state: item.is_support === '1' ? '0' : '1'
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      if (response.code === '1') {
        currentPage.list = currentPage.list.map(attr => {
          let tmp = {...attr} // 重新创建个对象
          if (tmp.id === item.id) {
            if (item.is_support === '1') {
              tmp.is_support = '0'
            } else {
              tmp.is_support = '1'
            }
            tmp.supports = response.data_new
          }
          return tmp
        })
        _updateRedux()
      } else {
        Taro.showToast({
          icon: 'none',
          title: response.message
        })
      }
    })
  }
  // 回复
  const handleClickReply = (item, comment) => {
    let temp = {}
    if (
      comment.comments_allow_delete === '1' || 
      comment.commenter_id === userId
    ) {
      // 如果是自己的评论则删除
      Taro.showActionSheet({
        itemList: ['删除'],
        itemColor: '#f00000',
        success: function (res) {
          if (!res.cancel) {
            console.log(res.tapIndex)
            _clickActionSheet(item, comment, res.tapIndex)
          }
        },
        fail: function() {}
      })
    } else {
      temp = {
        showStar: false,
        showComment: !state.showComment
      }
    }
    setState(prev => ({
      ...prev,
      currentItem: item,
      currentComment: comment,
      ...temp
    }))
  }
  const _clickActionSheet = (item, comment) => {
    Taro.showModal({
      title: '提示',
      content: '删除后无法恢复，确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          fetch({
            url: '/app/blog/v8/web/setOneBlogCommentStatus.action',
            params: {
              'params.comment_id': comment.id,
              'params.info_id': comment.info_id,
              'params.status': '3'
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then(response => {
            if (response.code === '1') {
              Taro.showToast({
                icon: 'none',
                title: '删除成功',
                success: function () {
                  currentPage.list = currentPage.list.map(attr => {
                    if (attr.id === comment.info_id) {
                      return {
                        ...attr,
                        comments: attr.comments.filter(v => v.id !== comment.id)
                      }
                    }
                    return attr
                  })
                  _updateRedux()
                }
              })
            } else {
              Taro.showToast({
                icon: 'none',
                title: response.message
              })
            }
          })
        }
      }
    })
  }
  // 评论
  const handleClickComment = item => {
    let obj = {}
    if (item) {
      // 领导才可以评星
      if (
        item.blog_type !== '2' &&
        item.blog_type !== '100' &&
        item.is_leader === '1' &&
        item.score === 0
      ) {
        obj.showStar = true
        // obj.score = 0
      } else {
        obj.showStar = false
      }
      obj.currentItem = item
      obj.currentComment = null
    }

    setState(prev => ({
      ...prev,
      showComment: !state.showComment,
      comment: '',
      ...obj
    }))
  }

  const handleCommentChange = val => {
    setState(prev => ({
      ...prev,
      comment: val
    }))
  }

  const handleSendComment = score => {
    let con = {}
    if (state.currentComment) {
      // 回复评论
      con = {
        commented_id: state.currentComment.id,
        commented_type: '3'
      }
    } else {
      con = {
        commented_id: state.currentItem.id,
        commented_type: state.currentItem.blog_type
      }
    }
    if (state.showStar) {
      // 需要评星
      con['score'] = score
    } else {
      if (!(state.comment && state.comment.trim())) {
        Taro.showToast({
          icon: 'none',
          title: '请输入评论'
        })
        return false
      }
    }
    Taro.showLoading({
      title: '保存中...'
    })
    dispatchSaveBlogComment({
      terminal_type: '3',
      comment_content: state.comment,
      ...con
    }).then(response => {
      if (response.code === '1') {
        Taro.hideLoading({
          async success() {
            if (state.currentItem) {
              let result = await dispatchFetchBlogCommentById({
                'params.info_id': state.currentItem.id
              })
              let temp = {}
              if (result.code === '1') {
                if (state.showStar) {
                  // 需要评星
                  temp['score'] = score
                }
                currentPage.list = currentPage.list.map(v => {
                  if (v.id === state.currentItem.id) {
                    return {
                      ...v,
                      comments: result.data?.comments || [],
                      ...temp
                    }
                  }
                  return v
                })
                _updateRedux()
              } else {
                Taro.showToast({
                  icon: 'none',
                  title: result.message
                })
              }
            }
            setState(prev => ({
              ...prev,
              comment: '',
              showComment: false
            }))
            Taro.showToast({
              icon: 'none',
              title: response.message
            })
          }
        })
      } else {
        Taro.hideLoading({
          success() {
            Taro.showToast({
              icon: 'none',
              title: response.message
            })
          }
        })
      }
    })
  }

  // 分享
  const handleClickShare = item => {
    let content = item.content.replace(/&nbsp;/gi, ' ')
    if (item.model_value && item.model_value.length > 0) {
      let arr = item.model_value.map((model) => {
        return model.label + '\n' + model.value
      })
      arr.push(content)
      content = arr.join('\n')
    }
    const host = Taro.getStorageSync('appsvrUrl')
    let shareConfig = {
      title: `${item.publish_name}的${item.blog_type_name}`, // 分享标题
      desc: content, // 分享描述
      link: `${host}/_react_/blog/v1/dayBlog?tenantid=${userInfo.tenantId}&infoid=${item.id}`, // 分享链接
      // path: `${host}/_react_/blog/v1/dayBlog?tenantid=${userInfo.tenantId}&infoid=${item.id}`, // 分享链接
      imgUrl: 'https://res.waiqin365.com/d/wework/icon/logo.png' // 分享封面
    }
    _updateState({
      showShare: !state.showShare,
      shareConfig
    })
  }

  const handleToggleShare  = () => {
    _updateState({
      showShare: !state.showShare,
      shareConfig: null
    })
  }


  // 删除
  const handleClickDelete = item => {
    Taro.showModal({
      title: '提示',
      content: '删除后无法恢复，确定要删除吗？',
      success: () => {
        fetch({
          url: '/app/blog/v8/web/setOneBlogCommentStatus.action',
          params: {
            'params.info_id': item.id,
            'params.status': 3
          }
        }).then(response => {
          if (response.code === '1') {
            Taro.showToast({
              icon: 'none',
              title: '删除成功',
              success: () => {
                currentPage.list = currentPage.list.filter(v => v.id !== item.id)
                _updateRedux()
              }
            })
          } else {
            Taro.showToast({
              icon: 'none',
              title: response.message || '请求异常，请稍后重试！'
            })
          }
        })
      }
    })
  }

  // 新增日报
  const handleClickAdd = () => {
    Taro.navigateTo({
      title: '新增日报',
      url: '/pages/Blog/BlogTypes/index',
      events: {
        onReload(res) {
          dispatchBlogList()
        }
      }
    })
  }

  // 下拉刷新
  const handleRefresh = e => {
    console.log('first: 刷新', e)
    _getList()
  }

  const handlePageScroll = _throttle(function (e) {
    // currentPage.scrollTop = e.detail.scrollTop
    // _updateRedux()
  }, 500)
  // 触底下拉加载
  const handleScrollBottom = e => {
    console.log('first: 触底', e)
    console.log('useReachBottom:', focusBlogTypes[activeIndex])
    if (currentPage.hasMore) {
      // 修改加载状态
      // dispatchChangeState({
      //   currentPage: {...currentPage, status: 1},
      //   pages: {
      //     ...state.pages,
      //     [`${focusBlogTypes[activeIndex].id}`]: {...currentPage, status: 1}
      //   }
      // })
      _getList(true)
    }
  }

  const _getCommentList = flag => {
    Taro.showLoading({
      title: '加载中'
    })
    if (!flag) {
      // flag： true：上拉加载， false： 下拉刷新
      _updateState({ refreshing: true })
    }
    dispatchBlogCommentList({flag: flag}).then(response => {
      if (response.code === '1') {
        Taro.hideLoading({
          success: () => {
            if (!flag) {
              _updateState({ refreshing: false })
            }
          }
        })
      } else {
        Taro.hideLoading()
        Taro.showToast({
          icon: 'none',
          title: response.message
        })
      }
    })
  }

  // 评论刷新
  const handleCommentRefresh = () => {
    _getCommentList()
  }

  const handleCommentScrollBottom = () => {
    if (currentPage.hasMore) {
      _getCommentList()
    }
  }

  const _updateRedux = () => {
    dispatchChangeState({
      pages: {
        ...pages,
        [focusBlogTypes[activeIndex].id]: _cloneDeep(currentPage)
      }
    })
  }

  const _updateState = (val = {}) => {
    setState(prev => ({
      ...prev,
      ...val
    }))
  }

  // 点击tab页签
  const handleClickTab = async val => {
    await dispatchChangeState({
      activeIndex: val
    })
    Taro.setStorageSync('qince-blog-tabindex', val)
    dispatchBlogInit()
  }

  const handleSortTabItem = (sorts = []) => {
    // _updateState({toggleTab: !state.toggleTab})
    dispatchChangeState({
      focusBlogTypes: sorts.map(id => {
        return focusBlogTypes.filter(item => {
          return id === item.id
        })[0]
      })
    })
  }
  const handleAddTabItem = item => {
    // _updateState({toggleTab: !state.toggleTab})
    let tempUnFocusBlogType = unFocusBolgType.filter(v => {
      return v.id !== item.id
    })
    if (
      focusBlogTypes.filter(v => {
        return v.id === item.id
      }).length === 0
    ) {
      let tempFocusBlogTypes = [...focusBlogTypes, item]
      dispatchChangeState({
        focusBlogTypes: tempFocusBlogTypes,
        unFocusBolgType: tempUnFocusBlogType
      })
    } else {
      dispatchChangeState({
        unFocusBolgType: tempUnFocusBlogType
      })
    }
  }
  const handleRemoveTabItem = item => {
    let tempFocusBlogTypes = focusBlogTypes.filter(v => {
      return v.id !== item.id
    })
    let tempUnFocusBolgType = [...unFocusBolgType]

    if (!unFocusBolgType.find(v => v.id === item.id)) {
      tempUnFocusBolgType.unshift(item)
    }
    dispatchChangeState({
      focusBlogTypes: tempFocusBlogTypes,
      unFocusBolgType: tempUnFocusBolgType
    })
  }
  const handleCompleteTabItem = () => {
    // _updateState({toggleTab: !state.toggleTab})
    dispatchChangeState({
      activeIndex: 0
    })
    // TODO: 刷新store
    Taro.setStorageSync('qince-blog-tabindex', 0)
    Taro.setStorageSync('blog-focus-types', focusBlogTypes)
  }

      // 搜索
	const handleClickSearch = () => {
		// setState(prev => ({
    //   ...prev,
    //   showSearch: !state.showSearch
    // }))

    Taro.navigateTo({
      title: '搜索',
      url: '/pages/Blog/Search/index'
    })
	}

  if (!hasAuth) {
    return <Empty description='无权查看，请联系管理员开通！' />
  }

  return (
    <Page>
      <PageAffix>
        <Search onAdd={handleClickAdd} onSearch={handleClickSearch} />
        <BlogNav
          list={focusBlogTypes}
          target={unFocusBolgType}
          activeIndex={activeIndex}
          // :show-toggle="true"
          // :callback="onClickTabItem"
          onTabChange={handleClickTab}
          onSort={handleSortTabItem}
          onAdd={handleAddTabItem}
          onRemove={handleRemoveTabItem}
          onComplete={handleCompleteTabItem}
        />
      </PageAffix>
      <PageBody>
        <Tabs header={false} fixed>
          <View className='wq-navtab-notify'>
            {
              notifyStatus === 0 ? (
                <View className='wq-notify'>目前已经是最新的啦！</View>
              ) : notifyStatus > 0 ? (
                <View className='wq-notify'>更新了{notifyStatus}条信息</View>
              ) : null
            }
          </View>
          {focusBlogTypes.map((type, index) => (
            <TabsPanel key={`${type.id}`} index={index} current={activeIndex}>
              {/* 我的关注 */}
              {
                activeIndex === index  && (
                  type.id === '-2' ? (
                    <>
                      <Attention
                        userId={userId}
                        attentionTotal={attentionTotal}
                        attentionList={attentionList}
                        attendLoadComplete={attendLoadComplete}
                        uploadAttentionBlog={handleUpdateAttention}
                        dispatchFetchAttendList={dispatchFetchAttendList}
                        dispatchChangeState={dispatchChangeState}
                        dispatchUpdateUserAttention={dispatchUpdateUserAttention}
                      />
                      {
                        showAttendanceList && (
                          <>
                            {(currentPage.list || []).length > 0 ? (
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
                                style={{ height: `${windowHeight - 150}px` }}
                              >
                                {
                                  currentPage.list.map(item => {
                                    let compProps = {
                                      onClickComment: () => handleClickComment(item),
                                      onClickLink: () => handleClickContentLink(item),
                                      onClickShare: () => handleClickShare(item)
                                    }
                                    return (
                                      <Panel
                                        key={item.id}
                                        value={item}
                                        userId={userId}
                                        onPanelClick={() => handleClickPanel(item)}
                                        onClickAvatar={() => handleClickAvatar(item)}
                                        onClickPraise={() => handleClickPraise(item)}
                                        onClickReply={handleClickReply}
                                        {...compProps}
                                      />
                                    )
                                  })
                                }
                                {currentPage.hasMore && <LoadMore status={1} />}
                              </ScrollView>
                            ) : (
                              <Empty />
                            )}
                          </>
                        )
                      }
                    </>
                  ) :  type.id === '-5' ? (
                    <>
                      {(currentPage.list || []).length > 0 ? (
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
                          onScrollToLower={handleCommentScrollBottom}
                          onRefresherRefresh={handleCommentRefresh}
                          style={{ height: `${windowHeight - 92}px` }}
                        >
                          {
                            currentPage.list.map(item => {
                              return (
                                <Panel
                                  key={item.id}
                                  value={item}
                                  userId={userId}
                                  onPanelClick={() => handleClickPanel(item)}
                                  onClickAvatar={() => handleClickAvatar(item)}
                                  onClickPraise={() => handleClickPraise(item)}
                                  onClickReply={handleClickReply}
                                />
                              )
                            })
                          }
                          {currentPage.hasMore && <LoadMore status={1} />}
                        </ScrollView>
                      ) : (
                        <Empty />
                      )}
                    </>
                  ) : (
                    <>
                      {(currentPage.list || []).length > 0 ? (
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
                          style={{ height: `${windowHeight - 92}px` }}
                        >
                          {
                            currentPage.list.map(item => {
                              let compProps = {
                                onClickComment: () => handleClickComment(item),
                                onClickDelete: () => handleClickDelete(item),
                                onClickLink: () => handleClickContentLink(item),
                                onClickShare: () => handleClickShare(item)
                              }
                              return (
                                <Panel
                                  key={item.id}
                                  value={item}
                                  userId={userId}
                                  onPanelClick={() => handleClickPanel(item)}
                                  onClickAvatar={() => handleClickAvatar(item)}
                                  onClickPraise={() => handleClickPraise(item)}
                                  onClickReply={handleClickReply}
                                  {...compProps}
                                />
                              )
                            })
                          }
                          {currentPage.hasMore && <LoadMore status={1} />}
                        </ScrollView>
                      ) : (
                        <Empty />
                      )}
                    </>
                  )
                )
              }
            </TabsPanel>
          ))}
        </Tabs>
      </PageBody>

      <RootPortal>
        <BlogComment
          showStar={state.showStar}
          placeholder={
            state.currentComment ? `回复${state.currentComment.commenter_name}：` : '说点什么吧...'
          }
          show={state.showComment}
          value={state.comment}
          // contentStyle={{
          //   paddingBottom: 0
          // }}
          onToggle={handleClickComment}
          onSend={handleSendComment}
          onChange={handleCommentChange}
        />
      </RootPortal>
      <RootPortal>
        <Share 
          show={state.showShare}
          config={state.shareConfig}
          contentStyle={{paddingBottom: 0}}
          onToggle={handleToggleShare}
        />
      </RootPortal>
    </Page>
  )
}

function request(param, url) {
  var oRegex = new RegExp('[\\?&]' + param + '=([^&]+)', 'i')
  var oMatch = oRegex.exec(url || window.location.search)
  if (oMatch && oMatch.length > 1) {
    return oMatch[1]
  } else {
    return ''
  }
}

const mapStateToProps = state => ({
  ...state.Blog
})

const mapDispatchToProps = {
  ...actions
}

export default connect(mapStateToProps, mapDispatchToProps)(Blog)
