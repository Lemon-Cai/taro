/*
 * @Author: CaiPeng
 * @Date: 2022-09-14 15:49:15
 * @LastEditors: caipeng
 * @LastEditTime: 2023-02-22 20:21:04
 * @FilePath: \qince-taro\src\pages\Blog\components\Panel\Footer\index.js
 * @Description:
 */
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import classNames from 'classnames'
import format from '@/utils/format'

import { Icons } from '@/components/Icons'

// const ENV_TYPE = Taro.getEnv()

// 获取终端名称
const getTerminalName = type => {
  if (type === '1') {
    return 'iPhone'
  } else if (type === '2') {
    return 'Android'
  } else if (type === '4') {
    return '企业微信'
  }
  return '网页'
}

export default props => {
  const {
    userId = '', // 当前用户Id
    value
  } = props

  // 删除日报
  const handleDeleteBlog = () => {
    props.onDeleteBlog && props.onDeleteBlog()
  }

  // 评论日报
  const handleClickComment = e => {
    e.stopPropagation()
    props.onClickComment && props.onClickComment()
  }

  // 点赞
  const handleClickPraise = e => {
    e.stopPropagation()
    props.onClickPraise && props.onClickPraise()
  }

  // 转发(分享)
  const handleClickShare = (e) => {
    e.stopPropagation()
    props?.onClickShare?.()
    // console.log('first')
    // Taro.showShareMenu({
    //   withShareTicket: true,
    //   // showShareItems: ENV_TYPE === 'WEAPP' ? ['shareAppMessage', 'shareTimeline'] : []
    // })
  }

  // 回复
  const handleClickReply = (e) => {
    e.stopPropagation()
    props?.onClickReply?.(null, value)
  }

  return (
    <View className='wq-blog-panel-ft'>
      {value?.blog_type === '3' ? (
        <>
          <View className='wq-blog-time'>{format.formatDateDiff(value?.comment_time)}</View>
          <View className='wq-blog-op' onClick={handleClickReply}>
            <Icons value='comment' />
          </View>
        </>
      ) : (
        <>
          <View className='wq-blog-time'>
            <Text>
              {format.formatDateDiff(value?.publish_time)} 来自
              {getTerminalName(value?.terminal_type)}
            </Text>
            {value?.publish_id === userId &&
              value?.allow_delete === '1' &&
              value.supports?.length === 0 &&
              value.comments?.length === 0 &&
              !value?.score && (
                <Text className='wq-blog-anchor' onClick={handleDeleteBlog}>
                  删除
                </Text>
              )}
          </View>
          <View className='wq-blog-op'>
            {['1', '2', '4', '5', '6', '102', '103', '104', '105'].includes(value?.blog_type) &&
              process.env.TARO_ENV === 'weapp' && (
                <Icons value='relay' onClick={handleClickShare} />
              )}
            <Icons
              className={classNames({ active: value?.is_support === '1' })}
              value='praise'
              onClick={handleClickPraise}
            />
            <Icons value='comment' onClick={handleClickComment} />
          </View>
        </>
      )}
    </View>
  )
}
