import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { View, Text, Form, Input, ScrollView, PageContainer, RootPortal } from '@tarojs/components'
import { useState } from 'react'
import { styled } from 'linaria/lib/react'
import { connect } from 'react-redux'
import _cloneDeep from 'lodash/cloneDeep'

import { Page, PageBody, PageAffix } from '@/components/Page'
import { Icons } from '@/components/Icons'
import { Empty } from '@/components/Empty'
import { LoadMore } from '@/components/LoadMore'

import fetch from '@/utils/request'

import * as actions from '@/store/Blog'

import Panel from '../components/Panel'
// import BlogFilter from '../components/BlogFilter'
import BlogComment from '../components/Comment'
import Share from '../components/Share'
import Filter from './Filter'

import './index.less'

const StyledInput = styled(View)`
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 8px;
  .qince-icon-search {
    color: #999;
    font-size: 12px;
    margin-right: 8px;
  }

  .qince-icon-clear {
    color: #ccc;
    z-index: 99;
    margin-left: 8px;
  }

  input {
    padding: 4px 0;
    width: 100%;
    height: 1.42857143em;
    border: 0;
    font-size: 14px;
    line-height: 1.42857143em;
    box-sizing: content-box;
    background: transparent;
  }
`

function Search({
  userId, // 当前登录人id
  userInfo,

  dispatchSaveBlogComment,
  dispatchFetchBlogCommentById
}) {
  const { windowHeight } = Taro.getSystemInfoSync()

  const [filterState, setFilterState] = useState({
    showFilter: false,

    list: [],
    searchVal: '',
    hasMore: true,
    refreshing: false,
    queryParams: {},

    limit: 20
  })

  useShareTimeline((res) => {
    console.log('onShareTimeline', res, filterState.shareConfig)
    return {
      ...(filterState.shareConfig || [])
    }
  })

  useShareAppMessage((res) => {
    console.log(res, filterState.shareConfig)
    return {
      ...(filterState.shareConfig || [])
    }
  })

  const handleInputChange = e => {
    console.log('handleInputChange: ', e)
    _updateFilterState({
      searchVal: e.detail.value
    })
  }
  const handleInputConfirm = e => {
    _getSearchList(false, {
      'params.keyword': e.detail.value
    })
  }

  const handleCancel = () => {
    Taro.navigateBack({
      delta: 1
    })
  }
  const handleClickMore = () => {
    _updateFilterState({
      showFilter: !filterState.showFilter
    })
  }

  const handleClear = () => {
    _updateFilterState({
      searchVal: '',
      isComplete: false,
      list: [],
      hasMore: true,
      noData: false,
      errMsg: null
    })
  }

  const _updateFilterState = (val = {}) => {
    setFilterState(prev => ({
      ...prev,
      ...val
    }))
  }

  // 获取搜索数据
  const _getSearchList = (flag, params) => {
    let con = {
      'params.request_type': '2',
      'params.blogMenuId': '6778072811795709662',
      'params.keyword': filterState.searchVal,
      ...params
    }
    if (con['params.start_date']) {
      con['params.start_date'] += ' 00:00'
    }
    if (con['params.end_date']) {
      con['params.end_date'] += ' 23:59'
    }
    if (flag) {
      con['params.latest_time'] = filterState.list?.slice(-1)[0]?.publish_time
    }
    if (!flag) {
      // flag： true：上拉加载， false： 下拉刷新
      _updateFilterState({ refreshing: true })
    }
    fetch({
      url: '/app/blog/v8/web/getBlogListInfo.action',
      params: con,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      let hasMore = true
      let list = []
      let noData = false
      let errMsg
      if (response.code === '1') {
        let blogs = response.data.blogs || []
        if (flag) {
          list = (filterState.list || []).concat(blogs)
        } else {
          list = blogs
        }
        if (list?.length === 0) {
          noData = true
        } else {
          noData = false
        }
        if (blogs?.length < (filterState?.limit || 20)) {
          // 是否还存在数据
          hasMore = false
        }
        if (!flag) {
          _updateFilterState({ refreshing: false })
        }
      } else {
        errMsg = response.message || '请求异常'
        Taro.showToast({
          icon: 'none',
          title: errMsg
        })
      }
      _updateFilterState({
        hasMore,
        list,
        noData,
        errMsg,
        isComplete: true
      })
    })
  }

  // 查询
  const handleFilterSubmit = (params = {}) => {
    _updateFilterState({
      searchVal: '',
      showFilter: !filterState.showFilter,
      queryParams: {
        ...params
      }
    })
    _getSearchList(false, params)
  }

  // 重置
  const handleFilterReset = () => {
    _updateFilterState({ queryParams: {} })
  }

  const handleFilterRefresh = () => {
    _getSearchList(false)
  }

  const handleFilterScrollBottom = () => {
    if (filterState.hasMore) {
      _getSearchList(true)
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
        _updateFilterState({
          list: _cloneDeep(filterState.list).map(attr => {
            let tmp = { ...attr } // 重新创建个对象
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
        })
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
    if (comment.comments_allow_delete === '1' || comment.commenter_id === userId) {
      // 如果是自己的评论则删除
      Taro.showActionSheet({
        itemList: ['删除'],
        itemColor: '#f00000',
        success: function(res) {
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
        showComment: !filterState.showComment
      }
    }
    _updateFilterState({
      currentItem: item,
      currentComment: comment,
      ...temp
    })
  }
  const _clickActionSheet = (item, comment) => {
    Taro.showModal({
      title: '提示',
      content: '删除后无法恢复，确定要删除吗？',
      success: function(res) {
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
                success: function() {
                  _updateFilterState({
                    list: _cloneDeep(filterState.list).map(attr => {
                      if (attr.id === comment.info_id) {
                        return {
                          ...attr,
                          comments: attr.comments.filter(v => v.id !== comment.id)
                        }
                      }
                      return attr
                    })
                  })
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

    _updateFilterState({
      showComment: !filterState.showComment,
      comment: '',
      ...obj
    })
  }

  const handleCommentChange = val => {
    _updateFilterState({ comment: val })
  }

  const handleSendComment = score => {
    let con = {}
    if (filterState.currentComment) {
      // 回复评论
      con = {
        commented_id: filterState.currentComment.id,
        commented_type: '3'
      }
    } else {
      con = {
        commented_id: filterState.currentItem.id,
        commented_type: filterState.currentItem.blog_type
      }
    }
    if (filterState.showStar) {
      // 需要评星
      con['score'] = score
    } else {
      if (!(filterState.comment && filterState.comment.trim())) {
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
      comment_content: filterState.comment,
      ...con
    }).then(response => {
      if (response.code === '1') {
        Taro.hideLoading({
          async success() {
            if (filterState.currentItem) {
              let result = await dispatchFetchBlogCommentById({
                'params.info_id': filterState.currentItem.id
              })
              let temp = {}
              if (result.code === '1') {
                if (filterState.showStar) {
                  // 需要评星
                  temp['score'] = score
                }
                _updateFilterState({
                  list: _cloneDeep(filterState.list).map(v => {
                    if (v.id === filterState.currentItem.id) {
                      return {
                        ...v,
                        comments: result.data?.comments || [],
                        ...temp
                      }
                    }
                    return v
                  })
                })
              } else {
                Taro.showToast({
                  icon: 'none',
                  title: result.message
                })
              }
            }
            _updateFilterState({
              comment: '',
              showComment: false
            })
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
    _updateFilterState({
      showShare: !filterState.showShare,
      shareConfig
    })
  }

  const handleToggleShare  = () => {
    _updateFilterState({
      showShare: !filterState.showShare,
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
                _updateFilterState({
                  list: _cloneDeep(filterState.list).filter(v => v.id !== item.id)
                })
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

  // 点击日报卡片
  const handleClickPanel = item => {
    if (item.blog_type === '3') {
      // 日报类型 (1:日报  2: 分享 3: 评论 4:拜访 5:周报 6:月报)
      Taro.navigateTo({
        title: '日报',
        url: `/pages/Blog/Daily/index?id=${item.model_id}`
      })
    }
  }

  return (
    <Page>
      <PageAffix>
        <View className='blog-search'>
          <View className='btn-more'>
            <Text onClick={handleClickMore}>更多</Text>
          </View>
          <View className='weui-flex__item'>
            <Form>
              <StyledInput>
                <Icons value='search' />
                <Input
                  focus
                  alwaysSystem
                  value={filterState.searchVal}
                  placeholder='发布人/关键词'
                  placeholderStyle='font-size: 13px;'
                  onInput={handleInputChange}
                  onConfirm={handleInputConfirm}
                />
                {filterState.searchVal && (
                  <Icons value='clear' color='#ccc' onClick={handleClear} />
                )}
              </StyledInput>
            </Form>
          </View>
          <View className='btn-cancel' onClick={handleCancel}>
            <Text>取消</Text>
          </View>
        </View>
      </PageAffix>
      <PageBody>
        {filterState.isComplete ? (
          <ScrollView
            className='scrollView'
            scrollY
            enhanced
            enableBackToTop
            scrollWithAnimation
            refresherEnabled
            // pagingEnabled
            refresherTriggered={filterState.refreshing}
            onScrollToLower={handleFilterScrollBottom}
            onRefresherRefresh={handleFilterRefresh}
            style={{ maxHeight: `${windowHeight - 46}px` }}
          >
            {(filterState.list || []).length > 0 ? (
              filterState.list.map(item => {
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
            ) : (
              <Empty description='暂无数据' />
            )}
            {filterState.hasMore && <LoadMore status={1} />}
          </ScrollView>
        ) : (
          <View class='blog-search-show'>
            默认展示本月和上月的数据，点击“
            <Text class='blog-text-more' onClick={handleClickMore}>
              更多
            </Text>
            ”可根据部门、职务、发布时间、类型等搜索更多历史数据
          </View>
        )}
      </PageBody>
                
      {/* <BlogFilter
        show={filterState.showFilter}
        width="85%"
        onSubmit={handleFilterSubmit}
        onReset={handleFilterReset}
        onClose={handleClickMore}
      /> */}
      
      <BlogComment
        showStar={filterState.showStar}
        placeholder={
          filterState.currentComment
            ? `回复${filterState.currentComment.commenter_name}：`
            : '说点什么吧...'
        }
        show={filterState.showComment}
        value={filterState.comment}
        onToggle={handleClickComment}
        onSend={handleSendComment}
        onChange={handleCommentChange}
      />

      <RootPortal>
        <Share 
          show={filterState.showShare}
          config={filterState.shareConfig}
          // contentStyle={{paddingBottom: 0}}
          onToggle={handleToggleShare}
        />
      </RootPortal>
      <PageContainer
        show={filterState.showFilter}
        duration={200}
        zIndex={100}
        overlay
        round={false} // 是否显示圆角
        position='right'
        customStyle='width: 85%; position: absolute; left: 15%; right: 0; top: 0; bottom: calc(50px + constant(safe-area-inset-bottom));'
        onClickOverlay={handleClickMore}
      >
        <Filter
          onSubmit={handleFilterSubmit}
          onReset={handleFilterReset}
          onClose={handleClickMore}
        />
      </PageContainer>
    </Page>
  )
}

const mapStateToProps = state => ({
  userId: state.Blog?.userId,
  userInfo: state.Blog?.userInfo,
})

const mapDispatchToProps = {
  ...actions
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
