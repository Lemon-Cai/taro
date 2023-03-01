/*
 * @Author: CaiPeng
 * @Date: 2022-09-14 15:49:15
 * @LastEditors: caipeng
 * @LastEditTime: 2023-02-10 15:57:39
 * @FilePath: \qince-taro\src\pages\Blog\components\Panel\index.js
 * @Description:
 */
import { View } from '@tarojs/components'

import BlogHeader from './Header'
import BlogBody from './Body'
import BlogFooter from './Footer'
import BlogOther from './Other'

export default props => {
  const {
    value,
    userId,
    onPanelClick,
    onClickLink,
    onDeleteBlog,
    onClickPraise,
    onClickComment,
    onClickReply,
    onClickShare
  } = props

  // 点击日报，查看日报详情
  const handleClick = e => {
    e.stopPropagation()
    onPanelClick && onPanelClick()
  }

  return (
    <View className='wq-blog-panel' onClick={handleClick}>
      <BlogHeader value={value} onClickAvatar={props.onClickAvatar} />
      <BlogBody value={value} onClickContent={onClickLink} />
      <BlogFooter
        value={value}
        userId={userId}
        onDeleteBlog={onDeleteBlog}
        onClickPraise={onClickPraise}
        onClickComment={onClickComment}
        onClickReply={onClickReply}
        onClickShare={onClickShare}
      />
      {value?.blog_type !== '3' && <BlogOther value={value} onClickReply={onClickReply} />}
    </View>
  )
}
